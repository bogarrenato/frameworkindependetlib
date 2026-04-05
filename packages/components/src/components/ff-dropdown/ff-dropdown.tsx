import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

/**
 * ff-dropdown — framework-agnostic single-select dropdown.
 *
 * ## Architectural role
 * Owns keyboard navigation, ARIA combobox semantics, and an open/close state machine.
 * Visual identity (colors, spacing, typography, radius) comes from the token contract
 * and brand pack through CSS custom properties. This file contains zero brand values.
 *
 * ## SSR / SSG readiness contract
 *  1. `open` is a prop with sensible default `false`. The server and client render the
 *     SAME initial DOM — no listbox is visible in the first paint unless the consumer
 *     explicitly sets `open`. This eliminates hydration mismatches.
 *  2. All browser-only APIs (document click-outside, keydown capture) are attached in
 *     componentDidLoad and torn down in disconnectedCallback. Neither runs on the server.
 *  3. No `matchMedia`, `localStorage`, or `navigator` lookups anywhere in the render path.
 *  4. The `options` prop accepts a plain array; consumers pass it as an attribute-safe JSON
 *     string, or as a live property (React / Angular wrappers handle both cases).
 *  5. The trigger button inside shadow DOM is exposed as part="trigger" and the listbox as
 *     part="listbox" so brand packs or host apps can style them externally.
 *
 * ## Token contract inputs
 *  --ff-dropdown-bg, --ff-dropdown-fg, --ff-dropdown-border, --ff-dropdown-radius,
 *  --ff-dropdown-menu-bg, --ff-dropdown-option-hover-bg, --ff-dropdown-option-selected-bg,
 *  --ff-color-text-primary, --ff-color-surface, --ff-font-family-brand
 *  These variables are read from the cascade — the consumer MUST import
 *  @fuggetlenfe/tokens/contract.css and a brand pack for values to resolve.
 */
export type FfDropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

@Component({
  tag: 'ff-dropdown',
  styleUrl: 'ff-dropdown.css',
  shadow: true
})
export class FfDropdown {
  @Element() host!: HTMLElement;

  /** Array of options. Accept both attribute (JSON string) and property (live array). */
  @Prop() options: FfDropdownOption[] | string = [];

  /** Selected value (controlled). Omit or pass `undefined` for uncontrolled mode. */
  @Prop({ mutable: true }) value?: string;

  /** Visible placeholder when nothing is selected. */
  @Prop() placeholder: string = 'Select…';

  /** Disables the entire dropdown. */
  @Prop({ reflect: true }) disabled = false;

  /** Controlled open state. Consumers can drive open/close from outside. */
  @Prop({ mutable: true, reflect: true }) open = false;

  /** Accessible name for the dropdown trigger. */
  @Prop() ffAriaLabel?: string;

  /** Internal highlighted index for keyboard navigation. */
  @State() highlightedIndex = -1;

  /**
   * Emitted when the selection changes.
   *
   * Note: the inner `option` shape is inlined rather than referencing FfDropdownOption,
   * because the @stencil/angular-output-target type emitter cannot resolve external
   * type aliases inside generic EventEmitter arguments. Keeping the shape inline
   * preserves a clean Angular directive surface without `any` leaks.
   */
  @Event({ eventName: 'ffChange', bubbles: true, composed: true })
  ffChange!: EventEmitter<{
    value: string;
    option: { value: string; label: string; disabled?: boolean };
  }>;

  /** Emitted whenever the dropdown opens or closes. */
  @Event({ eventName: 'ffOpenChange', bubbles: true, composed: true })
  ffOpenChange!: EventEmitter<{ open: boolean }>;

  private documentClickHandler = (event: MouseEvent) => {
    // Click-outside detection. Guarded against shadow DOM composedPath rules.
    if (!this.open) return;
    const path = event.composedPath();
    if (!path.includes(this.host)) {
      this.setOpen(false);
    }
  };

