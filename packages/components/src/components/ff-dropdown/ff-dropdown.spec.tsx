import { newSpecPage } from '@stencil/core/testing';
import { FfDropdown } from './ff-dropdown';

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

type DropdownHostElement = HTMLElement & {
  options: typeof dropdownOptions;
  value?: string;
};

describe('ff-dropdown', () => {
  it('renders the configured label and placeholder in the trigger', async () => {
    const specPage = await newSpecPage({
      components: [FfDropdown],
      html: '<ff-dropdown label="Release target" placeholder="Choose a target"></ff-dropdown>'
    });

    const hostElement = specPage.root as DropdownHostElement;
    hostElement.options = [...dropdownOptions];
    await specPage.waitForChanges();

    const shadowRoot = specPage.root?.shadowRoot;

    expect(shadowRoot?.textContent).toContain('Release target');
    expect(shadowRoot?.querySelector('button')?.textContent).toContain('Choose a target');
  });

  it('opens, selects an option, and emits the selected value detail', async () => {
    const specPage = await newSpecPage({
      components: [FfDropdown],
      html: '<ff-dropdown label="Release target"></ff-dropdown>'
    });

    const hostElement = specPage.root as DropdownHostElement;
    hostElement.options = [...dropdownOptions];
    await specPage.waitForChanges();

    const valueChangeHandler = jest.fn();
    hostElement.addEventListener('ffValueChange', valueChangeHandler);

    const triggerButton = hostElement.shadowRoot?.querySelector('button');
    triggerButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await specPage.waitForChanges();

    const optionElements = hostElement.shadowRoot?.querySelectorAll<HTMLElement>('[role="option"]');
    optionElements?.[1].dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await specPage.waitForChanges();

    expect(hostElement.value).toBe('production-rollout');
    expect(valueChangeHandler).toHaveBeenCalledTimes(1);
    expect(valueChangeHandler.mock.calls[0][0].detail).toEqual({
      label: 'Production rollout',
      option: dropdownOptions[1],
      value: 'production-rollout'
    });
  });

  it('supports keyboard navigation from the trigger and keeps the ARIA structure valid', async () => {
    const specPage = await newSpecPage({
      components: [FfDropdown],
      html: '<ff-dropdown label="Release target"></ff-dropdown>'
    });

    const hostElement = specPage.root as DropdownHostElement;
    hostElement.options = [...dropdownOptions];
    await specPage.waitForChanges();

    const triggerButton = hostElement.shadowRoot?.querySelector('button');

    triggerButton?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    await specPage.waitForChanges();

    const activeOptionElement = hostElement.shadowRoot?.querySelector<HTMLElement>('[role="option"][tabindex="0"]');
    activeOptionElement?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
    await specPage.waitForChanges();

    const lastActiveOptionElement = hostElement.shadowRoot?.querySelector<HTMLElement>('[role="option"][tabindex="0"]');
    lastActiveOptionElement?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    await specPage.waitForChanges();

    expect(hostElement.value).toBe('maintenance-window');
    expect(triggerButton?.getAttribute('aria-haspopup')).toBe('listbox');
    expect(triggerButton?.getAttribute('aria-expanded')).toBe('false');
    expect(hostElement.shadowRoot?.querySelector('[role="listbox"]')).toBeNull();
    expect(hostElement.shadowRoot?.querySelectorAll('[role="option"]').length).toBe(0);
  });
});
