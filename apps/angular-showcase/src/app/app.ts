import { Component, signal } from '@angular/core';
import { FfButton, FfDropdown } from '@fuggetlenfe/angular-wrapper';

type ThemeMode = 'light' | 'dark';

type ThemeOption = {
  label: string;
  value: ThemeMode;
};

@Component({
  selector: 'app-root',
  imports: [FfButton, FfDropdown],
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
  readonly releaseTargetOptions = [
    {
      value: 'pilot-release',
      label: 'Pilot release',
      description: 'Small audience rollout with monitoring enabled.',
    },
    {
      value: 'production-rollout',
      label: 'Production rollout',
      description: 'Full audience release after final verification.',
    },
    {
      value: 'maintenance-window',
      label: 'Maintenance window',
      description: 'Restricted release reserved for after-hours work.',
    },
  ];
  readonly selectedReleaseTargetLabel = signal('Pilot release');
  readonly selectedReleaseTargetValue = signal('pilot-release');

  setTheme(selectedTheme: ThemeMode) {
    this.activeTheme.set(selectedTheme);
  }

  handleReleaseTargetChange(customEvent: CustomEvent<{ label: string; value: string }>) {
    this.selectedReleaseTargetLabel.set(customEvent.detail.label);
    this.selectedReleaseTargetValue.set(customEvent.detail.value);
  }
}
