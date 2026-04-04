import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { FfButton } from './ff-button';

describe('ff-button', () => {
  function getNativeButton(page: SpecPage): HTMLButtonElement {
    const root = page.root;
    expect(root).toBeDefined();
    const shadowRoot = root!.shadowRoot;
    expect(shadowRoot).not.toBeNull();
    const button = shadowRoot!.querySelector('button');
    expect(button).not.toBeNull();
    return button!;
  }

  it('renders a native button with default props when no attributes are set', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button></ff-button>'
    });

    const button = getNativeButton(page);

    expect(button.getAttribute('type')).toBe('button');
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.textContent).toBe('');
  });

  it('applies the ff-button-host class to the host element by default', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button></ff-button>'
    });

    const host = page.root;
    expect(host).toBeDefined();
    expect(host!.classList.contains('ff-button-host')).toBe(true);
  });

  it('does not apply the full-width modifier class by default', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button></ff-button>'
    });

    const host = page.root;
    expect(host).toBeDefined();
    expect(host!.classList.contains('ff-button-host--full-width')).toBe(false);
  });

  it('renders the label prop as fallback content inside the button', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button label="Save changes"></ff-button>'
    });

    const button = getNativeButton(page);

    expect(button.textContent).toContain('Save changes');
  });

  it('contains a slot element inside the native button for projected content', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button label="Fallback">Slotted text</ff-button>'
    });

    const button = getNativeButton(page);
    const slot = button.querySelector('slot');

    expect(slot).not.toBeNull();
  });

  it('provides the label prop as slot fallback content', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button label="Fallback"></ff-button>'
    });

    const button = getNativeButton(page);

    expect(button.textContent).toContain('Fallback');
  });

  it('forwards the disabled prop to the native button element', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button disabled></ff-button>'
    });

    const button = getNativeButton(page);

    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('does not set the disabled attribute on the native button when disabled is false', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button></ff-button>'
    });

    const button = getNativeButton(page);

    expect(button.hasAttribute('disabled')).toBe(false);
  });

  it('adds the full-width modifier class to the host when fullWidth is true', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button full-width></ff-button>'
    });

    const host = page.root;
    expect(host).toBeDefined();
    expect(host!.classList.contains('ff-button-host')).toBe(true);
    expect(host!.classList.contains('ff-button-host--full-width')).toBe(true);
  });

  it('sets type="submit" on the native button when the type prop is submit', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button type="submit"></ff-button>'
    });

    const button = getNativeButton(page);

    expect(button.getAttribute('type')).toBe('submit');
  });

  it('sets type="reset" on the native button when the type prop is reset', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button type="reset"></ff-button>'
    });

    const button = getNativeButton(page);

    expect(button.getAttribute('type')).toBe('reset');
  });

  it('defaults the native button type to "button"', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button></ff-button>'
    });

    const button = getNativeButton(page);

    expect(button.getAttribute('type')).toBe('button');
  });

  it('exposes a shadow DOM part named "button" for external styling', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button></ff-button>'
    });

    const button = getNativeButton(page);

    expect(button.getAttribute('part')).toBe('button');
  });

  it('applies both disabled and fullWidth props simultaneously', async () => {
    const page = await newSpecPage({
      components: [FfButton],
      html: '<ff-button disabled full-width label="Combined"></ff-button>'
    });

    const host = page.root;
    expect(host).toBeDefined();
    expect(host!.classList.contains('ff-button-host')).toBe(true);
    expect(host!.classList.contains('ff-button-host--full-width')).toBe(true);

    const button = getNativeButton(page);
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.textContent).toContain('Combined');
  });
});
