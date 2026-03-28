import { CommonModule } from '@angular/common';
import { FfButton } from '@fuggetlenfe/angular-wrapper';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const brandOptions = ['brand-1', 'brand-2', 'brand-3', 'custom-brand'] as const;
const stateOptions = ['default', 'hover', 'active', 'disabled'] as const;
const statePreviewStyles = `
  ff-button.demo-state--hover::part(button) {
    background: var(--ff-button-bg-hover, var(--ff-button-bg-default, transparent));
    color: var(--ff-button-fg-hover, var(--ff-button-fg-default, inherit));
  }

  ff-button.demo-state--active::part(button) {
    background: var(--ff-button-bg-active, var(--ff-button-bg-default, transparent));
    color: var(--ff-button-fg-active, var(--ff-button-fg-default, inherit));
    transform: translateY(1px);
  }
`;

type ButtonStoryProperties = {
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
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
    type: 'button'
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    type: {
      control: 'inline-radio',
      options: ['button', 'submit', 'reset']
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Angular-generated standalone wrapper around the shared Stencil button. Brand and theme now live entirely on the outer shell and the imported CSS pack.'
      }
    }
  },
  render: (storyProperties: ButtonStoryProperties, storyContext) => {
    const brandKey = String(storyContext.globals['brand'] ?? 'brand-1');
    const themeKey = String(storyContext.globals['theme'] ?? 'light');
    const storyState = {
      label: storyProperties.label ?? 'Launch selected brand',
      disabled: storyProperties.disabled ?? false,
      fullWidth: storyProperties.fullWidth ?? false,
      type: storyProperties.type ?? 'button',
      brand: brandKey,
      theme: themeKey,
      launchCount: 0,
      launchMessage: `Ready to launch ${brandLabel(brandKey)} in ${titleFromKey(themeKey)} mode.`,
      handleLaunch() {
        storyState.launchCount += 1;
        storyState.launchMessage = `${brandLabel(brandKey)} launched in ${titleFromKey(themeKey)} mode at ${new Date().toLocaleTimeString()}.`;
      }
    };

    return {
      props: storyState,
      template: `
        <div
          [attr.data-brand]="brand"
          [attr.data-theme]="theme"
          style="display:grid;gap:1rem;max-width:420px;min-height:100vh;padding:2rem;background:var(--ff-color-canvas);color:var(--ff-color-text-primary);font-family:Inter,Arial,sans-serif"
        >
          <ff-button
            [disabled]="disabled"
            [fullWidth]="fullWidth"
            [type]="type"
            (click)="handleLaunch()"
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
        story: 'State previews are applied from Storybook-only classes and external CSS tokens, not from component-level theme props.'
      }
    }
  },
  render: (_, storyContext) => ({
    props: {
      activeTheme: String(storyContext.globals['theme'] ?? 'light'),
      brandLabel,
      brands: brandOptions,
      states: stateOptions
    },
    template: `
      <div
        [attr.data-theme]="activeTheme"
        style="min-height:100vh;padding:2rem;background:var(--ff-color-canvas);color:var(--ff-color-text-primary);font-family:Inter,Arial,sans-serif"
      >
        <style>${statePreviewStyles}</style>
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
                [disabled]="state === 'disabled'"
                [fullWidth]="true"
                [class.demo-state--hover]="state === 'hover'"
                [class.demo-state--active]="state === 'active'"
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

function brandLabel(brandKey: string) {
  if (brandKey === 'custom-brand') {
    return 'Custom Brand';
  }

  return brandKey.replace('brand-', 'Brand ');
}

function titleFromKey(value: string) {
  return value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
