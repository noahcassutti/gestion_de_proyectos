import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../shared/interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = '/api/v1/usuarios';

  constructor(private readonly http: HttpClient) {}
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }
}
