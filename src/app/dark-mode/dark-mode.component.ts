import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DarkModeService } from './dark-mode.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-dark-mode',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './dark-mode.component.html',
  styleUrl: './dark-mode.component.scss',
})
export class DarkModeComponent {
  constructor(public darkModeService: DarkModeService) {}

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}
