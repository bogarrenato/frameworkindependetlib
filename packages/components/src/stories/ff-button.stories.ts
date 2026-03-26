import type { Meta, StoryObj } from '@storybook/web-components-vite';

const brandOptions = ['brand-1', 'brand-2', 'brand-3', 'client-acme', 'registry-owned'] as const;
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

type ButtonStoryArgs = {
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
  render: (args: ButtonStoryArgs, context) =>
    createPlaygroundMarkup({
      ...args,
      brand: String(context.globals.brand ?? 'brand-1'),
      theme: String(context.globals.theme ?? 'light')
    })
} satisfies Meta<ButtonStoryArgs>;

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
  render: (_, context) => {
    const theme = String(context.globals.theme ?? 'light');

    return `
      <div
        data-theme="${escapeHtml(theme)}"
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

function createPlaygroundMarkup(args: ButtonStoryArgs & { brand: string; theme: string }) {
  return `
    <div
      data-brand="${escapeHtml(args.brand)}"
      data-theme="${escapeHtml(args.theme)}"
      style="display:grid;gap:1rem;max-width:${args.fullWidth ? '100%' : '420px'};min-height:100vh;padding:2rem;background:var(--ff-color-canvas);color:var(--ff-color-text-primary);font-family:Inter,Arial,sans-serif"
    >
      ${createButtonMarkup(args)}
      <div style="display:grid;gap:0.5rem;padding:1rem;border:1px solid var(--ff-color-border-subtle);background:var(--ff-color-surface)">
        <p style="margin:0;text-transform:uppercase;letter-spacing:0.12em;font-size:0.72rem;color:var(--ff-color-text-muted)">
          Launch status
        </p>
        <strong data-launch-message>
          ${escapeHtml(`Ready to launch ${brandLabel(args.brand)} in ${titleFromKey(args.theme)} mode.`)}
        </strong>
        <span data-launch-count style="color:var(--ff-color-text-secondary)">
          Launches in this session: 0
        </span>
        <code
          data-launch-command
          style="display:block;padding:0.85rem 1rem;overflow:auto;border:1px solid var(--ff-color-border-subtle);background:color-mix(in srgb,var(--ff-color-canvas) 82%,transparent)"
        >
          ${escapeHtml(`pnpm registry:add owned-brand-pack ./src/owned/brands/${args.brand}`)}
        </code>
      </div>
    </div>
  `;
}

function createButtonMarkup(args: ButtonStoryArgs & { className?: string }) {
  const attributes = [`type="${escapeHtml(args.type)}"`];

  if (args.className) {
    attributes.push(`class="${escapeHtml(args.className)}"`);
  }

  if (args.fullWidth) {
    attributes.push('full-width');
  }

  if (args.disabled) {
    attributes.push('disabled');
  }

  return `<ff-button ${attributes.join(' ')}>${escapeHtml(args.label)}</ff-button>`;
}

function stateClassFor(state: (typeof stateOptions)[number]) {
  if (state === 'hover') {
    return 'demo-state--hover';
  }

  if (state === 'active') {
    return 'demo-state--active';
  }

  return '';
}

function setupLaunchPlayground(root: HTMLElement, brand: string, theme: string) {
  const button = root.querySelector('ff-button');
  const message = root.querySelector<HTMLElement>('[data-launch-message]');
  const count = root.querySelector<HTMLElement>('[data-launch-count]');
  const command = root.querySelector<HTMLElement>('[data-launch-command]');

  if (!button || !message || !count || !command || button.dataset.launchBound === 'true') {
    return;
  }

  let launchCount = 0;

  button.addEventListener('click', () => {
    launchCount += 1;
    message.textContent = `${brandLabel(brand)} launched in ${titleFromKey(theme)} mode at ${new Date().toLocaleTimeString()}.`;
    count.textContent = `Launches in this session: ${launchCount}`;
    command.textContent = `pnpm registry:add owned-brand-pack ./src/owned/brands/${brand}`;
  });

  button.dataset.launchBound = 'true';
}

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

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
