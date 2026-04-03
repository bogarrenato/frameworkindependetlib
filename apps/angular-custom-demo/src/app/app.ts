import { Component, signal } from '@angular/core';
import { FfButton } from '@fuggetlenfe/angular-wrapper';

type ThemeMode = 'light' | 'dark';

type ThemeOption = {
  label: string;
  value: ThemeMode;
};

@Component({
  selector: 'app-root',
  imports: [FfButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AngularCustomDemoAppComponent {
  readonly activeTheme = signal<ThemeMode>('light');
  readonly themeOptions: readonly ThemeOption[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ];
  readonly inlineTokenStyle = {
    radius: '20px',
    paddingInline: '1.3rem',
    paddingBlock: '0.68rem'
  } as const;

  setTheme(selectedTheme: ThemeMode) {
    this.activeTheme.set(selectedTheme);
  }
}
