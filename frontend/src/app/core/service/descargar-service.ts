import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api'

@Injectable({
    providedIn: 'root'
})
export class DescargarCsvService {
    private http = inject(HttpClient);
    private messageService = inject(MessageService);

    descargarDesdeUrl(urlEndpoint: string, nombreArchivo: string) {
        this.http.get(urlEndpoint, { responseType: 'blob' })
            .subscribe({
                next: (blob: Blob) => {
                    this.ejecutarDescargaDOM(blob, nombreArchivo);
                    this.messageService.add({ 
                        severity: 'success', 
                        summary: 'Descarga Exitosa', 
                        detail: `El archivo "${nombreArchivo}" se ha generado correctamente.` 
                    });
                },


                error: () => {
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: `No se pudo procesar la descarga de "${nombreArchivo}".` 
                    });
                }
            });
    }

    private ejecutarDescargaDOM(blob: Blob, nombreArchivo: string) {
        const urlBlob = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = urlBlob;
        enlace.download = nombreArchivo;
        
        document.body.appendChild(enlace);
        enlace.click();
        
        document.body.removeChild(enlace);
        window.URL.revokeObjectURL(urlBlob);
    }
}