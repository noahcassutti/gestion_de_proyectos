
import { Component, OnInit, inject, ChangeDetectorRef, signal, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectItem, MessageService } from 'primeng/api';
import { Back } from '../../../../shared/components/back/back';
import { UiService } from '../../../../core/service/ui';
import { TareaService } from '../../tarea-api';
import { Tarea, TareaPayload } from '../../../../shared/interfaces/tarea';
import { ProyectoService } from '../../../proyectos/proyecto-api';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from '../../../auth/auth-store';
import { isPlatformBrowser, DatePipe } from '@angular/common'; 
import { Download } from '../../../../shared/components/download/download';


@Component({
    selector: 'app-tareas-tabla',
    standalone: true,
    imports: [
        SelectModule, TableModule, TagModule, ToastModule, 
        ButtonModule, InputTextModule, RippleModule, 
        FormsModule, Back, DatePipe, Download
    ],
    templateUrl: './tarea-list.html',
    styleUrls: ['./tarea-list.css'],
    providers: [MessageService] 
})
export class Tareas implements OnInit {
    private messageService = inject(MessageService);
    private uiService = inject(UiService); 
    private tareaService = inject(TareaService);
    private cdr = inject(ChangeDetectorRef);
    private proyectoService = inject(ProyectoService);
    private route = inject(ActivatedRoute); 
    private platformId = inject(PLATFORM_ID);
    

    private authStore = inject(AuthStore);
    rolActual = this.authStore.obtenerRol();

    idProyectoActual!: number;
    infoProyecto = signal<any>(null);
    
    tareas = signal<Tarea[]>([]);
    statuses!: SelectItem[];
    clonedTareas: { [s: string]: Tarea } = {};
    loading = false;
    
ngOnInit() {
        if (this.rolActual === 'ADMIN') {
            this.statuses = [
                { label: 'PENDIENTE', value: 'PENDIENTE' },
                { label: 'FINALIZADA', value: 'FINALIZADA' },
                { label: 'BAJA', value: 'BAJA' }
            ];
        } else {
            this.statuses = [
                { label: 'PENDIENTE', value: 'PENDIENTE' },
                { label: 'FINALIZADA', value: 'FINALIZADA' }
            ];
        }

        if (isPlatformBrowser(this.platformId)) {
            this.route.paramMap.subscribe(params => {
                const id = params.get('id');
                if (id) {
                    this.idProyectoActual = Number(id);
                    this.cargarTodoElDetalle();
                }
            });
        }
    }
   
    get esProyectoActivo(): boolean {
        const estado = this.infoProyecto()?.estado;
        return estado !== 'BAJA' && estado !== 'FINALIZADO';
    }

    cargarTodoElDetalle() {
        this.proyectoService.obtenerUnProyecto(this.idProyectoActual).subscribe({
            next: (proyecto) => {
                this.infoProyecto.set(proyecto);
                this.cdr.detectChanges();
            }
        });
        this.loadTareas();
    }

    loadTareas() {
        this.loading = true;
        this.tareaService.getTareasPorProyecto(this.idProyectoActual).subscribe({
            next: (data) => {
                this.tareas.set(Array.isArray(data) ? data : []);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar las tareas' });
                this.cdr.detectChanges();
            }
        });
    }

    onRowEditInit(tarea: Tarea) {
        this.clonedTareas[tarea.id as string] = { ...tarea };
    }
    
