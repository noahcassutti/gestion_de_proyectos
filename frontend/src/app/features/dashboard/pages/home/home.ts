import { Component, OnInit, Inject, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { UiService } from '../../../../core/service/ui';
import { ProyectoService } from '../../../proyectos/proyecto-api';
import { TareaService } from '../../../tareas/tarea-api';
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { AuthStore } from '../../../../features/auth/auth-store';
import { Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { CalendarioService } from '../../../../core/service/calendario.service'; 
import { DashboardService } from '../../services/dashboard';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [ChartModule, ButtonModule, CommonModule, FullCalendarModule, ToastModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  providers: [MessageService],
})
export class Home implements OnInit {

  chartData: any;
  chartOptions: any;
  chartProyectos: any;
  chartTareas: any;
  isBrowser = false;
  username: string = '';
  calendarOptions: any;
  rolActual: string | null = null;
  
  private calendarioService = inject(CalendarioService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  constructor(
    private uiService: UiService,
    private proyectoService: ProyectoService,
    private tareaService: TareaService,
    private authStore: AuthStore,
    private router: Router,
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.initChartOptions();
    this.initCalendarOptions();
    const nombreUsuario = this.authStore.obtenerNombreUsuario();
    this.username = nombreUsuario ?? 'Usuario';
    this.rolActual = this.authStore.obtenerRol();

    if (this.isBrowser) {
      this.cargarEventosDelBackend();
      this.cargarEstadisticas();
    }
  }
  initChartOptions() {
    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#495057' }
        }
      },
      cutout: '60%' 
    };
  }
  
  cargarEstadisticas() {
    this.dashboardService.obtenerResumenGeneral().subscribe({
      next: (data) => {
        
        this.chartProyectos = {
          labels: ['Activos', 'Finalizados', 'Baja'],
          datasets: [
            {
              data: [
                data.proyectos.activos, 
                data.proyectos.finalizados, 
                data.proyectos.baja
              ],
              backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
              hoverBackgroundColor: ['#2563eb', '#059669', '#dc2626']
            }
          ]
        };

        
        this.chartTareas = {
          labels: ['Pendientes', 'Completadas'],
          datasets: [
            {
              data: [
                data.tareas.pendientes, 
                data.tareas.completadas
              ],
              backgroundColor: ['#f59e0b', '#8b5cf6'],
              hoverBackgroundColor: ['#d97706', '#7c3aed']
            }
          ]
        };
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las estadísticas del dashboard:', err);
      }
    });
  }


  initCalendarOptions() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin, listPlugin],
      initialView: 'listMonth',
      locale: 'es',
      headerToolbar: false,
      listDayFormat: false,
      listDaySideFormat: false,

      eventContent: (arg: any) => {
        const fecha = arg.event.start;
        const dia = fecha.getDate();
        const mes = fecha.toLocaleString('es-ES', { month: 'short' }).toUpperCase();
        const proyecto = arg.event.extendedProps['proyecto'] || 'Sin proyecto'; 
        
        const etiqueta = this.calcularEtiqueta(fecha);

        return {
          html: `
            <div class="timeline-row">
              <div class="fecha-col">
                <div class="dia-num">${dia}</div>
                <div class="mes-txt">${mes}</div>
              </div>
              <div class="info-col">
                <div class="titulo-tarea">${arg.event.title}</div>
                <div class="proyecto-sub">${proyecto}</div>
              </div>
              <div class="badge-col">
                <span class="badge-tiempo">${etiqueta}</span>
              </div>
            </div>
          `
        };
      },
      events: [] 
    };
  }

  cargarEventosDelBackend() {
    this.calendarioService.obtenerEventos().subscribe({
      next: (tareasDesdeBack: any) => {
        if (Array.isArray(tareasDesdeBack)) {
          const eventosMapeados = tareasDesdeBack.map((tarea: any) => {
            const startLimpio = tarea.fecha_inicio ? new Date(tarea.fecha_inicio).toISOString().split('T')[0] : null;
            
            return {
              title: tarea.descripcion || tarea.titulo || 'Tarea sin título', 
              start: startLimpio,
              color: tarea.estado === 'FINALIZADA' ? '#10b981' : '#3b82f6',
  
              extendedProps: {
                proyecto: tarea.proyecto?.nombre || 'Sin proyecto' 
              }
            };
          });

          const eventosFiltrados = eventosMapeados.filter(evento => evento.start !== null);

          this.calendarOptions = {
            ...this.calendarOptions,
            events: eventosFiltrados
          };

          this.cdr.detectChanges(); 
        }
      },
      error: (err) => {
        console.error('Error al cargar eventos en la Home:', err);
      }
    });
  }

  calcularEtiqueta(fecha: Date): string {
    const hoy = new Date();
    const fechaClon = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    const hoyClon = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    
    const diffTime = fechaClon.getTime() - hoyClon.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 0) return 'Pasado';
    return `En ${diffDays} días`;
  }

  initChart() {
    this.chartData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Tareas Completadas',
          backgroundColor: '#818cf8', 
          borderColor: '#818cf8',
          data: [65, 59, 80, 81, 56, 95]
        },
        {
          label: 'Nuevos Proyectos',
          backgroundColor: '#38bdf8', 
          borderColor: '#38bdf8',
          data: [28, 48, 40, 19, 86, 27]
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false, 
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: '#495057' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#6c757d' },
          grid: { color: '#dfe7ef', drawBorder: false }
        },
        y: {
          ticks: { color: '#6c757d' },
          grid: { color: '#dfe7ef', drawBorder: false }
        }
      }
    };
  }

  abrirModalNuevoProyecto(){
    const ref = this.uiService.openNuevoProyecto();

    if (ref) {
      ref.onClose.subscribe((datosDelFormulario: any)=>{
        if(datosDelFormulario && datosDelFormulario.nombre){
          
          
          const proyectoLimpio: any = {
            nombre: datosDelFormulario.nombre.trim()
          };

          
          if (datosDelFormulario.idCliente) {
            proyectoLimpio.idCliente = Number(datosDelFormulario.idCliente);
          }

          
          this.proyectoService.crearProyecto(proyectoLimpio).subscribe({
            next: () => {
              this.cargarEstadisticas();
              
              this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Proyecto registrado exitosamente' });
            },
            error: (err) => {
              
              let mensajeBackend = 'No se pudo crear el proyecto';
              if (err.error && err.error.message) {
                  mensajeBackend = Array.isArray(err.error.message) 
                      ? err.error.message.join(', ') 
                      : err.error.message;
              }
              this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeBackend });
            }
          });
        }
      });
    }
  }

  abrirModalNuevaTarea() {
    const ref = this.uiService.openNuevaTarea();

    if (ref) {
      ref.onClose.subscribe((datosDeLaTarea: any) => {
        if (datosDeLaTarea) {
          
          console.log('Datos que salen del modal en Home:', datosDeLaTarea);
          const tareaMapeada = {
            descripcion: datosDeLaTarea.titulo, 
            id_proyecto: Number(datosDeLaTarea.proyectoId), 
            estado: 'PENDIENTE',
            fecha_inicio: datosDeLaTarea.fecha_inicio || null,
            fecha_limite: datosDeLaTarea.fecha_limite || null
          };

          this.tareaService.crearTarea(tareaMapeada).subscribe({
            next: () => {
              this.cargarEstadisticas();
              this.cargarEventosDelBackend();
              // Lanzamos el cartel de éxito
              this.messageService.add({ severity: 'success', summary: 'Tarea Creada', detail: 'Se agregó la tarea con éxito.' });
            },
            error: (err) => {
              // backend
              let mensajeBackend = 'No se pudo crear la tarea';
              if (err.error && err.error.message) {
                  mensajeBackend = Array.isArray(err.error.message) 
                      ? err.error.message.join(', ') 
                      : err.error.message;
              }
              this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeBackend });
            }
          });
        }
      });
    }
  }

  navegarAUsuarios(): void {
    this.router.navigate(['/usuarios']);
  }

  navegarAlCalendario(): void {
    this.router.navigate(['/calendario']); 
  }
}