import type { Preview } from '@storybook/web-components-vite';
import '../../tokens/src/contract.css';
import '../../tokens/src/figma-preset.css';
import '../../brand-styles/src/demo.css';
import './preview.css';
import { defineCustomElement as defineFfButton } from '../dist/components/ff-button.js';

if (typeof window !== 'undefined' && !window.customElements.get('ff-button')) {
  defineFfButton();
}

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
    (Story, context) => {
      const theme = String(context.globals.theme ?? 'light');
      const brand = String(context.globals.brand ?? 'brand-1');

      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.brand = brand;
      document.body.dataset.theme = theme;
      document.body.dataset.brand = brand;

      return Story();
    }
  ],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true
    },
    options: {
      storySort: {
        order: ['Stencil']
      }
    }
  }
};

export default preview;
