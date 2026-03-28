import { Component, h, Host, Prop } from '@stencil/core';

/**
 * Logic-only button primitive shared across every consumer framework.
 *
 * The component intentionally owns only semantic behavior and a stable DOM contract.
 * Visual identity must come from the consuming application's token contract and brand pack.
 */
@Component({
  tag: 'ff-button',
  styleUrl: 'ff-button.css',
  shadow: true
})
export class FfButton {
  /** Disables pointer and keyboard interaction on the native button element. */
  @Prop() disabled = false;

  /** Mirrors the native button type attribute so forms keep expected behavior. */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /** Expands the host to full width without coupling layout rules to a brand theme. */
  @Prop() fullWidth = false;

  /** Provides a simple fallback label when no slotted content is passed. */
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
