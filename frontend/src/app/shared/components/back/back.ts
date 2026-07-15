import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button'; 

@Component({
  selector: 'app-back',
  standalone: true, 
  imports: [ButtonModule], 
  templateUrl: './back.html',
  styleUrl: './back.css',
})
export class Back {
  private location: Location = inject(Location);

  volver(): void {
    this.location.back();
  }
}