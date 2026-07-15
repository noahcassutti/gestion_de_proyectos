import { CanActivateFn, Router } from "@angular/router";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { AuthStore } from "../../features/auth/auth-store"; 


export const rolesGuard: CanActivateFn = (route) => {
    const authStore = inject(AuthStore); 
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)){
        return true;
    }

    const requiredRoles= route.data['roles'] as Array<string>;
    const userRole = authStore.obtenerRol();

    if (userRole &&  requiredRoles.includes(userRole)){
        return true;
    }

    return router.createUrlTree(['/dashboard'])


}