  private keydownHandler = (event: KeyboardEvent) => {
    if (this.disabled) return;
    const opts = this.parsedOptions;
    if (!this.open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.setOpen(true);
        this.highlightedIndex = Math.max(0, this.selectedIndex());
      }
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex = this.nextEnabled(this.highlightedIndex, 1, opts);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex = this.nextEnabled(this.highlightedIndex, -1, opts);
        break;
      case 'Home':
        event.preventDefault();
        this.highlightedIndex = this.nextEnabled(-1, 1, opts);
        break;
      case 'End':
        event.preventDefault();
        this.highlightedIndex = this.nextEnabled(opts.length, -1, opts);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.highlightedIndex >= 0) {
          this.commitSelection(opts[this.highlightedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.setOpen(false);
        break;
    }
  };

  /**
   * Lifecycle — componentDidLoad runs only on the client. The hydrate module that
   * executes on the server deliberately skips this hook, which is why we put all
   * document-level listeners here.
   */
  componentDidLoad() {
    if (typeof document === 'undefined') return;
    document.addEventListener('click', this.documentClickHandler, true);
    this.host.addEventListener('keydown', this.keydownHandler);
  }

  disconnectedCallback() {
    if (typeof document === 'undefined') return;
    document.removeEventListener('click', this.documentClickHandler, true);
    this.host.removeEventListener('keydown', this.keydownHandler);
  }

  @Watch('open')
  handleOpenChange(next: boolean) {
    this.ffOpenChange.emit({ open: next });
    if (!next) {
      this.highlightedIndex = -1;
    }
  }

  /** Imperative API — programmatically open the dropdown. SSR-safe no-op on server. */
  @Method()
  async openDropdown(): Promise<void> {
    this.setOpen(true);
  }

  /** Imperative API — programmatically close the dropdown. SSR-safe no-op on server. */
  @Method()
  async closeDropdown(): Promise<void> {
    this.setOpen(false);
  }

  private setOpen(value: boolean) {
    if (this.disabled && value) return;
    this.open = value;
  }

  private commitSelection(option?: FfDropdownOption) {
    if (!option || option.disabled) return;
    this.value = option.value;
    this.ffChange.emit({ value: option.value, option });
    this.setOpen(false);
  }

  private get parsedOptions(): FfDropdownOption[] {
    // Accept both JSON string (attribute mode) and live array (property mode).
    if (Array.isArray(this.options)) return this.options;
    if (typeof this.options === 'string' && this.options.trim().length > 0) {
      try {
        const parsed = JSON.parse(this.options);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  private selectedIndex(): number {
    return this.parsedOptions.findIndex((option) => option.value === this.value);
  }

  private nextEnabled(from: number, step: number, opts: FfDropdownOption[]): number {
    if (opts.length === 0) return -1;
    let index = from;
    for (let i = 0; i < opts.length; i++) {
      index = (index + step + opts.length) % opts.length;
      if (!opts[index]?.disabled) return index;
    }
    return -1;
  }

  private handleTriggerClick = () => {
    if (this.disabled) return;
    this.setOpen(!this.open);
  };

  private handleOptionClick = (option: FfDropdownOption) => (event: MouseEvent) => {
    event.stopPropagation();
    this.commitSelection(option);
  };

  render() {
    const opts = this.parsedOptions;
    const selected = opts.find((option) => option.value === this.value);

    return (
      <Host class={{ 'ff-dropdown-host': true, 'ff-dropdown-host--open': this.open }}>
        <button
          type="button"
          class="ff-dropdown__trigger"
          part="trigger"
          aria-haspopup="listbox"
          aria-expanded={this.open ? 'true' : 'false'}
          aria-label={this.ffAriaLabel}
          disabled={this.disabled}
          onClick={this.handleTriggerClick}
        >
          <span class="ff-dropdown__value">{selected ? selected.label : this.placeholder}</span>
          <span class="ff-dropdown__caret" aria-hidden="true">
            ▾
          </span>
        </button>
        {/*
          The listbox panel is always present in the DOM and toggled via aria-hidden +
          a CSS display rule. This ensures the server-rendered HTML and the client HTML
          match byte-for-byte on initial load, avoiding hydration warnings.
        */}
        <ul
          class="ff-dropdown__menu"
          part="listbox"
          role="listbox"
          aria-hidden={this.open ? 'false' : 'true'}
          tabIndex={-1}
        >
          {opts.map((option, index) => (
            <li
              class={{
                'ff-dropdown__option': true,
                'ff-dropdown__option--highlighted': index === this.highlightedIndex,
                'ff-dropdown__option--selected': option.value === this.value,
                'ff-dropdown__option--disabled': !!option.disabled
              }}
              role="option"
              aria-selected={option.value === this.value ? 'true' : 'false'}
              aria-disabled={option.disabled ? 'true' : 'false'}
              part="option"
              onClick={this.handleOptionClick(option)}
              onMouseEnter={() => (this.highlightedIndex = index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </Host>
    );
  }
}
