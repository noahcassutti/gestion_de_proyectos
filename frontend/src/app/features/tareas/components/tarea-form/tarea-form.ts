import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProyectoService } from '../../../proyectos/proyecto-api';
import { DatePickerModule } from 'primeng/datepicker'; 

@Component({
  selector: 'app-tarea-form',
  standalone: true, 
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, SelectModule, DatePickerModule],
  templateUrl: './tarea-form.html',
  styleUrls: ['./tarea-form.css'] 
})
export class TareaForm implements OnInit {

  tarea: any = {
    titulo: '',
    proyectoId: null,
    fechaInicio: null,
    fechaLimite: null
  };

  proyectosDisponibles: any[] = [];
  isProyectoFijo: boolean = false; 
  private proyectoService = inject(ProyectoService);
  private cdr = inject(ChangeDetectorRef);

  public config = inject(DynamicDialogConfig);

  constructor(public ref: DynamicDialogRef) {}

  ngOnInit() {
    if (this.config.data && this.config.data.idProyectoFijo) {
      this.tarea.proyectoId = this.config.data.idProyectoFijo;
      this.isProyectoFijo = true; 
    }
    this.proyectoService.obtenerProyectos(1, 100).subscribe({
      next: (response) => {
        this.proyectosDisponibles = response.data || response; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar proyectos desde la BD', err);
      }
    });
  }

  // fechasValidas(): boolean {
  //   if (!this.tarea.fechaInicio || !this.tarea.fechaLimite) return false;
  //   return this.tarea.fechaLimite >= this.tarea.fechaInicio;
  // }
  fechasValidas(): boolean {
    if (!this.tarea.fechaInicio || !this.tarea.fechaLimite) {
      return true;
    }
    return this.tarea.fechaLimite >= this.tarea.fechaInicio;
  }

  formularioValido(): boolean {
    return !!this.tarea.titulo && 
           this.tarea.titulo.trim().length >= 5 && 
           this.tarea.proyectoId !== null &&
           this.fechasValidas();
  }

  guardar() {
    if (this.formularioValido()) {
      const datosParaEnviar: any = { ...this.tarea };

      if (this.tarea.fechaInicio && this.tarea.fechaInicio instanceof Date) {
        const d = this.tarea.fechaInicio;
        const anio = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        datosParaEnviar.fecha_inicio = `${anio}-${mes}-${dia}`;
      } else {
        datosParaEnviar.fecha_inicio = null;
      }

      if (this.tarea.fechaLimite && this.tarea.fechaLimite instanceof Date) {
        const d = this.tarea.fechaLimite;
        const anio = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        datosParaEnviar.fecha_limite = `${anio}-${mes}-${dia}`;
      } else {
        datosParaEnviar.fecha_limite = null;
      }

      delete datosParaEnviar.fechaInicio;
      delete datosParaEnviar.fechaLimite;

      if (this.ref) {
        this.ref.close(datosParaEnviar);
      }
    }
  }

  cerrar() {
    if (this.ref) {
      this.ref.close();
    }
  }
}