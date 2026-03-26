import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'ff-button',
  styleUrl: 'ff-button.css',
  shadow: true
})
export class FfButton {
  @Prop() disabled = false;
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';
  @Prop() fullWidth = false;
  @Prop() label?: string;

  render() {
    return (
      <Host
        class={{
          'ff-button-host': true,
          'ff-button-host--full-width': this.fullWidth
        }}
      >
        <button class="ff-button" disabled={this.disabled} part="button" type={this.type}>
          <slot>{this.label}</slot>
        </button>
      </Host>
    );
  }
}
