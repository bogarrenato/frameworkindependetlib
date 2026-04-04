import { Component, h, Host, Prop } from '@stencil/core';

/**
 * Logic-only button primitive shared across every consumer framework.
 *
 * The component intentionally owns only semantic behavior and a stable DOM contract.
 * Visual identity must come from the consuming application's token contract and brand pack.
 *
 * ## Where the component logic lives
 *
 * - Props (disabled, type, fullWidth, label) control native button behavior and host layout.
 * - The render method outputs a <Host> with conditional CSS classes and a native <button>
 *   with a <slot> for content projection.
 * - Shadow DOM encapsulation (shadow: true) ensures the internal DOM structure is stable
 *   and cannot be broken by consumer CSS.
 *
 * ## Where the visual identity comes from (NOT here)
 *
 * - ff-button.css reads --ff-button-* CSS custom properties (bg, fg, radius, padding per state).
 * - Those variables are defined in packages/tokens/src/contract.css (stable API with fallbacks).
 * - Concrete brand values come from packages/brand-styles/src/*.css (e.g. brand-1-light.css).
 * - The consumer app shell sets data-brand and data-theme attributes, which activate the
 *   correct CSS overrides via attribute selectors in the brand pack CSS.
 *
 * Result: this file never imports or references any color, font, or spacing value.
 * The same compiled component binary works with Brand 1, Brand 2, Brand 3, or any custom brand.
 */
@Component({
  tag: 'ff-button',
  // ff-button.css contains only structural CSS and token var() references.
  // No brand colors or theme values exist in that file.
  styleUrl: 'ff-button.css',
  // Shadow DOM ensures the component's internal DOM is a stable contract.
  // Consumer apps style through ::part(button) or CSS custom properties, not internal classes.
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
      // Host class map drives layout modifiers on the custom element itself.
      // The --full-width modifier switches display from inline-flex to flex (see ff-button.css).
      <Host
        class={{
          'ff-button-host': true,
          'ff-button-host--full-width': this.fullWidth
        }}
      >
        {/*
          The native <button> is exposed as a shadow part named "button" so consumer apps
          can apply external styles via ::part(button) { ... } without breaking encapsulation.

          The <slot> projects consumer content into the button. When no slotted content is
          provided, the label prop serves as fallback text.
        */}
        <button class="ff-button" disabled={this.disabled} part="button" type={this.type}>
          <slot>{this.label}</slot>
        </button>
      </Host>
    );
  }
}
