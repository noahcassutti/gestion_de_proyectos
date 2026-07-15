import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Home } from './features/dashboard/pages/home/home';
import { Cliente } from './features/clientes/pages/cliente/cliente';
import { Layout } from './shared/components/layout/layout';
import { authGuard } from './core/guards/auth-guard';
import { rolesGuard } from './core/guards/roles-guard';

import { Usuarios } from './features/usuarios/usuarios';
import { Tareas } from './features/tareas/pages/tarea-list/tarea-list';
import { ProyectoList } from './features/proyectos/pages/proyecto-list/proyecto-list';
import { CalendarioComponent } from './features/calendario/pages/calendario/calendario';

export const routes: Routes = [
    {
        path: "login",
        component: Login
    },
    {
    path: '',
    component: Layout, // Sidebar y un router-outlet 
      canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Home
      },
      {
      path: "clientes",
      component: Cliente
      },
      { path: "usuarios",
      component: Usuarios,
      canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] }
      },
      { path: "tareas",
      component: Tareas
      },
      { path: "proyectos",
      component: ProyectoList
      },
      { path: 'proyectos/:id/tareas',
      component: Tareas },
      
      { path: 'calendario', component: CalendarioComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' },

    
];
