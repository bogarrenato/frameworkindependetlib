import { Component, Element, Event, EventEmitter, h, Host, Method, Prop } from '@stencil/core';

/**
 * ff-button — framework-agnostic button primitive.
 *
 * ## Architectural role
 * Owns semantic behavior and a stable DOM contract. Visual identity is supplied from
 * outside via CSS custom properties (token contract + brand pack). This file never
 * references colors, fonts, or spacing values directly.
 *
 * ## SSR / SSG readiness contract
 * This component is written to be safe inside any server rendering context
 * (Next.js RSC, Angular Universal, Nuxt, Vite prerender, Stencil hydrate).
 *
 *  1. The render() method is a pure function of props — no DOM access, no browser globals.
 *  2. connectedCallback has NO side effects. Any API that requires a real DOM
 *     (focus, click dispatch, observers) is only touched inside componentDidLoad,
 *     which Stencil deliberately does not invoke in the hydrate module.
 *  3. Public imperative methods (`setFocus`, `click`) are server-safe: they short-circuit
 *     when the host element is not attached to a real document.
 *  4. Shadow DOM output is serialized by the Stencil hydrate module as
 *     Declarative Shadow DOM (`<template shadowrootmode="open">`), so the first paint
 *     is correct even before client-side JS finishes downloading.
 *  5. State that differs between server and client (media queries, stored preferences)
 *     is NEVER read inside this file. The consumer passes brand/theme through the shell
 *     element's `data-brand` / `data-theme` attributes, which the CSS cascade picks up.
 *
 * ## Where the visual identity comes from (NOT here)
 *  - ff-button.css reads --ff-button-* CSS custom properties (bg, fg, radius, padding).
 *  - Those variables are defined in packages/tokens/src/contract.css (stable API).
 *  - Concrete brand values come from packages/brand-styles/src/*.css.
 *  - The consumer app shell sets data-brand + data-theme on any ancestor → the token
 *    cascade applies the correct overrides via attribute selectors in the brand pack.
 */
@Component({
  tag: 'ff-button',
  styleUrl: 'ff-button.css',
  // delegatesFocus makes the host element transparently forward any focus()
  // call (programmatic or via Tab) to the first tabbable descendant inside
  // the shadow root, i.e. the native <button>. Without this, a consumer-owned
  // focus trap cannot focus a slotted ff-button because the host has no
  // tabindex of its own and the native <button> lives behind the shadow
  // boundary. delegatesFocus also mirrors how native <button> behaves when
  // clicked, so there is no behavioral regression for mouse users.
  shadow: { delegatesFocus: true }
})
export class FfButton {
  /** Host element reference. Always available; never touched unless the element is live. */
  @Element() host!: HTMLElement;

  /** Disables pointer and keyboard interaction on the native button element. */
  @Prop({ reflect: true }) disabled = false;

  /** Mirrors the native button type attribute so forms keep expected behavior. */
  @Prop({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'button';

  /** Expands the host to full width without coupling layout rules to a brand theme. */
  @Prop({ reflect: true }) fullWidth = false;

  /** Semantic variant for analytics and optional brand-pack styling hooks. */
  @Prop({ reflect: true }) variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  /** Provides a simple fallback label when no slotted content is passed. */
  @Prop() label?: string;

  /** Optional aria-label for accessible name when the button only contains an icon. */
  @Prop() ffAriaLabel?: string;

  /**
   * Fired on click. Exposed as a dedicated event so consumers in every framework
   * (React, Angular, Vue, plain HTML) can subscribe through the generated wrapper
   * without worrying about DOM event bubbling semantics.
   */
  @Event({ eventName: 'ffClick', bubbles: true, composed: true }) ffClick!: EventEmitter<MouseEvent>;

  /**
   * Imperatively move keyboard focus to the underlying native button.
   * SSR-safe: the hydrate module never invokes this method because it only runs
   * browser-triggered code paths. Still, we guard for `typeof document` to make
   * consumer code defensively safe when called from isomorphic effects.
   */
  @Method()
  async setFocus(): Promise<void> {
    if (typeof document === 'undefined') {
      return;
    }
    const button = this.host.shadowRoot?.querySelector<HTMLButtonElement>('button[part="button"]');
    button?.focus();
  }

  private handleClick = (event: MouseEvent) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.ffClick.emit(event);
  };

  render() {
    /*
     * Pure render — no DOM access, no globals. Safe to execute in Node during SSR.
     * Host class map drives layout modifiers; variant is reflected as an attribute
     * so brand packs can scope rules with [variant='danger'] selectors if they choose.
     */
    return (
      <Host
        class={{
          'ff-button-host': true,
          'ff-button-host--full-width': this.fullWidth
        }}
      >
        <button
          class="ff-button"
          disabled={this.disabled}
          part="button"
          type={this.type}
          aria-label={this.ffAriaLabel}
          onClick={this.handleClick}
        >
          <slot>{this.label}</slot>
        </button>
      </Host>
    );
  }
}
