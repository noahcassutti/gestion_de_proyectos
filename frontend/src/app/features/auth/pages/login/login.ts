import { CommonModule } from "@angular/common";
import { Component, inject, ChangeDetectorRef } from "@angular/core"; 
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { finalize } from "rxjs";
import { AuthService } from "../../auth-service";

@Component({
    selector: "app-login",
    standalone: true,
    templateUrl: "./login.html",
    styleUrl: "./login.css",
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, PasswordModule]
})
export class Login {

    private readonly authService: AuthService = inject(AuthService);
    private readonly router: Router = inject(Router);
    private readonly formBuilder: FormBuilder = inject(FormBuilder);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef); 

    protected readonly form = this.formBuilder.nonNullable.group({
        nombre: ['', [Validators.required]],
        clave: ['', [Validators.required, Validators.minLength(4)]]
    });

    protected errorMessage = '';
    protected loading = false;

    iniciarSesion(): void {
        this.errorMessage = '';

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.errorMessage = 'Completa el nombre de usuario y la contraseña.';
            return;
        }

        this.loading = true;
        const { nombre, clave } = this.form.getRawValue();

        this.authService.iniciarSesion(nombre, clave)
            .pipe(finalize(() => {
                this.loading = false;
                this.cdr.detectChanges(); //para que no se quede colgando el loading
            }))
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('/dashboard');
                },
                error: (err) => {
                    this.errorMessage = err?.error?.message ?? 'Ha ocurrido un error al iniciar sesión.';
                    this.cdr.detectChanges(); 
                }
            });
    }
}