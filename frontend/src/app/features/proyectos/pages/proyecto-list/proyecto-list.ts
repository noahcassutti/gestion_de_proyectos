import { Component, OnInit, inject, ChangeDetectorRef, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UiService } from '../../../../core/service/ui';
import { Back } from '../../../../shared/components/back/back';
import { ProyectoService } from '../../proyecto-api';
import { Proyecto } from '../../../../shared/interfaces/proyecto';
import { AuthStore } from '../../../auth/auth-store'; 
import { Download } from '../../../../shared/components/download/download';

@Component({
    selector: 'app-proyecto-list',
    imports: [
        SelectModule, TableModule, TagModule, ToastModule, 
        ButtonModule, InputTextModule, RippleModule, 
        FormsModule, Back, Download
    ],
    templateUrl: './proyecto-list.html',
    styleUrls: ['./proyecto-list.css'],
    providers: [MessageService] 
})
export class ProyectoList implements OnInit {
    private messageService = inject(MessageService);
    private uiService = inject(UiService); 
    private proyectoService = inject(ProyectoService);
    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);
    private authStore = inject(AuthStore);
    
    rolActual = this.authStore.obtenerRol();
    proyectos = signal<Proyecto[]>([]);
    statuses!: SelectItem[];
    clonedProyectos: { [s: string]: Proyecto } = {};
    
    totalRegistros: number = 0;
    ultimoEventoLazy: any;

    ngOnInit() {
        if (this.rolActual === 'ADMIN') {
            this.statuses = [
                { label: 'Activo', value: 'ACTIVO' },
                { label: 'Finalizado', value: 'FINALIZADO' },
                { label: 'Baja', value: 'BAJA' }
            ];
        } else {
            this.statuses = [
                { label: 'Activo', value: 'ACTIVO' },
                { label: 'Finalizado', value: 'FINALIZADO' }
            ];
        }
    }  
    
    verDetalleProyecto(proyecto: Proyecto) {
        this.router.navigate(['/proyectos', proyecto.id, 'tareas']);
    }

    cargarProyectosLazy(event: any) {
        this.ultimoEventoLazy = event;

        const page = (event.first / event.rows) + 1;
        const limit = event.rows;
        const search = event.globalFilter || '';
        
        const filtroEstado = event.filters?.['estado'];
        const estado = Array.isArray(filtroEstado) ? filtroEstado[0]?.value : filtroEstado?.value;
        const estadoFinal = estado || ''; 

        this.proyectoService.obtenerProyectos(page, limit, search, estadoFinal).subscribe({
            next: (response) => {
                this.proyectos.set(response.data);
                this.totalRegistros = response.total;
                this.cdr.detectChanges();
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron sincronizar los datos con el servidor' });
            }
        });
    }

    onRowEditInit(proyecto: Proyecto) {
        this.clonedProyectos[proyecto.id] = { ...proyecto };
    }

    onRowEditSave(proyecto: Proyecto) {
        if (proyecto.nombre && proyecto.nombre.trim().length > 0) {
            const payloadLimpio = {
                nombre: proyecto.nombre,
                estado: proyecto.estado,
                idCliente: proyecto.idCliente
            };

            this.proyectoService.actualizarProyecto(proyecto.id, payloadLimpio).subscribe({
                next: () => {
                    delete this.clonedProyectos[proyecto.id];
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proyecto actualizado en la base de datos' });
                },
                error: (err) => {
                    console.error(err);
                    this.onRowEditCancel(proyecto, this.proyectos().findIndex(p => p.id === proyecto.id));
                    
                    // ACÁ ESTÁ LA MAGIA: Capturamos el error exacto de NestJS
                    let mensajeBackend = 'Fallo al actualizar el proyecto';
                    if (err.error && err.error.message) {
                        mensajeBackend = Array.isArray(err.error.message) 
                            ? err.error.message.join(', ') 
                            : err.error.message;
                    }

                    this.messageService.add({ severity: 'error', summary: 'Operación denegada', detail: mensajeBackend });
                }
            });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'El nombre es obligatorio' });
        }
    }

    onRowEditCancel(proyecto: Proyecto, index: number) {
        this.proyectos.update(listaActual => {
            listaActual[index] = this.clonedProyectos[proyecto.id];
            return [...listaActual]; 
        });
        delete this.clonedProyectos[proyecto.id];
    }
    
    eliminarProyecto(proyecto: Proyecto) {
        if (this.rolActual !== 'ADMIN') {
            this.messageService.add({ severity: 'error', summary: 'Denegado', detail: 'Solo los administradores pueden eliminar proyectos' });
            return;
        }

        if (confirm(`¿Estás seguro de enviar a la papelera el proyecto "${proyecto.nombre}"?`)) {
            this.proyectoService.eliminarProyecto(proyecto.id).subscribe({
                next: () => {
                    proyecto.estado = 'BAJA'; 
                    this.messageService.add({ severity: 'success', summary: 'Baja', detail: 'Proyecto dado de baja' });
                },
                error: (err) => {
                    // ACÁ TAMBIÉN: Capturamos por qué falló la eliminación
                    let mensajeBackend = 'No se pudo eliminar el proyecto';
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

    crearNuevoProyecto() {
        const ref = this.uiService.openNuevoProyecto();

        if (ref) {
            ref.onClose.subscribe((datos: Partial<Proyecto>) => {
                if (datos) {
                    this.proyectoService.crearProyecto(datos).subscribe({
                        next: () => {
                            if (this.ultimoEventoLazy) {
                                this.cargarProyectosLazy(this.ultimoEventoLazy);
                            }
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

    exportarCsvBackend() {
        this.proyectoService.descargarCsv();
    }

    getSeverity(status: string) {
        switch (status) {
            case 'ACTIVO': return 'success';
            case 'FINALIZADO': return 'warn';
            case 'BAJA': return 'danger';
            default: return 'secondary';
        }
    }
}