import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
  Watch
} from '@stencil/core';

let dropdownInstanceCounter = 0;

export interface FfDropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface FfDropdownValueChangeDetail {
  label: string;
  option: FfDropdownOption;
  value: string;
}

export interface FfDropdownOpenChangeDetail {
  open: boolean;
}

type DropdownHostElement = HTMLElement;

/**
 * Accessible dropdown primitive that keeps all interaction logic inside Stencil.
 *
 * The component owns keyboard navigation, selection state, focus handling, and the
 * public accessibility contract. Visual identity still comes exclusively from the
 * external token contract and the active brand pack.
 */
@Component({
  tag: 'ff-dropdown',
  styleUrl: 'ff-dropdown.css',
  shadow: true
})
export class FfDropdown {
  @Element() declare hostElement: DropdownHostElement;

  /** Visible field label and accessible name for the dropdown trigger. */
  @Prop() label = 'Select an option';

  /** Placeholder text shown when no option is currently selected. */
  @Prop() placeholder = 'Choose an option';

  /** Complete option list rendered by the dropdown panel. */
  @Prop() options: FfDropdownOption[] = [];

  /** Currently selected option value. Can be controlled from the consuming app shell. */
  @Prop({ mutable: true }) value?: string;

  /** Disables opening, keyboard navigation, and option selection. */
  @Prop() disabled = false;

  /** Expands the host to the width of its container. */
  @Prop() fullWidth = false;

  /** Emitted when the selected value changes. */
  @Event({ eventName: 'ffValueChange' })
  declare ffValueChange: EventEmitter<FfDropdownValueChangeDetail>;

  /** Emitted when the dropdown panel opens or closes. */
  @Event({ eventName: 'ffOpenChange' })
  declare ffOpenChange: EventEmitter<FfDropdownOpenChangeDetail>;

  @State() activeOptionIndex = -1;
  @State() isOpen = false;

  private readonly listboxId = `ff-dropdown-listbox-${dropdownInstanceCounter += 1}`;
  private readonly labelId = `${this.listboxId}-label`;
  private readonly triggerId = `${this.listboxId}-trigger`;
  private lastFocusedOptionIndex = -1;
  private triggerElement?: HTMLButtonElement;

  componentWillLoad() {
    this.synchronizeActiveOption();
  }

  connectedCallback() {
    document.addEventListener('pointerdown', this.handleDocumentPointerDown);
  }

