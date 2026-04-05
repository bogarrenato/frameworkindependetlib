import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  Watch
} from '@stencil/core';

/**
 * ff-modal — framework-agnostic modal dialog primitive.
 *
 * ## Architectural role
 * Owns dialog semantics, focus trap, escape handling, and scroll lock. Visual chrome
 * (surface color, radius, backdrop, shadow, typography) comes from the token contract
 * and brand pack via CSS custom properties. No brand values in this file.
 *
 * ## SSR / SSG readiness contract
 *  1. `open` is a prop, default `false`. Server and client render the same DOM on first
 *     paint — the modal is present but hidden via `aria-hidden="true"` + display:none,
 *     eliminating hydration mismatches even when the modal state is computed from a
 *     URL parameter or cookie.
 *  2. Focus management, scroll lock, and keydown listeners are only attached inside
 *     componentDidLoad (client-only). No `document.body.style.overflow` touch on server.
 *  3. The modal uses a div with role="dialog" rather than the native <dialog> element,
 *     because <dialog> has inconsistent SSR behavior across browsers when rendered via
 *     Declarative Shadow DOM.
 *  4. Portalization is NOT done here. The element renders in its natural DOM position.
 *     Host apps that need a portal can wrap the component themselves — this keeps the
 *     SSR output deterministic and avoids teleport-induced hydration warnings.
 *
 * ## Token contract inputs
 *  --ff-modal-backdrop, --ff-modal-surface, --ff-modal-radius,
 *  --ff-modal-shadow, --ff-modal-title-color, --ff-modal-body-color,
 *  --ff-color-text-primary, --ff-font-family-brand
 */
@Component({
  tag: 'ff-modal',
  styleUrl: 'ff-modal.css',
  shadow: true
})
export class FfModal {
  @Element() host!: HTMLElement;

  /** Controlled open state. Parent app drives open/close. */
  @Prop({ mutable: true, reflect: true }) open = false;

  /** Title displayed in the modal header. Falls back to slot="title". */
  @Prop() ffTitle?: string;

  /** Accessible description id reference for aria-describedby. */
  @Prop() ariaDescribedbyId?: string;

  /** When false, clicking the backdrop will NOT close the modal. */
  @Prop() closeOnBackdrop = true;

  /** When false, pressing Escape will NOT close the modal. */
  @Prop() closeOnEscape = true;

  /** Prevents body scroll while the modal is open. Defaults to true. */
  @Prop() lockScroll = true;

  /**
   * Emitted before the modal closes. Consumers may call preventDefault on the
   * underlying event to cancel closing (e.g. unsaved changes guard).
   */
  @Event({ eventName: 'ffClose', bubbles: true, composed: true }) ffClose!: EventEmitter<void>;

  private previouslyFocused: HTMLElement | null = null;

  private handleKeydown = (event: KeyboardEvent) => {
    if (!this.open) return;
    if (event.key === 'Escape' && this.closeOnEscape) {
      event.preventDefault();
      this.requestClose();
    }
    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  };

  componentDidLoad() {
    if (typeof document === 'undefined') return;
    document.addEventListener('keydown', this.handleKeydown);
    if (this.open) {
      this.applyOpenSideEffects();
    }
  }

  disconnectedCallback() {
    if (typeof document === 'undefined') return;
    document.removeEventListener('keydown', this.handleKeydown);
    if (this.lockScroll) {
      document.body.style.overflow = '';
    }
  }

  @Watch('open')
  handleOpenChange(nextOpen: boolean) {
    if (typeof document === 'undefined') return;
    if (nextOpen) {
      this.applyOpenSideEffects();
    } else {
      this.releaseSideEffects();
    }
  }

  /** Imperative API — open the modal from code. */
  @Method()
  async show(): Promise<void> {
    this.open = true;
  }

  /** Imperative API — close the modal from code. */
  @Method()
  async close(): Promise<void> {
    this.requestClose();
  }

  private applyOpenSideEffects() {
    if (typeof document === 'undefined') return;
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    if (this.lockScroll) {
      document.body.style.overflow = 'hidden';
    }
    // Defer focus to allow the dialog element to be laid out.
    requestAnimationFrame(() => {
      const focusable = this.firstFocusable();
      focusable?.focus();
    });
  }

  private releaseSideEffects() {
    if (typeof document === 'undefined') return;
    if (this.lockScroll) {
      document.body.style.overflow = '';
    }
    this.previouslyFocused?.focus?.();
  }

  private requestClose() {
    this.ffClose.emit();
    this.open = false;
  }

  private firstFocusable(): HTMLElement | null {
    const root = this.host.shadowRoot;
    if (!root) return null;
    return root.querySelector<HTMLElement>(
      '[data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  private trapFocus(event: KeyboardEvent) {
    const root = this.host.shadowRoot;
    if (!root) return;
    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = root.activeElement as HTMLElement | null;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private handleBackdropClick = (event: MouseEvent) => {
    if (!this.closeOnBackdrop) return;
    const target = event.target as HTMLElement;
    if (target.classList.contains('ff-modal__backdrop')) {
      this.requestClose();
    }
  };

  render() {
    return (
      <Host
        class={{ 'ff-modal-host': true, 'ff-modal-host--open': this.open }}
        aria-hidden={this.open ? 'false' : 'true'}
      >
        <div class="ff-modal__backdrop" part="backdrop" onClick={this.handleBackdropClick}>
          <div
            class="ff-modal__surface"
            part="surface"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ff-modal-title"
            aria-describedby={this.ariaDescribedbyId}
          >
            <header class="ff-modal__header" part="header">
              <h2 id="ff-modal-title" class="ff-modal__title">
                <slot name="title">{this.ffTitle}</slot>
              </h2>
              <button
                type="button"
                class="ff-modal__close"
                part="close"
                aria-label="Close"
                onClick={() => this.requestClose()}
              >
                ×
              </button>
            </header>
            <section class="ff-modal__body" part="body">
              <slot />
            </section>
            <footer class="ff-modal__footer" part="footer">
              <slot name="footer" />
            </footer>
          </div>
        </div>
      </Host>
    );
  }
}
