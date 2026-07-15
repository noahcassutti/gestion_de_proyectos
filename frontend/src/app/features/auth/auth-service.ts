import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthStore } from "./auth-store";
import { LoginCredentials } from "../../shared/interfaces/login.credential";
import { LoginResponse } from "../../shared/interfaces/login.response";

@Injectable({ providedIn: 'root' })
export class AuthService {

    private readonly client: HttpClient = inject(HttpClient)
    private readonly authStore: AuthStore = inject(AuthStore)

    iniciarSesion(nombre: string, clave: string): Observable<LoginResponse> {

        return this.client.post<LoginResponse>("/api/v1/auth/login", { nombre, clave }).pipe(
            tap(({ accessToken }) => this.authStore.guardarToken(accessToken))
        );
    }

    iniciarSesionConCredenciales(credentials: LoginCredentials): Observable<LoginResponse> {
        return this.iniciarSesion(credentials.nombre, credentials.clave);
    }

    cerrarSesion(): void {
        this.authStore.cerrarSesion();
    }

    estaAutenticado(): boolean {
        return this.authStore.tieneToken();

    }

}