import { Component, inject } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '../../../features/auth/auth-store';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  authStore = inject(AuthStore);
  rolActual = this.authStore.obtenerRol();
}
