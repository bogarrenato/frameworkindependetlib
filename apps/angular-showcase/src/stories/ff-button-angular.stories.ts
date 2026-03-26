import { CommonModule } from '@angular/common';
import { FfButton } from '@fuggetlenfe/angular-wrapper';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const brandOptions = ['brand-1', 'brand-2', 'brand-3', 'client-acme', 'registry-owned'] as const;
const stateOptions = ['default', 'hover', 'active', 'disabled'] as const;

type StoryArgs = {
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  previewState?: 'auto' | 'default' | 'hover' | 'active';
  type?: 'button' | 'submit' | 'reset';
};

const meta = {
  title: 'Angular Wrapper/FfButton',
  component: FfButton,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FfButton]
    })
  ],
  args: {
    label: 'Launch selected brand',
    disabled: false,
    fullWidth: false,
    previewState: 'auto',
    type: 'button'
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    previewState: {
      control: 'inline-radio',
      options: ['auto', 'default', 'hover', 'active']
    },
    type: {
      control: 'inline-radio',
      options: ['button', 'submit', 'reset']
    },
    brand: { table: { disable: true } },
    theme: { table: { disable: true } }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Angular-generated standalone wrapper around the shared Stencil button. The playground now also proves click handling and the local registry handoff flow.'
      }
    }
  },
  render: (args: StoryArgs, context) => {
    const brand = String(context.globals['brand'] ?? 'brand-1');
    const theme = String(context.globals['theme'] ?? 'light');
    const props = {
      label: args.label ?? 'Launch selected brand',
      disabled: args.disabled ?? false,
      fullWidth: args.fullWidth ?? false,
      previewState: args.previewState ?? 'auto',
      type: args.type ?? 'button',
      brand,
      theme,
      launchCount: 0,
      launchMessage: `Ready to launch ${brandLabel(brand)} in ${titleFromKey(theme)} mode.`,
      launch() {
        props.launchCount += 1;
        props.launchMessage = `${brandLabel(brand)} launched in ${titleFromKey(theme)} mode at ${new Date().toLocaleTimeString()}.`;
      }
    };

    return {
      props,
      template: `
        <div
          [attr.data-brand]="brand"
          [attr.data-theme]="theme"
          style="display:grid;gap:1rem;max-width:420px;min-height:100vh;padding:2rem;background:var(--ff-color-canvas);color:var(--ff-color-text-primary);font-family:Inter,Arial,sans-serif"
        >
          <ff-button
            [brand]="brand"
            [theme]="theme"
            [disabled]="disabled"
            [fullWidth]="fullWidth"
            [previewState]="previewState"
            [type]="type"
            (click)="launch()"
          >
            {{ label }}
          </ff-button>

          <div
            style="display:grid;gap:0.5rem;padding:1rem;border:1px solid var(--ff-color-border-subtle);background:var(--ff-color-surface)"
          >
            <p style="margin:0;text-transform:uppercase;letter-spacing:0.12em;font-size:0.72rem;color:var(--ff-color-text-muted)">
              Launch status
            </p>
            <strong>{{ launchMessage }}</strong>
            <span style="color:var(--ff-color-text-secondary)">Launches in this session: {{ launchCount }}</span>
            <code
              style="display:block;padding:0.85rem 1rem;overflow:auto;border:1px solid var(--ff-color-border-subtle);background:color-mix(in srgb,var(--ff-color-canvas) 82%,transparent)"
            >
              pnpm registry:add owned-brand-pack ./src/owned/brands/{{ brand }}
            </code>
          </div>
        </div>
      `
    };
  }
} satisfies Meta<FfButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'State comparison rendered through the Angular standalone wrapper.'
      }
    }
  },
  render: (_, context) => ({
    props: {
      brandTheme: String(context.globals['theme'] ?? 'light'),
      brandLabel,
      brands: brandOptions,
      states: stateOptions
    },
    template: `
      <div
        [attr.data-theme]="brandTheme"
        style="min-height:100vh;padding:2rem;background:var(--ff-color-canvas);color:var(--ff-color-text-primary);font-family:Inter,Arial,sans-serif"
      >
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;max-width:1200px">
          <section
            *ngFor="let brand of brands"
            [attr.data-brand]="brand"
            style="border:1px solid var(--ff-color-border-subtle);background:var(--ff-color-surface);padding:1rem"
          >
            <h3 style="margin:0 0 1rem;font-size:1rem">{{ brandLabel(brand) }}</h3>
            <div
              *ngFor="let state of states"
              style="display:grid;grid-template-columns:5rem minmax(0,1fr);align-items:center;gap:0.75rem;margin-bottom:0.75rem"
            >
              <span style="font-size:0.8rem;color:var(--ff-color-text-secondary)">
                {{ state[0].toUpperCase() + state.slice(1) }}
              </span>
              <ff-button
                [brand]="brand"
                [theme]="brandTheme"
                [disabled]="state === 'disabled'"
                [fullWidth]="true"
                [previewState]="state === 'disabled' ? 'auto' : state"
              >
                {{ brandLabel(brand) }}
              </ff-button>
            </div>
          </section>
        </div>
      </div>
    `
  })
};

function brandLabel(brand: string) {
  if (brand === 'client-acme') {
    return 'Client Acme';
  }

  if (brand === 'registry-owned') {
    return 'Registry Owned';
  }

  return brand.replace('brand-', 'Brand ');
}

function titleFromKey(key: string) {
  return key.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
