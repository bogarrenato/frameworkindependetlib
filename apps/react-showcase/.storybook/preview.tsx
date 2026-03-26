import type { Preview } from '@storybook/react-vite';
import React from 'react';
import '@fuggetlenfe/tokens/contract.css';
import '@fuggetlenfe/tokens/figma-preset.css';
import '../../../examples/external-brand.css';
import '../../../examples/registry-installed/owned-brand-pack/owned-brand.css';
import '../src/index.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ]
      }
    },
    brand: {
      name: 'Brand',
      defaultValue: 'brand-1',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'brand-1', title: 'Brand 1' },
          { value: 'brand-2', title: 'Brand 2' },
          { value: 'brand-3', title: 'Brand 3' },
          { value: 'client-acme', title: 'Client Acme' },
          { value: 'registry-owned', title: 'Registry Owned' }
        ]
      }
    }
  },
  decorators: [
    (Story, context) => (
      <div
        data-theme={String(context.globals.theme ?? 'light')}
        data-brand={String(context.globals.brand ?? 'brand-1')}
        style={{
          minHeight: '100vh',
          padding: '2rem',
          background: 'var(--ff-color-canvas)',
          color: 'var(--ff-color-text-primary)'
        }}
      >
        <Story />
      </div>
    )
  ],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true
    }
  }
};

export default preview;
