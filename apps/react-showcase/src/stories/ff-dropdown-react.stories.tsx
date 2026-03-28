import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { FfDropdown } from '@fuggetlenfe/react-wrapper';

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
  disabled: boolean;
  fullWidth: boolean;
  label: string;
  placeholder: string;
  value: string;
};

const meta = {
  title: 'React Wrapper/FfDropdown',
  component: FfDropdown,
  tags: ['autodocs'],
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
          'React wrapper around the shared dropdown primitive. The wrapper only bridges React props and events to the Stencil runtime contract.'
      }
    }
  },
  render: (storyProperties: DropdownStoryProperties, storyContext) => (
    <PlaygroundDemo
      {...storyProperties}
      brand={String(storyContext.globals.brand ?? 'brand-1')}
      theme={String(storyContext.globals.theme ?? 'light')}
    />
  )
} satisfies Meta<typeof FfDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const BrandMatrix: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The same React wrapper inherits its visual identity from the active brand and theme shell.'
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          maxWidth: '1200px'
        }}
      >
        {brandOptions.map((brand) => (
          <section
            key={brand}
            data-brand={brand}
            style={{
              display: 'grid',
              gap: '0.75rem',
              border: '1px solid var(--ff-color-border-subtle)',
              background: 'var(--ff-color-surface)',
              padding: '1rem'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{brandLabel(brand)}</h3>
            <FfDropdown
              fullWidth
              label="Release target"
              options={dropdownOptions}
              placeholder="Choose a release target"
              value="production-rollout"
            />
            <div style={{ color: 'var(--ff-color-text-secondary)', fontSize: '0.9rem' }}>
              Theme: {titleFromKey(String(storyContext.globals.theme ?? 'light'))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
};

function PlaygroundDemo(storyProperties: DropdownStoryProperties & { brand: string; theme: string }) {
  const [selectedOptionLabel, setSelectedOptionLabel] = React.useState(
    labelFromValue(storyProperties.value)
  );
  const [selectedOptionValue, setSelectedOptionValue] = React.useState(storyProperties.value);

  React.useEffect(() => {
    setSelectedOptionLabel(labelFromValue(storyProperties.value));
    setSelectedOptionValue(storyProperties.value);
  }, [storyProperties.value]);

  return (
    <div
      data-brand={storyProperties.brand}
      data-theme={storyProperties.theme}
      style={{
        display: 'grid',
        gap: '1rem',
        maxWidth: storyProperties.fullWidth ? '100%' : '28rem',
        minHeight: '100vh',
        padding: '2rem',
        background: 'var(--ff-color-canvas)',
        color: 'var(--ff-color-text-primary)',
        fontFamily: 'Inter, Arial, sans-serif'
      }}
    >
      <FfDropdown
        disabled={storyProperties.disabled}
        fullWidth={storyProperties.fullWidth}
        label={storyProperties.label}
        options={dropdownOptions}
        placeholder={storyProperties.placeholder}
        value={selectedOptionValue}
        onFfValueChange={(customEvent) => {
          setSelectedOptionLabel(customEvent.detail.label);
          setSelectedOptionValue(customEvent.detail.value);
        }}
      />

      <div
        aria-live="polite"
        role="status"
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
          Selection status
        </p>
        <strong>Current selection: {selectedOptionLabel}</strong>
      </div>
    </div>
  );
}

function labelFromValue(selectedValue: string) {
  return dropdownOptions.find((option) => option.value === selectedValue)?.label ?? 'No selection';
}

function brandLabel(brandKey: string) {
  if (brandKey === 'custom-brand') {
    return 'Custom Brand';
  }

  return brandKey.replace('brand-', 'Brand ');
}

function titleFromKey(value: string) {
  return value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
