import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../../../core/service/ui';
import { AuthService } from '../../../features/auth/auth-service';
import { AuthStore } from '../../../features/auth/auth-store';
import { ProyectoService } from '../../../features/proyectos/proyecto-api';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true
})
export class Sidebar {
  private router: Router = inject(Router);
  private uiService: UiService = inject(UiService);
  private location: Location = inject(Location);
  private readonly authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private proyectoService = inject(ProyectoService);

  rolActual = this.authStore.obtenerRol();

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  abrirNuevoProyecto(): void {
    const ref = this.uiService.openNuevoProyecto();

    if (ref) {
      ref.onClose.subscribe((datosDelFormulario: any) => {
        if (datosDelFormulario && datosDelFormulario.nombre) {
          
          // Armamos el payload blindado para que NestJS no devuelva Error 400
          const proyectoLimpio: any = {
            nombre: datosDelFormulario.nombre.trim()
          };

          if (datosDelFormulario.idCliente) {
            proyectoLimpio.idCliente = Number(datosDelFormulario.idCliente);
          }

          this.proyectoService.crearProyecto(proyectoLimpio).subscribe({
            next: () => {
              if (this.router.url === '/proyectos') {
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                  this.router.navigate(['/proyectos']);
                });
              } else {
                this.navegarA('proyectos');
              }
            },
            error: (err) => {
              console.error('El backend rechazó la petición desde el Sidebar:', err);
            }
          });
        }
      });
    }
  }

  volverAnterior(): void {
    this.location.back();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}