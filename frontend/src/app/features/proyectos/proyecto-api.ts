import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { Proyecto } from '../../shared/interfaces/proyecto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DescargarCsvService } from '../../core/service/descargar-service';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private http = inject(HttpClient);
  private csvDescargar = inject(DescargarCsvService)
  private apiUrl = '/api/v1/proyectos';

  obtenerProyectos(page: number = 1, limit: number = 10, search?: string, estado?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) params = params.set('search', search);
    if (estado) params = params.set('estado', estado);

    return this.http.get<any>(this.apiUrl, { params });
  }
  obtenerUnProyecto(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.apiUrl}/${id}`);
  }

  crearProyecto(proyecto: Partial<Proyecto>): Observable<any> {
    return this.http.post<any>(this.apiUrl, proyecto);
  }

  actualizarProyecto(id: number, proyecto: Partial<Proyecto>): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${this.apiUrl}/${id}`, proyecto);
  }

  eliminarProyecto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  descargarCsv(estado?: string) {
    let url = `${this.apiUrl}/exportar/csv`;
    if (estado) url += `?estado=${estado}`;
    
    this.csvDescargar.descargarDesdeUrl(url, 'reporte_proyectos.csv');
  }
  descargarCsvProyectoEspecifico(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/exportar/csv`, { responseType: 'blob' });
  }
}
