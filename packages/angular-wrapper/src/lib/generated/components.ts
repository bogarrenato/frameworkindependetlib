/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import type { Components } from '@fuggetlenfe/components/components';

import { defineCustomElement as defineFfButton } from '@fuggetlenfe/components/components/ff-button.js';
import { defineCustomElement as defineFfDataTable } from '@fuggetlenfe/components/components/ff-data-table.js';
import { defineCustomElement as defineFfDropdown } from '@fuggetlenfe/components/components/ff-dropdown.js';
import { defineCustomElement as defineFfModal } from '@fuggetlenfe/components/components/ff-modal.js';
@ProxyCmp({
  defineCustomElementFn: defineFfButton,
  inputs: ['disabled', 'ffAriaLabel', 'fullWidth', 'label', 'type', 'variant'],
  methods: ['setFocus']
})
@Component({
  selector: 'ff-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'ffAriaLabel', 'fullWidth', 'label', 'type', 'variant'],
  standalone: true
})
export class FfButton {
  protected el: HTMLFfButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ffClick']);
  }
}


export declare interface FfButton extends Components.FfButton {
  /**
   * Fired on click. Exposed as a dedicated event so consumers in every framework
(React, Angular, Vue, plain HTML) can subscribe through the generated wrapper
without worrying about DOM event bubbling semantics.
   */
  ffClick: EventEmitter<CustomEvent<MouseEvent>>;
}


@ProxyCmp({
  defineCustomElementFn: defineFfDataTable,
  inputs: ['columns', 'emptyLabel', 'ffCaption', 'rows', 'selectedIds', 'selectionMode', 'sortDirection', 'sortKey', 'sortable']
})
@Component({
  selector: 'ff-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['columns', 'emptyLabel', 'ffCaption', 'rows', 'selectedIds', 'selectionMode', 'sortDirection', 'sortKey', 'sortable'],
  standalone: true
})
export class FfDataTable {
  protected el: HTMLFfDataTableElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ffSortChange', 'ffSelectionChange']);
  }
}


export declare interface FfDataTable extends Components.FfDataTable {

  ffSortChange: EventEmitter<CustomEvent<{ sortKey: string; sortDirection: 'asc' | 'desc' }>>;

  ffSelectionChange: EventEmitter<CustomEvent<{ selectedIds: (string | number)[] }>>;
}


@ProxyCmp({
  defineCustomElementFn: defineFfDropdown,
  inputs: ['disabled', 'ffAriaLabel', 'open', 'options', 'placeholder', 'value'],
  methods: ['openDropdown', 'closeDropdown']
})
@Component({
  selector: 'ff-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'ffAriaLabel', 'open', 'options', 'placeholder', 'value'],
  standalone: true
})
export class FfDropdown {
  protected el: HTMLFfDropdownElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ffChange', 'ffOpenChange']);
  }
}


export declare interface FfDropdown extends Components.FfDropdown {
  /**
   * Emitted when the selection changes.

Note: the inner `option` shape is inlined rather than referencing FfDropdownOption,
because the @stencil /angular-output-target type emitter cannot resolve external
type aliases inside generic EventEmitter arguments. Keeping the shape inline
preserves a clean Angular directive surface without `any` leaks.
   */
  ffChange: EventEmitter<CustomEvent<{ value: string; option: { value: string; label: string; disabled?: boolean }; }>>;
  /**
   * Emitted whenever the dropdown opens or closes.
   */
  ffOpenChange: EventEmitter<CustomEvent<{ open: boolean }>>;
}


@ProxyCmp({
  defineCustomElementFn: defineFfModal,
  inputs: ['ariaDescribedbyId', 'closeOnBackdrop', 'closeOnEscape', 'ffTitle', 'lockScroll', 'open'],
  methods: ['show', 'close']
})
@Component({
  selector: 'ff-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['ariaDescribedbyId', 'closeOnBackdrop', 'closeOnEscape', 'ffTitle', 'lockScroll', 'open'],
  standalone: true
})
export class FfModal {
  protected el: HTMLFfModalElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ffClose']);
  }
}


export declare interface FfModal extends Components.FfModal {
  /**
   * Emitted before the modal closes. Consumers may call preventDefault on the
underlying event to cancel closing (e.g. unsaved changes guard).
   */
  ffClose: EventEmitter<CustomEvent<void>>;
}


