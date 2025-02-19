import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  darkModeSignal = signal<boolean>(true);

  constructor() { }

  toggleDarkMode() {
    this.darkModeSignal.update((value) => (value === true ? false : true));
  }
}
