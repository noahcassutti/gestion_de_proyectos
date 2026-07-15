import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../../shared/interfaces/tarea';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  private http = inject(HttpClient);
 
  private apiUrl = 'api/v1/tareas/calendario';

  obtenerEventos(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }
}