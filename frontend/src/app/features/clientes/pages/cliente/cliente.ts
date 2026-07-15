import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Card } from 'primeng/card';
import { ClienteService } from '../../cliente-api';
import { InterfaceCliente } from '../../../../shared/interfaces/interface-cliente';
import { UiService } from '../../../../core/service/ui';
import { Back } from '../../../../shared/components/back/back';
import { Download } from '../../../../shared/components/download/download';

@Component({
    selector: 'app-tabla-clientes',
    standalone: true,
    imports: [
        CommonModule,
        SelectModule,
        TableModule,
        ToastModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        Card,
        Back, 
        Download
    ],
    providers: [MessageService],
    templateUrl: './cliente.html',
    styleUrls: ['./cliente.css']
})
export class Cliente implements OnInit {
    private messageService = inject(MessageService);
    private uiService = inject(UiService);
    private clienteService = inject(ClienteService);
    private cdr = inject(ChangeDetectorRef);

    clientes: InterfaceCliente[] = [];
    estados: SelectItem[] = [];
    clonedClientes: { [s: number]: InterfaceCliente } = {};

    ngOnInit() {
        this.loadClientes();

        this.estados = [
            { label: 'Activo', value: 'ACTIVO' },
            { label: 'Baja', value: 'BAJA' }
        ];
    }

    loadClientes() {
        this.clienteService.getClientes().subscribe({
            next: (data) => {
                this.clientes = data;
                this.cdr.markForCheck(); 
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron recuperar los clientes.' })
        });
    }

    onRowEditInit(cliente: InterfaceCliente) {
        this.clonedClientes[cliente.id] = { ...cliente };
    }

    onRowEditSave(cliente: InterfaceCliente) {
        const { id, ...datosParaActualizar } = cliente;

        const payloadLimpio = {
            nombre: datosParaActualizar.nombre,
            estado: datosParaActualizar.estado,
            telefono: datosParaActualizar.telefono || undefined,
            correo: datosParaActualizar.correo || undefined
        };

        this.clienteService.updateCliente(cliente.id, payloadLimpio).subscribe({
            next: () => {
                delete this.clonedClientes[cliente.id];
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado con éxito.' });
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error('Falla en NestJS:', err.error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falla al guardar los cambios en el servidor.' });
                this.loadClientes();
            }
        });
    }

    onRowEditCancel(cliente: InterfaceCliente, index: number) {
        this.clientes[index] = this.clonedClientes[cliente.id];
        delete this.clonedClientes[cliente.id];
        this.cdr.markForCheck(); 
    }

    solicitarEliminarCliente(cliente: InterfaceCliente) {
        this.clienteService.eliminarCliente(cliente.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Baja Exitosa',
                    detail: `El cliente "${cliente.nombre}" no tiene proyectos asociados. Cambiado a Baja.`
                });
                this.loadClientes(); 
            },
            error: (err) => {
                const mensajeError = err.error?.message || 'No se pudo procesar la baja del cliente.';

                this.messageService.add({
                    severity: 'error',
                    summary: 'Acción Bloqueada',
                    detail: mensajeError 
                });
            }
        });
    }

    crearNuevoCliente() {
        const ref = this.uiService.openNuevoCliente();
        if (ref) {
            ref.onClose.subscribe((datosDelCliente: any) => {
                if (datosDelCliente) {
                    const nuevoClientePayload = {
                        nombre: datosDelCliente.nombre,
                        estado: datosDelCliente.estado ? datosDelCliente.estado.toUpperCase() : 'ACTIVO',
                        telefono: datosDelCliente.telefono?.trim() || undefined,
                        correo: datosDelCliente.correo?.trim() || undefined
                    };

                    this.clienteService.createCliente(nuevoClientePayload).subscribe({
                        next: () => {
                            this.loadClientes();
                            this.messageService.add({ severity: 'success', summary: 'Cliente Creado', detail: 'Guardado de forma exitosa.' });
                        },
                        error: (err) => {
                            console.error('Error al crear cliente:', err.error);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al crear el cliente.' });
                        }
                    });
                }
            });
        }
    }


       exportarCsvBackend() {
        this.clienteService.descargarCsv();
    }

        
        
        

    }

