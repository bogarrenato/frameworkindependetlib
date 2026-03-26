import type { Meta, StoryObj } from '@storybook/web-components-vite';

const brandOptions = ['brand-1', 'brand-2', 'brand-3', 'client-acme', 'registry-owned'] as const;
const stateOptions = ['default', 'hover', 'active', 'disabled'] as const;

type ButtonStoryArgs = {
  label: string;
  disabled: boolean;
  fullWidth: boolean;
  previewState: 'auto' | 'default' | 'hover' | 'active';
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
          'Stencil implementation of the multi-brand Figma button. The playground now also proves direct interactivity and the registry-style ownership handoff for a consumer-owned brand pack.'
      }
    }
  },
  render: (args: ButtonStoryArgs, context) => {
    return createPlaygroundMarkup({
      ...args,
      brand: String(context.globals.brand ?? 'brand-1'),
      theme: String(context.globals.theme ?? 'light')
    });
  }
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
        story: 'Preview the exact Figma state families and consumer-owned brands under the currently selected theme.'
      }
    }
  },
  render: (_, context) => {
    const theme = String(context.globals.theme ?? 'light');

    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;max-width:1200px">
        ${brandOptions
          .map((brand) => {
            return `
              <section style="border:1px solid var(--ff-color-border-subtle);background:var(--ff-color-surface);padding:1rem">
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
                          brand,
                          theme,
                          disabled: state === 'disabled',
                          fullWidth: true,
                          previewState: state === 'disabled' ? 'auto' : state,
                          type: 'button'
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
    `;
  }
};

function createPlaygroundMarkup(args: ButtonStoryArgs & { brand: string; theme: string }) {
  return `
    <div style="display:grid;gap:1rem;max-width:${args.fullWidth ? '100%' : '420px'}">
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

function createButtonMarkup(args: ButtonStoryArgs & { brand: string; theme: string }) {
  const attributes = [
    `brand="${escapeHtml(args.brand)}"`,
    `theme="${escapeHtml(args.theme)}"`,
    `type="${escapeHtml(args.type)}"`
  ];

  if (args.fullWidth) {
    attributes.push('full-width');
    attributes.push('style="display:block"');
  }

  if (args.disabled) {
    attributes.push('disabled');
  }

  if (args.previewState !== 'auto') {
    attributes.push(`preview-state="${escapeHtml(args.previewState)}"`);
  }

  return `<ff-button ${attributes.join(' ')}>${escapeHtml(args.label)}</ff-button>`;
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
