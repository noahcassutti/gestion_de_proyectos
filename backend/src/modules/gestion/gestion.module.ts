import { Module } from '@nestjs/common';
import { ClientesModule } from './clientes/clientes.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { TareasModule } from './tareas/tareas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';

@Module({
  imports: [
    UsuariosModule,
    ClientesModule,
    ProyectosModule,
    TareasModule,
    EstadisticasModule,
  ],
})
export class GestionModule {}
