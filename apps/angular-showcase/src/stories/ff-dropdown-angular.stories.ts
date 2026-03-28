import { CommonModule } from '@angular/common';
import { FfDropdown } from '@fuggetlenfe/angular-wrapper';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const brandOptions = ['brand-1', 'brand-2', 'brand-3', 'custom-brand'] as const;
const dropdownOptions = [
  {
    value: 'pilot-release',
    label: 'Pilot release',
    description: 'Small audience rollout with monitoring enabled.'
  },
  {
    value: 'production-rollout',
    label: 'Production rollout',
    description: 'Full audience release after final verification.'
  },
  {
    value: 'maintenance-window',
    label: 'Maintenance window',
    description: 'Restricted release reserved for after-hours work.'
  }
];

type DropdownStoryProperties = {
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
  placeholder?: string;
  value?: string;
};

const meta = {
  title: 'Angular Wrapper/FfDropdown',
  component: FfDropdown,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FfDropdown]
    })
  ],
  args: {
    disabled: false,
    fullWidth: true,
    label: 'Release target',
    placeholder: 'Choose a release target',
    value: 'pilot-release'
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    value: {
      control: 'select',
      options: dropdownOptions.map((option) => option.value)
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Angular standalone wrapper around the shared dropdown primitive. Selection logic remains inside Stencil while Angular only binds props and events.'
      }
    }
  },
  render: (storyProperties: DropdownStoryProperties, storyContext) => {
    const brandKey = String(storyContext.globals['brand'] ?? 'brand-1');
    const themeKey = String(storyContext.globals['theme'] ?? 'light');
    const selectedValue = storyProperties.value ?? 'pilot-release';
    const selectedLabel = labelFromValue(selectedValue);

    const storyState = {
      brand: brandKey,
      disabled: storyProperties.disabled ?? false,
      fullWidth: storyProperties.fullWidth ?? true,
      label: storyProperties.label ?? 'Release target',
      options: dropdownOptions,
      placeholder: storyProperties.placeholder ?? 'Choose a release target',
      selectedLabel,
      selectedValue,
      theme: themeKey,
      handleValueChange(customEvent: CustomEvent<{ label: string; value: string }>) {
        storyState.selectedLabel = customEvent.detail.label;
        storyState.selectedValue = customEvent.detail.value;
      }
    };

    return {
      props: storyState,
      template: `
        <div
          [attr.data-brand]="brand"
          [attr.data-theme]="theme"
          style="display:grid;gap:1rem;max-width:28rem;min-height:100vh;padding:2rem;background:var(--ff-color-canvas);color:var(--ff-color-text-primary);font-family:Inter,Arial,sans-serif"
        >
          <ff-dropdown
            [disabled]="disabled"
            [fullWidth]="fullWidth"
            [label]="label"
            [options]="options"
            [placeholder]="placeholder"
            [value]="selectedValue"
            (ffValueChange)="handleValueChange($event)"
          ></ff-dropdown>

          <div
            role="status"
            aria-live="polite"
            style="display:grid;gap:0.5rem;padding:1rem;border:1px solid var(--ff-color-border-subtle);background:var(--ff-color-surface)"
          >
            <p style="margin:0;text-transform:uppercase;letter-spacing:0.12em;font-size:0.72rem;color:var(--ff-color-text-muted)">
              Selection status
            </p>
            <strong>Current selection: {{ selectedLabel }}</strong>
          </div>
        </div>
      `
    };
  }
} satisfies Meta<FfDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const BrandMatrix: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The same Angular wrapper inherits its design exclusively from the active shell brand and theme.'
      }
    }
  },
  render: (_, storyContext) => ({
    props: {
      activeTheme: String(storyContext.globals['theme'] ?? 'light'),
      brandLabel,
      brands: brandOptions,
      label: 'Release target',
      options: dropdownOptions,
      placeholder: 'Choose a release target',
      value: 'production-rollout'
    },
    template: `
      <div
        [attr.data-theme]="activeTheme"
        style="min-height:100vh;padding:2rem;background:var(--ff-color-canvas);color:var(--ff-color-text-primary);font-family:Inter,Arial,sans-serif"
      >
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;max-width:1200px">
          <section
            *ngFor="let brand of brands"
            [attr.data-brand]="brand"
            style="display:grid;gap:0.75rem;border:1px solid var(--ff-color-border-subtle);background:var(--ff-color-surface);padding:1rem"
          >
            <h3 style="margin:0;font-size:1rem">{{ brandLabel(brand) }}</h3>
            <ff-dropdown
              [fullWidth]="true"
              [label]="label"
              [options]="options"
              [placeholder]="placeholder"
              [value]="value"
            ></ff-dropdown>
            <div style="color:var(--ff-color-text-secondary);font-size:0.9rem">Theme: {{ activeTheme }}</div>
          </section>
        </div>
      </div>
    `
  })
};

function labelFromValue(selectedValue: string) {
  return dropdownOptions.find((option) => option.value === selectedValue)?.label ?? 'No selection';
}

function brandLabel(brandKey: string) {
  if (brandKey === 'custom-brand') {
    return 'Custom Brand';
  }

  return brandKey.replace('brand-', 'Brand ');
}
