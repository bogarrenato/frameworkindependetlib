import { Component, signal } from '@angular/core';
import { FfButton } from '@fuggetlenfe/angular-wrapper';

@Component({
  selector: 'app-root',
  imports: [FfButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly theme = signal<'light' | 'dark'>('light');

  setTheme(theme: 'light' | 'dark') {
    this.theme.set(theme);
  }
}
