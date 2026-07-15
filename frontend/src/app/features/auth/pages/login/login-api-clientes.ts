import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../../auth-service";

@Injectable({ providedIn: 'root' })
export class LoginApiClient {

    private readonly authService: AuthService = inject(AuthService)

    iniciarSesion(nombre: string, clave: string): Observable<{ accessToken: string }> {
        return this.authService.iniciarSesion(nombre, clave);

    }

}