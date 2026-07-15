import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-download',
  imports: [ButtonModule],
  templateUrl: './download.html',
  styleUrl: './download.css',
})
export class Download {
  @Input() label: string = 'DESCARGAR';
    @Input() disabled: boolean = false;
    
    @Output() btnClick = new EventEmitter<void>();

    onClick() {
        this.btnClick.emit();
    }
}
