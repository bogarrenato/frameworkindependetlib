import type { Meta, StoryObj } from '@storybook/web-components-vite';

const brandOptions = ['brand-1', 'brand-2', 'brand-3'] as const;
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
  label: string;
  disabled: boolean;
  fullWidth: boolean;
  type: 'button' | 'submit' | 'reset';
};

const meta = {
  title: 'Stencil/FfButton',
  component: 'ff-button',
  tags: ['autodocs'],
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
          'Stencil implementation of the logic-only button primitive. Brand and theme are now driven exclusively by the outer container and the imported CSS pack.'
      }
    }
  },
  render: (storyProperties: ButtonStoryProperties, storyContext) =>
    createPlaygroundMarkup({
      ...storyProperties,
      brand: String(storyContext.globals.brand ?? 'brand-1'),
      theme: String(storyContext.globals.theme ?? 'light')
    })
} satisfies Meta<ButtonStoryProperties>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: ({ canvasElement, globals }) => {
    setupLaunchPlayground(
      canvasElement,
      String(globals.brand ?? 'brand-1'),
      String(globals.theme ?? 'light')
    );
  }
};

export const StateMatrix: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'State previews now come from Storybook-only classes and external CSS tokens, not from component props.'
      }
    }
  },
  render: (_, storyContext) => {
    const activeTheme = String(storyContext.globals.theme ?? 'light');

    return `
      <div
        data-theme="${escapeHtml(activeTheme)}"
        style="min-height:100vh;padding:2rem;background:var(--ff-color-canvas);color:var(--ff-color-text-primary);font-family:Inter,Arial,sans-serif"
      >
        <style>${statePreviewStyles}</style>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;max-width:1200px">
          ${brandOptions
            .map((brand) => {
              return `
                <section data-brand="${escapeHtml(brand)}" style="border:1px solid var(--ff-color-border-subtle);background:var(--ff-color-surface);padding:1rem">
                  <h3 style="margin:0 0 1rem;font-size:1rem">${escapeHtml(brandLabel(brand))}</h3>
                  ${stateOptions
                    .map((state) => {
                      return `
                        <div style="display:grid;grid-template-columns:5rem minmax(0,1fr);align-items:center;gap:0.75rem;margin-bottom:0.75rem">
                          <span style="font-size:0.8rem;color:var(--ff-color-text-secondary)">
                            ${escapeHtml(state[0].toUpperCase() + state.slice(1))}
                          </span>
                          ${createButtonMarkup({
                            label: brandLabel(brand),
                            disabled: state === 'disabled',
                            fullWidth: true,
                            type: 'button',
                            className: stateClassFor(state)
                          })}
                        </div>
                      `;
                    })
                    .join('')}
                </section>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All button API variations rendered in a single view for visual comparison.'
      }
    }
  },
  render: (_, storyContext) => {
    const brand = String(storyContext.globals.brand ?? 'brand-1');
    const theme = String(storyContext.globals.theme ?? 'light');

    return `
      <div
        data-brand="${escapeHtml(brand)}"
        data-theme="${escapeHtml(theme)}"
        style="min-height:100vh;padding:2rem;background:var(--ff-color-canvas);color:var(--ff-color-text-primary);font-family:Inter,Arial,sans-serif"
      >
        <div style="display:grid;gap:1.5rem;max-width:480px">
          <section>
            <h4 style="margin:0 0 0.5rem;font-size:0.85rem;color:var(--ff-color-text-secondary)">Default</h4>
            <ff-button type="button">Default button</ff-button>
          </section>

          <section>
            <h4 style="margin:0 0 0.5rem;font-size:0.85rem;color:var(--ff-color-text-secondary)">Disabled</h4>
            <ff-button type="button" disabled>Disabled button</ff-button>
          </section>

          <section>
            <h4 style="margin:0 0 0.5rem;font-size:0.85rem;color:var(--ff-color-text-secondary)">Full-width</h4>
            <ff-button type="button" full-width>Full-width button</ff-button>
          </section>

          <section>
            <h4 style="margin:0 0 0.5rem;font-size:0.85rem;color:var(--ff-color-text-secondary)">Submit type</h4>
            <ff-button type="submit">Submit button</ff-button>
          </section>

          <section>
            <h4 style="margin:0 0 0.5rem;font-size:0.85rem;color:var(--ff-color-text-secondary)">Reset type</h4>
            <ff-button type="reset">Reset button</ff-button>
          </section>

          <section>
            <h4 style="margin:0 0 0.5rem;font-size:0.85rem;color:var(--ff-color-text-secondary)">Pill style (custom radius)</h4>
            <ff-button type="button" style="--ff-button-radius:999px">Pill button</ff-button>
          </section>

          <section>
            <h4 style="margin:0 0 0.5rem;font-size:0.85rem;color:var(--ff-color-text-secondary)">Custom token override</h4>
            <ff-button type="button" style="--ff-button-bg-default:#6366f1;--ff-button-fg-default:#fff">Custom tokens</ff-button>
          </section>

          <section>
            <h4 style="margin:0 0 0.5rem;font-size:0.85rem;color:var(--ff-color-text-secondary)">Label prop only (no slotted content)</h4>
            <ff-button type="button" label="Label prop button"></ff-button>
          </section>
        </div>
      </div>
    `;
  }
};

