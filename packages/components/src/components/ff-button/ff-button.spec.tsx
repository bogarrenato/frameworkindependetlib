import { newSpecPage } from '@stencil/core/testing';
import { FfButton } from './ff-button';

describe('ff-button', () => {
  it('renders the label property inside the native button', async () => {
    const specPage = await newSpecPage({
      components: [FfButton],
      html: '<ff-button label="Launch selected brand"></ff-button>'
    });

    const nativeButtonElement = specPage.root?.shadowRoot?.querySelector('button');

    expect(nativeButtonElement?.textContent).toContain('Launch selected brand');
    expect(nativeButtonElement?.getAttribute('type')).toBe('button');
  });

  it('forwards the disabled and full-width properties to the host and native button', async () => {
    const specPage = await newSpecPage({
      components: [FfButton],
      html: '<ff-button label="Inline token tweak"></ff-button>'
    });

    const hostElement = specPage.root;
    hostElement?.setAttribute('disabled', '');
    hostElement?.setAttribute('full-width', '');
    await specPage.waitForChanges();

    const nativeButtonElement = specPage.root?.shadowRoot?.querySelector('button');

    expect(hostElement?.classList.contains('ff-button-host--full-width')).toBe(true);
    expect(nativeButtonElement?.hasAttribute('disabled')).toBe(true);
    expect(nativeButtonElement?.textContent).toContain('Inline token tweak');
  });
});
