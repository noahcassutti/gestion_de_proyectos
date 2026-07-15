export interface Tarea {
    id: string;
    descripcion: string; 
    estado: string; 
    id_proyecto: number;
    fecha_inicio: Date;
    fecha_limite: Date;
}

export interface TareaPayload {
  descripcion: string;
  estado: string;
  id_proyecto: number;
  fecha_inicio: Date;
  fecha_limite: Date;
}