  disconnectedCallback() {
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown);
  }

  componentDidRender() {
    if (!this.isOpen) {
      this.lastFocusedOptionIndex = -1;
      return;
    }

    if (this.activeOptionIndex === this.lastFocusedOptionIndex) {
      return;
    }

    const activeOptionElement = this.getActiveOptionElement();
    if (!activeOptionElement) {
      return;
    }

    this.lastFocusedOptionIndex = this.activeOptionIndex;
    requestAnimationFrame(() => {
      activeOptionElement.focus();
      activeOptionElement.scrollIntoView({ block: 'nearest' });
    });
  }

  @Watch('options')
  handleOptionsChange() {
    this.synchronizeActiveOption();
  }

  @Watch('value')
  handleValueChange() {
    this.synchronizeActiveOption();
  }

  @Watch('disabled')
  handleDisabledChange(isDisabled: boolean) {
    if (isDisabled) {
      this.closeDropdown(false);
    }
  }

  private get normalizedOptions() {
    return Array.isArray(this.options) ? this.options : [];
  }

  private get selectedOption() {
    return this.normalizedOptions.find((option) => option.value === this.value);
  }

  private getOptionId(optionIndex: number) {
    return `${this.listboxId}-option-${optionIndex}`;
  }

  private synchronizeActiveOption() {
    const selectedOptionIndex = this.findOptionIndexByValue(this.value);
    if (selectedOptionIndex >= 0) {
      this.activeOptionIndex = selectedOptionIndex;
      return;
    }

    if (this.activeOptionIndex >= 0 && !this.normalizedOptions[this.activeOptionIndex]?.disabled) {
      return;
    }

    this.activeOptionIndex = this.findFirstEnabledOptionIndex();
  }

  private findOptionIndexByValue(selectedValue?: string) {
    if (!selectedValue) {
      return -1;
    }

    return this.normalizedOptions.findIndex((option) => option.value === selectedValue && !option.disabled);
  }

  private findFirstEnabledOptionIndex() {
    return this.normalizedOptions.findIndex((option) => !option.disabled);
  }

  private findLastEnabledOptionIndex() {
    for (let optionIndex = this.normalizedOptions.length - 1; optionIndex >= 0; optionIndex -= 1) {
      if (!this.normalizedOptions[optionIndex].disabled) {
        return optionIndex;
      }
    }

    return -1;
  }

  private findNextEnabledOptionIndex(startIndex: number, step: 1 | -1) {
    const optionCount = this.normalizedOptions.length;
    if (optionCount === 0) {
      return -1;
    }

    for (let iterationIndex = 0; iterationIndex < optionCount; iterationIndex += 1) {
      const nextIndex = (startIndex + step * iterationIndex + optionCount) % optionCount;
      if (!this.normalizedOptions[nextIndex].disabled) {
        return nextIndex;
      }
    }

    return -1;
  }

  private getActiveOptionElement() {
    return this.hostElement.shadowRoot?.querySelector<HTMLElement>(
      `[data-option-index="${this.activeOptionIndex}"]`
    );
  }

  private setOpenState(shouldOpen: boolean) {
    if (this.isOpen === shouldOpen) {
      return;
    }

    this.isOpen = shouldOpen;
    this.ffOpenChange.emit({ open: shouldOpen });
  }

  private openDropdown(preferredOptionIndex?: number) {
    const fallbackOptionIndex = this.findOptionIndexByValue(this.value);
    const nextActiveIndex =
      preferredOptionIndex ??
      (fallbackOptionIndex >= 0 ? fallbackOptionIndex : this.findFirstEnabledOptionIndex());

    this.activeOptionIndex = nextActiveIndex;
    this.setOpenState(true);
  }

  private closeDropdown(restoreTriggerFocus = false) {
    this.setOpenState(false);

    if (restoreTriggerFocus) {
      requestAnimationFrame(() => this.triggerElement?.focus());
    }
  }

  private selectOption(optionIndex: number) {
    const selectedOption = this.normalizedOptions[optionIndex];
    if (!selectedOption || selectedOption.disabled) {
      return;
    }

    this.value = selectedOption.value;
    this.activeOptionIndex = optionIndex;
    this.ffValueChange.emit({
      label: selectedOption.label,
      option: selectedOption,
      value: selectedOption.value
    });
    this.closeDropdown(true);
  }

  private handleDocumentPointerDown = (pointerEvent: PointerEvent) => {
    if (!this.isOpen) {
      return;
    }

    const eventPath = pointerEvent.composedPath();
    if (!eventPath.includes(this.hostElement)) {
      this.closeDropdown(false);
    }
  };

  private handleTriggerClick = () => {
    if (this.disabled) {
      return;
    }

    if (this.isOpen) {
      this.closeDropdown(false);
      return;
    }

    this.openDropdown();
  };

  private handleTriggerKeyDown = (keyboardEvent: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (keyboardEvent.key === 'ArrowDown') {
      keyboardEvent.preventDefault();
      this.openDropdown(this.findFirstEnabledOptionIndex());
      return;
    }

    if (keyboardEvent.key === 'ArrowUp') {
      keyboardEvent.preventDefault();
      this.openDropdown(this.findLastEnabledOptionIndex());
      return;
    }

    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
      keyboardEvent.preventDefault();
      this.handleTriggerClick();
    }
  };

  private handleOptionKeyDown = (keyboardEvent: KeyboardEvent, optionIndex: number) => {
    if (keyboardEvent.key === 'ArrowDown') {
      keyboardEvent.preventDefault();
      this.activeOptionIndex = this.findNextEnabledOptionIndex(optionIndex + 1, 1);
      return;
    }

    if (keyboardEvent.key === 'ArrowUp') {
      keyboardEvent.preventDefault();
      this.activeOptionIndex = this.findNextEnabledOptionIndex(optionIndex - 1, -1);
      return;
    }

    if (keyboardEvent.key === 'Home') {
      keyboardEvent.preventDefault();
      this.activeOptionIndex = this.findFirstEnabledOptionIndex();
      return;
    }

    if (keyboardEvent.key === 'End') {
      keyboardEvent.preventDefault();
      this.activeOptionIndex = this.findLastEnabledOptionIndex();
      return;
    }

    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
      keyboardEvent.preventDefault();
      this.selectOption(optionIndex);
      return;
    }

    if (keyboardEvent.key === 'Escape') {
      keyboardEvent.preventDefault();
      this.closeDropdown(true);
      return;
    }

    if (keyboardEvent.key === 'Tab') {
      this.closeDropdown(false);
    }
  };

  render() {
    const selectedOption = this.selectedOption;
    const triggerText = selectedOption?.label ?? this.placeholder;

    return (
      <Host
        class={{
          'ff-dropdown-host': true,
          'ff-dropdown-host--full-width': this.fullWidth
        }}
      >
        <div class="ff-dropdown">
          <span class="ff-dropdown__label" id={this.labelId} part="label">
            {this.label}
          </span>

          <button
            aria-controls={this.listboxId}
            aria-expanded={String(this.isOpen)}
            aria-haspopup="listbox"
            aria-labelledby={this.labelId}
            class="ff-dropdown__trigger"
            disabled={this.disabled}
            id={this.triggerId}
            onClick={this.handleTriggerClick}
            onKeyDown={this.handleTriggerKeyDown}
            part="trigger"
            ref={(element) => {
              this.triggerElement = element ?? undefined;
            }}
            type="button"
          >
            <span
              class={{
                'ff-dropdown__trigger-text': true,
                'ff-dropdown__trigger-text--placeholder': !selectedOption
              }}
              part="value"
            >
              {triggerText}
            </span>
            <span
              aria-hidden="true"
              class={{
                'ff-dropdown__trigger-icon': true,
                'ff-dropdown__trigger-icon--open': this.isOpen
              }}
              part="icon"
            >
              ▾
            </span>
          </button>

          {this.isOpen ? (
            <div class="ff-dropdown__panel" part="panel">
              <div aria-labelledby={this.labelId} class="ff-dropdown__listbox" id={this.listboxId} role="listbox">
                {this.normalizedOptions.length === 0 ? (
                  <div class="ff-dropdown__empty-state" part="empty-state">
                    No options available.
                  </div>
                ) : (
                  this.normalizedOptions.map((option, optionIndex) => {
                    const isSelected = option.value === this.value;
                    const isActive = optionIndex === this.activeOptionIndex;

                    return (
                      <div
                        aria-disabled={option.disabled ? 'true' : undefined}
                        aria-selected={String(isSelected)}
                        class={{
                          'ff-dropdown__option': true,
                          'ff-dropdown__option--active': isActive,
                          'ff-dropdown__option--disabled': !!option.disabled,
                          'ff-dropdown__option--selected': isSelected
                        }}
                        data-option-index={optionIndex}
                        id={this.getOptionId(optionIndex)}
                        onClick={() => this.selectOption(optionIndex)}
                        onKeyDown={(keyboardEvent) => this.handleOptionKeyDown(keyboardEvent, optionIndex)}
                        onMouseMove={() => {
                          if (!option.disabled) {
                            this.activeOptionIndex = optionIndex;
                          }
                        }}
                        part="option"
                        role="option"
                        tabIndex={isActive ? 0 : -1}
                      >
                        <span class="ff-dropdown__option-copy">
                          <span class="ff-dropdown__option-label" part="option-label">
                            {option.label}
                          </span>
                          {option.description ? (
                            <span class="ff-dropdown__option-description" part="option-description">
                              {option.description}
                            </span>
                          ) : null}
                        </span>
                        <span aria-hidden="true" class="ff-dropdown__option-indicator" part="option-indicator">
                          {isSelected ? '✓' : ''}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : null}
        </div>
      </Host>
    );
  }
}
