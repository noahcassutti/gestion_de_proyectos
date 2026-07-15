import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-cliente-form',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, SelectModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm implements OnInit {
  
  cliente = {
    nombre: '',
    estado: 'Activo', 
    telefono: '',
    correo: ''
  };

  estadosDisponibles: string[] = [];

  constructor(public ref: DynamicDialogRef) {}

  ngOnInit() {
    this.estadosDisponibles = ['Activo', 'Baja'];
  }

  formularioValido(): boolean {
    return this.cliente.nombre.trim().length >= 5 && 
           this.cliente.estado !== null &&
           this.cliente.estado !== '' 

  }

  guardar() {
    if (this.formularioValido()) {
      this.ref.close(this.cliente); 
    }
  }

  cerrar() {
    this.ref.close(); 
  }
}