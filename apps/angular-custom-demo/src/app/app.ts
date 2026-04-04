import { Component, signal } from '@angular/core';
/*
  FfButton is the same Angular directive used in the Brand 1 showcase.
  The component logic is identical — only the CSS imports in styles.css differ.
  This app imports custom-brand-light.css / custom-brand-dark.css instead of brand-1-*.css,
  proving that the same component binary works with a completely different visual identity.
*/
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
  // Per-instance token overrides. These values are bound in the template via
  // [style.--ff-button-radius] etc., which overrides the custom brand pack values
  // for that specific <ff-button> instance only.
  readonly inlineTokenStyle = {
    radius: '20px',
    paddingInline: '1.3rem',
    paddingBlock: '0.68rem'
  } as const;

  setTheme(selectedTheme: ThemeMode) {
    this.activeTheme.set(selectedTheme);
  }
}
