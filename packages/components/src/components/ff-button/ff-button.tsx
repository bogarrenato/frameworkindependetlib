import { Component, h, Host, Prop } from '@stencil/core';

type PreviewState = 'auto' | 'default' | 'hover' | 'active';

@Component({
  tag: 'ff-button',
  styleUrl: 'ff-button.css',
  shadow: true
})
export class FfButton {
  /**
   * Theme key resolved against the external CSS token contract.
   * Consumers can keep the shipped `light` / `dark` values or define their own.
   */
  @Prop() theme = 'inherit';

  /**
   * Brand key resolved against the external CSS token contract.
   * This stays open so apps can ship brand overrides outside the component package.
   */
  @Prop() brand = 'inherit';

  @Prop() disabled = false;
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';
  @Prop() fullWidth = false;
  @Prop() label?: string;
  @Prop() previewState: PreviewState = 'auto';

  render() {
    const hostData: Record<string, string | undefined> = {};

    if (this.theme !== 'inherit') {
      hostData['data-theme'] = this.theme;
    }

    if (this.brand !== 'inherit') {
      hostData['data-brand'] = this.brand;
    }

    if (this.previewState !== 'auto') {
      hostData['data-state'] = this.previewState;
    }

    return (
      <Host
        {...hostData}
        class={{
          'ff-button-host': true,
          'ff-button-host--full-width': this.fullWidth
        }}
      >
        <button class="ff-button" disabled={this.disabled} type={this.type}>
          <slot>{this.label}</slot>
        </button>
      </Host>
    );
  }
}
