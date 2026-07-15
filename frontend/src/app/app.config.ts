import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { DialogService } from 'primeng/dynamicdialog';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/interceptors/interceptor';
import { MessageService } from 'primeng/api';


export const appConfig: ApplicationConfig = {
  providers: [
    DialogService,
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'none'
        }
        
      },
    }),
  ]
};
