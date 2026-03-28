import type { Preview } from '@storybook/angular';

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
          { value: 'custom-brand', title: 'Custom Brand' }
        ]
      }
    }
  },
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true
    }
  }
};

export default preview;
