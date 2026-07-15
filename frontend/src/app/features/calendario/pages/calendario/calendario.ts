
import { Component, OnInit, Inject, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { CalendarioService } from '../../../../core/service/calendario.service'; 

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class CalendarioComponent implements OnInit {
  
  isBrowser = false;
  calendarOptions: any;
  listaEventos: any[] = [];
  eventsLoaded = false; // 

  private calendarioService = inject(CalendarioService);
  private cdr = inject(ChangeDetectorRef);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.initCalendarOptions();
    if (this.isBrowser) {
      this.cargarEventosDelBackend();
    }
  }

  initCalendarOptions() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin, listPlugin],
      initialView: 'dayGridMonth',
      locale: 'es', 
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,listMonth'
      },
      buttonText: {
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        list: 'Agenda'
      },
      editable: true,
      selectable: true,
      events: [] 
    };
  }

  cargarEventosDelBackend() {
    this.calendarioService.obtenerEventos().subscribe({
      next: (tareasDesdeBack: any) => {
        console.log('Datos crudos que vienen de NestJS:', tareasDesdeBack);

        if (Array.isArray(tareasDesdeBack)) {
          const eventosMapeados = tareasDesdeBack.map((tarea: any) => {
            const startLimpio = tarea.fecha_inicio ? new Date(tarea.fecha_inicio).toISOString().split('T')[0] : null;
            const endLimpio = tarea.fecha_limite ? new Date(tarea.fecha_limite).toISOString().split('T')[0] : null;

            return {
              title: tarea.descripcion || tarea.titulo || 'Tarea sin título', 
              start: startLimpio,
              end: endLimpio,
              color: '#6366f1'
            };
          });

          this.listaEventos = eventosMapeados.filter(evento => evento.start !== null);

          this.calendarOptions = {
            ...this.calendarOptions,
            events: this.listaEventos
          };

          this.eventsLoaded = true; 
          this.cdr.detectChanges(); 
        }
      },
      error: (err) => {
        console.error('Error al mapear las tareas en el calendario:', err);
      }
    });
  }
}