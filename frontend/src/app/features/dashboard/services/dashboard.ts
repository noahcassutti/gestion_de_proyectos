import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'api/v1/estadisticas';

  obtenerResumenGeneral(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumen`);
  }
}