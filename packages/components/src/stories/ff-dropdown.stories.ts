import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { FfDropdownOption } from '../components/ff-dropdown/ff-dropdown';

const brandOptions = ['brand-1', 'brand-2', 'brand-3', 'custom-brand'] as const;
const dropdownOptions: FfDropdownOption[] = [
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

type DropdownCustomElement = HTMLElement & {
  disabled: boolean;
  fullWidth: boolean;
  label: string;
  options: FfDropdownOption[];
  placeholder: string;
  value?: string;
};

type DropdownStoryProperties = {
  disabled: boolean;
  fullWidth: boolean;
  label: string;
  placeholder: string;
  value: string;
};

const meta = {
  title: 'Stencil/FfDropdown',
  component: 'ff-dropdown',
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
          'Stencil implementation of a WCAG-focused dropdown primitive. Selection logic, keyboard navigation, and listbox accessibility live in Stencil, while the visual brand comes from external CSS tokens.'
      }
    }
  },
  render: (storyProperties: DropdownStoryProperties, storyContext) =>
    createPlaygroundElement({
      ...storyProperties,
      brand: String(storyContext.globals.brand ?? 'brand-1'),
      theme: String(storyContext.globals.theme ?? 'light')
    })
} satisfies Meta<DropdownStoryProperties>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const BrandMatrix: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The same dropdown logic receives different visual identities from the active brand and theme tokens.'
      }
    }
  },
  render: (_, storyContext) => createBrandMatrixElement(String(storyContext.globals.theme ?? 'light'))
};

function createPlaygroundElement(
  storyProperties: DropdownStoryProperties & { brand: string; theme: string }
) {
  const wrapperElement = document.createElement('div');
  wrapperElement.dataset.brand = storyProperties.brand;
  wrapperElement.dataset.theme = storyProperties.theme;
  wrapperElement.style.display = 'grid';
  wrapperElement.style.gap = '1rem';
  wrapperElement.style.maxWidth = storyProperties.fullWidth ? '100%' : '28rem';
  wrapperElement.style.minHeight = '100vh';
  wrapperElement.style.padding = '2rem';
  wrapperElement.style.background = 'var(--ff-color-canvas)';
  wrapperElement.style.color = 'var(--ff-color-text-primary)';
  wrapperElement.style.fontFamily = 'Inter, Arial, sans-serif';

  const dropdownElement = createDropdownElement(storyProperties);
  const statusElement = createStatusElement(
    `Current selection: ${labelFromValue(storyProperties.value)}`
  );

  dropdownElement.addEventListener('ffValueChange', (customEvent: Event) => {
    const eventDetail = (customEvent as CustomEvent<{ label: string }>).detail;
    statusElement.querySelector('strong')!.textContent = `Current selection: ${eventDetail.label}`;
  });

  wrapperElement.append(dropdownElement, statusElement);
  return wrapperElement;
}

function createBrandMatrixElement(theme: string) {
  const wrapperElement = document.createElement('div');
  wrapperElement.dataset.theme = theme;
  wrapperElement.style.minHeight = '100vh';
  wrapperElement.style.padding = '2rem';
  wrapperElement.style.background = 'var(--ff-color-canvas)';
  wrapperElement.style.color = 'var(--ff-color-text-primary)';
  wrapperElement.style.fontFamily = 'Inter, Arial, sans-serif';

  const gridElement = document.createElement('div');
  gridElement.style.display = 'grid';
  gridElement.style.gridTemplateColumns = 'repeat(auto-fit, minmax(260px, 1fr))';
  gridElement.style.gap = '1rem';
  gridElement.style.maxWidth = '1200px';

  for (const brand of brandOptions) {
    const sectionElement = document.createElement('section');
    sectionElement.dataset.brand = brand;
    sectionElement.style.display = 'grid';
    sectionElement.style.gap = '0.75rem';
    sectionElement.style.padding = '1rem';
    sectionElement.style.border = '1px solid var(--ff-color-border-subtle)';
    sectionElement.style.background = 'var(--ff-color-surface)';

    const titleElement = document.createElement('h3');
    titleElement.textContent = brandLabel(brand);
    titleElement.style.margin = '0';
    titleElement.style.fontSize = '1rem';

    const dropdownElement = createDropdownElement({
      disabled: false,
      fullWidth: true,
      label: 'Release target',
      placeholder: 'Choose a release target',
      value: 'production-rollout'
    });

    const captionElement = document.createElement('div');
    captionElement.textContent = `Theme: ${titleFromKey(theme)}`;
    captionElement.style.color = 'var(--ff-color-text-secondary)';
    captionElement.style.fontSize = '0.9rem';

    sectionElement.append(titleElement, dropdownElement, captionElement);
    gridElement.append(sectionElement);
  }

  wrapperElement.append(gridElement);
  return wrapperElement;
}

function createDropdownElement(storyProperties: DropdownStoryProperties) {
  const dropdownElement = document.createElement('ff-dropdown') as DropdownCustomElement;
  dropdownElement.disabled = storyProperties.disabled;
  dropdownElement.fullWidth = storyProperties.fullWidth;
  dropdownElement.label = storyProperties.label;
  dropdownElement.options = dropdownOptions;
  dropdownElement.placeholder = storyProperties.placeholder;
  dropdownElement.value = storyProperties.value;
  return dropdownElement;
}

function createStatusElement(message: string) {
  const statusElement = document.createElement('div');
  statusElement.setAttribute('role', 'status');
  statusElement.setAttribute('aria-live', 'polite');
  statusElement.style.display = 'grid';
  statusElement.style.gap = '0.5rem';
  statusElement.style.padding = '1rem';
  statusElement.style.border = '1px solid var(--ff-color-border-subtle)';
  statusElement.style.background = 'var(--ff-color-surface)';

  const eyebrowElement = document.createElement('p');
  eyebrowElement.textContent = 'Selection status';
  eyebrowElement.style.margin = '0';
  eyebrowElement.style.textTransform = 'uppercase';
  eyebrowElement.style.letterSpacing = '0.12em';
  eyebrowElement.style.fontSize = '0.72rem';
  eyebrowElement.style.color = 'var(--ff-color-text-muted)';

  const messageElement = document.createElement('strong');
  messageElement.textContent = message;

  statusElement.append(eyebrowElement, messageElement);
  return statusElement;
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
