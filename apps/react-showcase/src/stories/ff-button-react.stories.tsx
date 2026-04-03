import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { FfButton } from '@fuggetlenfe/react-wrapper';

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
  title: 'React Wrapper/FfButton',
  component: FfButton,
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
          'React-generated wrapper around the Stencil web component. Brand and theme now live entirely on the outer shell and the imported CSS pack.'
      }
    }
  },
  render: (storyProperties: ButtonStoryProperties, storyContext) => (
    <PlaygroundDemo
      {...storyProperties}
      brand={String(storyContext.globals.brand ?? 'brand-1')}
      theme={String(storyContext.globals.theme ?? 'light')}
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
        story: 'State previews are applied from Storybook classes and external CSS tokens, not from component-level theme props.'
      }
    }
  },
  render: (_, storyContext) => (
    <div
      data-theme={String(storyContext.globals.theme ?? 'light')}
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'var(--ff-color-canvas)',
        color: 'var(--ff-color-text-primary)',
        fontFamily: 'Inter, Arial, sans-serif'
      }}
    >
      <style>{statePreviewStyles}</style>
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
            data-brand={brand}
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
                  className={stateClassFor(state)}
                  disabled={state === 'disabled'}
                  fullWidth
                >
                  {brandLabel(brand)}
                </FfButton>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
};

function PlaygroundDemo(storyProperties: ButtonStoryProperties & { brand: string; theme: string }) {
  const [launchCount, setLaunchCount] = React.useState(0);
  const [launchMessage, setLaunchMessage] = React.useState('');

  React.useEffect(() => {
    setLaunchCount(0);
    setLaunchMessage(
      `Ready to launch ${brandLabel(storyProperties.brand)} in ${titleFromKey(storyProperties.theme)} mode.`
    );
  }, [storyProperties.brand, storyProperties.theme]);

  return (
    <div
      data-brand={storyProperties.brand}
      data-theme={storyProperties.theme}
      style={{
        display: 'grid',
        gap: '1rem',
        maxWidth: storyProperties.fullWidth ? '100%' : '420px',
        minHeight: '100vh',
        padding: '2rem',
        background: 'var(--ff-color-canvas)',
        color: 'var(--ff-color-text-primary)',
        fontFamily: 'Inter, Arial, sans-serif'
      }}
    >
      <FfButton
        disabled={storyProperties.disabled}
        fullWidth={storyProperties.fullWidth}
        type={storyProperties.type}
        onClick={() => {
          setLaunchCount((currentLaunchCount) => currentLaunchCount + 1);
          setLaunchMessage(
            `${brandLabel(storyProperties.brand)} launched in ${titleFromKey(storyProperties.theme)} mode at ${new Date().toLocaleTimeString()}.`
          );
        }}
      >
        {storyProperties.label}
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
      </div>
    </div>
  );
}

function stateClassFor(buttonState: (typeof stateOptions)[number]) {
  if (buttonState === 'hover') {
    return 'demo-state--hover';
  }

  if (buttonState === 'active') {
    return 'demo-state--active';
  }

  return undefined;
}

function brandLabel(brandKey: string) {
  return brandKey.replace('brand-', 'Brand ');
}

function titleFromKey(value: string) {
  return value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
