import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea, TareaPayload } from '../../shared/interfaces/tarea';

@Injectable({
  providedIn: 'root',
})

export class TareaService {
  private url = '/api/v1/tareas';  
  constructor(private readonly http: HttpClient) {}

//get
  getTareasPorProyecto(idProyecto: number): Observable<Tarea[]> {
  return this.http.get<Tarea[]>(`${this.url}/proyecto/${idProyecto}`);
}

//post - crear
  crearTarea(tarea: TareaPayload): Observable<{ id: number }> {
  return this.http.post<{ id: number }>(this.url, tarea);
}

// put - actualizar
  actualizarTarea(id: number, tarea: TareaPayload): Observable<void> {
  return this.http.put<void>(`${this.url}/${id}`, tarea);
}

// delete - eliminar
  eliminarTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}


