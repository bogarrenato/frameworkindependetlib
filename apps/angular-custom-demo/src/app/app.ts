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
  readonly deploymentLaneOptions = [
    {
      value: 'design-review',
      label: 'Design review',
      description: 'Visual QA with the brand design leads.'
    },
    {
      value: 'beta-pilot',
      label: 'Beta pilot',
      description: 'Customer-facing preview for the first invited cohort.'
    },
    {
      value: 'public-release',
      label: 'Public release',
      description: 'General rollout after operations sign-off.'
    }
  ] as const;
  readonly selectedDeploymentLaneLabel = signal('Design review');
  readonly selectedDeploymentLaneValue = signal('design-review');

  setTheme(selectedTheme: ThemeMode) {
    this.activeTheme.set(selectedTheme);
  }

  handleDeploymentLaneChange(customEvent: CustomEvent<{ label: string; value: string }>) {
    this.selectedDeploymentLaneLabel.set(customEvent.detail.label);
    this.selectedDeploymentLaneValue.set(customEvent.detail.value);
  }
}