    onRowEditSave(tarea: Tarea) {
        if (tarea.descripcion && tarea.descripcion.trim().length > 0) {
            
            const payload: TareaPayload = {
                descripcion: tarea.descripcion.trim(),
                estado: tarea.estado,
                id_proyecto: Number(tarea.id_proyecto),
                fecha_inicio: tarea.fecha_inicio || null,
                fecha_limite: tarea.fecha_limite || null,
            };

            this.tareaService.actualizarTarea(Number(tarea.id), payload).subscribe({
                next: () => {
                    delete this.clonedTareas[tarea.id as string];
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea actualizada' });
                },
                error: (err) => {
                    console.error('Error al actualizar tarea:', err);
                    this.onRowEditCancel(tarea, this.tareas().findIndex(t => t.id === tarea.id));
                    
                    // Capturamos el mensaje de NestJS
                    let mensajeBackend = 'No se pudo guardar la actualización';
                    if (err.error && err.error.message) {
                        mensajeBackend = Array.isArray(err.error.message) 
                            ? err.error.message.join(', ') 
                            : err.error.message;
                    }

                    this.messageService.add({ severity: 'error', summary: 'Operación denegada', detail: mensajeBackend });
                }
            });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'La descripción no puede quedar vacía' });
        }
    }

    onRowEditCancel(tarea: Tarea, index: number) {
        this.tareas.update(listaActual => {
            listaActual[index] = this.clonedTareas[tarea.id as string];
            return [...listaActual]; 
        });
        delete this.clonedTareas[tarea.id as string];
    }

    crearNuevaTarea() {

        const ref = this.uiService.openNuevaTarea({ idProyectoFijo: this.idProyectoActual });

        if (ref) {
            ref.onClose.subscribe((datosDeLaTarea: any) => {
                if (datosDeLaTarea) {
                    const payload: TareaPayload = {
                        descripcion: datosDeLaTarea.titulo,
                        estado: 'PENDIENTE',
                        id_proyecto: this.idProyectoActual,
                        fecha_inicio: datosDeLaTarea.fecha_inicio || null,
                        fecha_limite: datosDeLaTarea.fecha_limite || null,
                    };

                    this.tareaService.crearTarea(payload).subscribe({
                        next: () => {
                            this.loadTareas(); 
                            this.messageService.add({ severity: 'success', summary: 'Tarea Creada', detail: 'Se agregó la tarea con éxito.' });
                        },
                        error: (err) => {
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

    confirmDeleteTarea(tarea: Tarea) {
        if (this.rolActual !== 'ADMIN') {
            this.messageService.add({ severity: 'error', summary: 'Denegado', detail: 'Solo los administradores pueden eliminar tareas' });
            return;
        }

        if (confirm(`¿Estás seguro de eliminar "${tarea.descripcion}"?`)) {
            this.tareaService.eliminarTarea(Number(tarea.id)).subscribe({
                next: () => {
                    this.tareas.update(lista => lista.filter(t => t.id !== tarea.id));
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea dada de baja' });
                },
                error: (err) => {
                    let mensajeBackend = 'No se puede eliminar la tarea';
                    if (err.error && err.error.message) {
                        mensajeBackend = Array.isArray(err.error.message) 
                            ? err.error.message.join(', ') 
                            : err.error.message;
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeBackend });
                }
            });
        }
    }

    getSeverity(status: string) {
        switch (status) {
            case 'PENDIENTE': return 'success';
            case 'FINALIZADA': return 'warn';
            case 'BAJA': return 'danger';
            default: return 'secondary';
        }
    }

    getLabelEstado(status: string): string {
        const found = this.statuses.find(s => s.value === status);
        return found?.label ?? status;
    }
 exportarCsvBackend() {
        if (this.idProyectoActual) {
            this.proyectoService.descargarCsvProyectoEspecifico(this.idProyectoActual).subscribe({
                next: (blob: Blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;

                    a.download = `proyecto_${this.idProyectoActual}_tareas.csv`;
                    
                    document.body.appendChild(a);
                    a.click();
                    
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);

                    this.messageService.add({ 
                        severity: 'success', 
                        summary: 'Descarga Exitosa', 
                        detail: 'El archivo CSV se ha generado correctamente.' 
                    });
                },
                error: (err) => {
                    console.error('Error al descargar el CSV del proyecto:', err);
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'No se pudo procesar la descarga del reporte.' 
                    });
                }
            });
        }
    }
}