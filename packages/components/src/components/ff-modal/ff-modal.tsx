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
      return;
    }
    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  };

  /*
   * Safety-net focus bouncer.
   *
   * The keydown-based Tab trap handles the normal case, but focus can escape the
   * modal through several less obvious paths: mouse click on a background element
   * that for some reason received focus, programmatic focus() from a timer, or a
   * browser shortcut that moved focus to the chrome and back. This focusin handler
   * runs on every focus change document-wide and bounces any focus target outside
   * the modal's logical subtree (shadow + slotted light DOM) back to the first
   * focusable. It is the belt to the keydown trap's braces.
   */
  private handleFocusin = (event: FocusEvent) => {
    if (!this.open) return;
    const target = event.target as Node | null;
    if (!target) return;
    if (this.isInsideModal(target)) return;
    const first = this.getFocusables()[0];
    if (first) {
      event.stopPropagation();
      first.focus();
    }
  };

  componentDidLoad() {
    if (typeof document === 'undefined') return;
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('focusin', this.handleFocusin, true);
    if (this.open) {
      this.applyOpenSideEffects();
    }
  }

  disconnectedCallback() {
    if (typeof document === 'undefined') return;
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('focusin', this.handleFocusin, true);
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

  /**
   * Collect every focusable element that belongs to this modal, in the order
   * the browser would visit them via native Tab.
   *
   * A modal's focusables live in TWO places:
   *
   *   1. The modal's own shadow DOM — currently just the close (X) button.
   *      This element comes first in visual order because it is rendered in
   *      the header of the modal surface.
   *
   *   2. The consumer's slotted content in the light DOM — paragraphs, form
   *      fields in the body, and action buttons (e.g. Cancel / Export) in the
   *      <slot name="footer">. These elements come after the close button.
   *
   * A shadow-root-only query would miss every slotted focusable and cause the
   * trap to leak focus to the browser chrome on the last Tab inside the modal.
   * A light-DOM-only query would miss the close button.
   *
   * Custom elements (ff-button, ff-dropdown) are focusable as a whole because
   * they declare delegatesFocus on their shadow root — calling .focus() on the
   * host forwards into the inner native control automatically.
   */
  private getFocusables(): HTMLElement[] {
    const shadowRoot = this.host.shadowRoot;
    if (!shadowRoot) return [];

    // The close button lives in the modal's own shadow DOM and must lead the
    // tab order regardless of how much slotted content the consumer passed.
    const closeButton = shadowRoot.querySelector<HTMLElement>('.ff-modal__close');

    // Slotted focusables from the light DOM. Include both native tabbables and
    // our design-system custom elements that expose focus via delegatesFocus.
    const slottedQuery = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      'ff-button:not([disabled])',
      'ff-dropdown:not([disabled])'
    ].join(',');

    const slotted = Array.from(this.host.querySelectorAll<HTMLElement>(slottedQuery));

    /*
     * Visibility check — carefully crafted to work across shadow DOM boundaries.
     *
     * `offsetParent` is NOT usable here: for elements rendered through a <slot>
     * (i.e. our Cancel / Export ff-buttons projected into the modal's shadow
     * footer), `offsetParent` returns null even though the elements are fully
     * rendered and tabbable. This is a long-standing quirk of how browsers
     * compute offset ancestry through shadow DOM, and it silently broke the
     * previous trap implementation — the slotted focusables were filtered out
     * and the trap only saw the close button.
     *
     * Element.checkVisibility() (Chrome 105+, Safari 17.4+, Firefox 125+) is
     * shadow-DOM aware and returns true for visible slotted content. We fall
     * back to a bounding-rect size probe for engines that don't implement it.
     */
    const isVisible = (el: HTMLElement): boolean => {
      type Checkable = HTMLElement & { checkVisibility?: (opts?: object) => boolean };
      const candidate = el as Checkable;
      if (typeof candidate.checkVisibility === 'function') {
        return candidate.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      }
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const collected: HTMLElement[] = [];
    if (closeButton && isVisible(closeButton)) collected.push(closeButton);
    for (const el of slotted) {
      if (isVisible(el)) collected.push(el);
    }
    return collected;
  }

  /**
   * Resolve the truly focused element by walking the shadow DOM chain.
   *
   * document.activeElement stops at the first shadow host; the real focus
   * target lives inside each nested shadow root's activeElement. Since our
   * action buttons are ff-button instances (each with its own shadow DOM
   * containing the native <button>), a one-level lookup is insufficient.
   */
  private getDeepActiveElement(): Element | null {
    let active: Element | null = document.activeElement;
    while (
      active &&
      (active as Element & { shadowRoot: ShadowRoot | null }).shadowRoot?.activeElement
    ) {
      active = (active as Element & { shadowRoot: ShadowRoot | null }).shadowRoot!
        .activeElement;
    }
    return active;
  }

  /**
   * Shadow-DOM-aware ancestor walk.
   *
   * Node.contains() does NOT cross shadow DOM boundaries in any current browser
   * engine — so calling modal.contains(innerButtonOfSlottedFfButton) returns
   * false even though the inner button is visually, logically and for-any-sane-
   * definition inside the modal. This function walks the full parent chain,
   * including stepping from a shadow root up to its host element when we reach
   * the top of a shadow tree, until it finds one of the target roots or runs
   * out of ancestors.
   *
   * Used by both the focusin safety-net (to decide whether a focus target
   * escaped the modal) and the keydown Tab trap (to decide whether the active
   * element is inside a specific focusable host).
   */
  private isDescendantOfAny(node: Node | null, roots: Array<Node | null | undefined>): boolean {
    if (!node) return false;
    const rootSet = new Set<Node>();
    for (const root of roots) {
      if (root) rootSet.add(root);
    }
    if (rootSet.size === 0) return false;

    let current: Node | null = node;
    const visited = new Set<Node>();
    while (current && !visited.has(current)) {
      visited.add(current);
      if (rootSet.has(current)) return true;
      const parent: Node | null = current.parentNode;
      if (parent) {
        current = parent;
        continue;
      }
      // No logical parent — we may be at the top of a shadow root; step up to
      // the host of that shadow root and keep walking.
      if (current instanceof ShadowRoot) {
        current = current.host;
        continue;
      }
      break;
    }
    return false;
  }

  /** Does this focusable host (or its shadow subtree) currently hold focus? */
  private hostHoldsActive(host: HTMLElement, active: Element | null): boolean {
    if (!active) return false;
    if (host === active) return true;
    const hostShadow = (host as HTMLElement & { shadowRoot: ShadowRoot | null })
      .shadowRoot;
    return this.isDescendantOfAny(active, [host, hostShadow]);
  }

  private isInsideModal(node: Node): boolean {
    return this.isDescendantOfAny(node, [this.host, this.host.shadowRoot]);
  }

  private firstFocusable(): HTMLElement | null {
    const focusables = this.getFocusables();
    // Honor an explicit data-autofocus marker if the consumer sets one.
    const preferred = focusables.find((el) => el.hasAttribute('data-autofocus'));
    return preferred ?? focusables[0] ?? null;
  }

  private trapFocus(event: KeyboardEvent) {
    const focusables = this.getFocusables();
    if (focusables.length === 0) {
      // Nothing to focus — swallow the Tab so it cannot escape the modal.
      event.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.getDeepActiveElement();

    const atFirst = this.hostHoldsActive(first, active);
    const atLast = this.hostHoldsActive(last, active);

    if (event.shiftKey && atFirst) {
      // Wrap backwards from the first focusable to the last.
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && atLast) {
      // Wrap forwards from the last focusable to the first.
      event.preventDefault();
      first.focus();
    } else if (!atFirst && !atLast) {
      // Focus is somewhere in the middle (e.g. a body-slot input) OR has
      // escaped entirely. If the deep active element is not inside the modal
      // at all, bounce it back to first. Otherwise let the native Tab run.
      if (active && !this.isInsideModal(active)) {
        event.preventDefault();
        first.focus();
      }
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
