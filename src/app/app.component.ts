import { Component } from '@angular/core';
import { DarkModeComponent } from './dark-mode/dark-mode.component';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DarkModeService } from './dark-mode/dark-mode.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DarkModeComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(public darkModeService: DarkModeService, public router: Router) {}

  isOnTreePage() {
    return this.router.url === '/tree';
  }

  navigateHome() {
    this.router.navigateByUrl('/');
  }
}
