import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: "root"
})
export class AuthStore {

    private readonly router: Router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly storageKey = "accessToken";

    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    guardarToken(token: string): void {
        if (!this.isBrowser()) {
            return;
        }
        sessionStorage.setItem(this.storageKey, token);
    }

    obtenerToken(): string | null {
        if (!this.isBrowser()) {
            return null;
        }
        return sessionStorage.getItem(this.storageKey);
    }

    tieneToken(): boolean {
        return this.obtenerToken() !== null;
    }

    eliminarToken(): void {
        if (!this.isBrowser()) {
            return;
        }
        sessionStorage.removeItem(this.storageKey);
    }

    cerrarSesion(): void {
        this.eliminarToken();
        this.router.navigateByUrl("/login");
    }

    obtenerNombreUsuario(): string | null {
        const token = this.obtenerToken();

        if (!token) {
            return null;
        }
        try {
            const payloadBase64Url = token.split('.')[1];
            if (!payloadBase64Url) {
                return null;
            }

            const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payloadJson = atob(this.normalizarBase64(payloadBase64));
            const payload = JSON.parse(payloadJson) as { nombre?: string };

            if (!payload.nombre) {
                return null;
            }

            return payload.nombre;
        } catch (error) {
            return null;
        }
    }

    private normalizarBase64(value: string): string {
        const padding = value.length % 4;

        if (padding === 0) {
            return value;
        }
        return value + '='.repeat(4 - padding);
    }

    obtenerRol(): string | null {
        const token = this.obtenerToken(); 
        if (!token) return null;

        try {
            const payload: any = jwtDecode(token);
            return payload.rol; 
        } catch (error) {
            return null;
        }
    }

}