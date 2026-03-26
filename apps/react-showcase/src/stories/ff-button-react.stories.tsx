import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { FfButton } from '@fuggetlenfe/react-wrapper';

const brandOptions = ['brand-1', 'brand-2', 'brand-3', 'client-acme', 'registry-owned'] as const;
const stateOptions = ['default', 'hover', 'active', 'disabled'] as const;

type StoryArgs = {
  label: string;
  disabled: boolean;
  fullWidth: boolean;
  previewState: 'auto' | 'default' | 'hover' | 'active';
  type: 'button' | 'submit' | 'reset';
};

const meta = {
  title: 'React Wrapper/FfButton',
  component: FfButton,
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
          'React-generated wrapper around the Stencil web component. The playground now also proves runtime interaction and the registry-style ownership flow for consumer-side brand packs.'
      }
    }
  },
  render: (args: StoryArgs, context) => (
    <PlaygroundDemo
      {...args}
      brand={String(context.globals.brand ?? 'brand-1')}
      theme={String(context.globals.theme ?? 'light')}
    />
  )
} satisfies Meta<typeof FfButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The same state matrix rendered through the React wrapper instead of the raw Stencil custom element.'
      }
    }
  },
  render: (_, context) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        maxWidth: '1200px'
      }}
    >
      {brandOptions.map((brand) => (
        <section
          key={brand}
          style={{
            border: '1px solid var(--ff-color-border-subtle)',
            background: 'var(--ff-color-surface)',
            padding: '1rem'
          }}
        >
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>{brandLabel(brand)}</h3>
          {stateOptions.map((state) => (
            <div
              key={`${brand}-${state}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '5rem minmax(0, 1fr)',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem'
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--ff-color-text-secondary)' }}>
                {state[0].toUpperCase() + state.slice(1)}
              </span>
              <FfButton
                brand={brand}
                theme={String(context.globals.theme ?? 'light')}
                disabled={state === 'disabled'}
                fullWidth
                previewState={state === 'disabled' ? 'auto' : state}
              >
                {brandLabel(brand)}
              </FfButton>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
};

function PlaygroundDemo(args: StoryArgs & { brand: string; theme: string }) {
  const [launchCount, setLaunchCount] = React.useState(0);
  const [launchMessage, setLaunchMessage] = React.useState('');

  React.useEffect(() => {
    setLaunchCount(0);
    setLaunchMessage(`Ready to launch ${brandLabel(args.brand)} in ${titleFromKey(args.theme)} mode.`);
  }, [args.brand, args.theme]);

  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: args.fullWidth ? '100%' : '420px' }}>
      <FfButton
        {...args}
        brand={args.brand}
        theme={args.theme}
        onClick={() => {
          setLaunchCount((current) => current + 1);
          setLaunchMessage(
            `${brandLabel(args.brand)} launched in ${titleFromKey(args.theme)} mode at ${new Date().toLocaleTimeString()}.`
          );
        }}
      >
        {args.label}
      </FfButton>

      <div
        style={{
          display: 'grid',
          gap: '0.5rem',
          padding: '1rem',
          border: '1px solid var(--ff-color-border-subtle)',
          background: 'var(--ff-color-surface)'
        }}
      >
        <p
          style={{
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '0.72rem',
            color: 'var(--ff-color-text-muted)'
          }}
        >
          Launch status
        </p>
        <strong>{launchMessage}</strong>
        <span style={{ color: 'var(--ff-color-text-secondary)' }}>
          Launches in this session: {launchCount}
        </span>
        <code
          style={{
            display: 'block',
            padding: '0.85rem 1rem',
            overflowX: 'auto',
            border: '1px solid var(--ff-color-border-subtle)',
            background: 'color-mix(in srgb, var(--ff-color-canvas) 82%, transparent)'
          }}
        >
          {`pnpm registry:add owned-brand-pack ./src/owned/brands/${args.brand}`}
        </code>
      </div>
    </div>
  );
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
