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
  styleUrl: './app.css',
})
export class BrandOneShowcaseAppComponent {
  readonly activeTheme = signal<ThemeMode>('light');
  readonly themeOptions: readonly ThemeOption[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];
  readonly inlineTokenStyle = {
    paddingInline: '0.95rem',
    paddingBlock: '0.48rem',
    radius: '4px',
  };

  setTheme(selectedTheme: ThemeMode) {
    this.activeTheme.set(selectedTheme);
  }
}