function createPlaygroundMarkup(storyProperties: ButtonStoryProperties & { brand: string; theme: string }) {
  return `
    <div
      data-brand="${escapeHtml(storyProperties.brand)}"
      data-theme="${escapeHtml(storyProperties.theme)}"
      style="display:grid;gap:1rem;max-width:${storyProperties.fullWidth ? '100%' : '420px'};min-height:100vh;padding:2rem;background:var(--ff-color-canvas);color:var(--ff-color-text-primary);font-family:Inter,Arial,sans-serif"
    >
      ${createButtonMarkup(storyProperties)}
      <div style="display:grid;gap:0.5rem;padding:1rem;border:1px solid var(--ff-color-border-subtle);background:var(--ff-color-surface)">
        <p style="margin:0;text-transform:uppercase;letter-spacing:0.12em;font-size:0.72rem;color:var(--ff-color-text-muted)">
          Launch status
        </p>
        <strong data-launch-message>
          ${escapeHtml(`Ready to launch ${brandLabel(storyProperties.brand)} in ${titleFromKey(storyProperties.theme)} mode.`)}
        </strong>
        <span data-launch-count style="color:var(--ff-color-text-secondary)">
          Launches in this session: 0
        </span>
      </div>
    </div>
  `;
}

function createButtonMarkup(storyProperties: ButtonStoryProperties & { className?: string }) {
  const attributes = [`type="${escapeHtml(storyProperties.type)}"`];

  if (storyProperties.className) {
    attributes.push(`class="${escapeHtml(storyProperties.className)}"`);
  }

  if (storyProperties.fullWidth) {
    attributes.push('full-width');
  }

  if (storyProperties.disabled) {
    attributes.push('disabled');
  }

  return `<ff-button ${attributes.join(' ')}>${escapeHtml(storyProperties.label)}</ff-button>`;
}

function stateClassFor(buttonState: (typeof stateOptions)[number]) {
  if (buttonState === 'hover') {
    return 'demo-state--hover';
  }

  if (buttonState === 'active') {
    return 'demo-state--active';
  }

  return '';
}

function setupLaunchPlayground(root: HTMLElement, brand: string, theme: string) {
  const button = root.querySelector('ff-button');
  const message = root.querySelector<HTMLElement>('[data-launch-message]');
  const count = root.querySelector<HTMLElement>('[data-launch-count]');

  if (!button || !message || !count || button.dataset.launchBound === 'true') {
    return;
  }

  let launchCount = 0;

  button.addEventListener('click', () => {
    launchCount += 1;
    message.textContent = `${brandLabel(brand)} launched in ${titleFromKey(theme)} mode at ${new Date().toLocaleTimeString()}.`;
    count.textContent = `Launches in this session: ${launchCount}`;
  });

  button.dataset.launchBound = 'true';
}

function brandLabel(brandKey: string) {
  return brandKey.replace('brand-', 'Brand ');
}

function titleFromKey(value: string) {
  return value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
