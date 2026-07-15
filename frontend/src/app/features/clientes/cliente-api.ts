import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfaceCliente } from '../../shared/interfaces/interface-cliente';
import { DescargarCsvService } from '../../core/service/descargar-service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
 private csvDescargar = inject(DescargarCsvService);
  private apiUrl = 'api/v1/clientes';

  getClientes(): Observable<InterfaceCliente[]> {
    return this.http.get<InterfaceCliente[]>(this.apiUrl);
  }

  createCliente(cliente: Omit<InterfaceCliente, 'id'>): Observable<InterfaceCliente> {
    return this.http.post<InterfaceCliente>(this.apiUrl, cliente);
  }

  updateCliente(id: number, cliente: Partial<InterfaceCliente>): Observable<InterfaceCliente> {
    return this.http.patch<InterfaceCliente>(`${this.apiUrl}/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  descargarCsv(estado?: string) {
    let url = `${this.apiUrl}/exportar/csv`;
    if (estado) url += `?estado=${estado}`;
    this.csvDescargar.descargarDesdeUrl(url, 'reporte_clientes.csv');
  }
}
