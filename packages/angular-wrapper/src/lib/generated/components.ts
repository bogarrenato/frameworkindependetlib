/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import type { Components } from '@fuggetlenfe/components/components';

import { defineCustomElement as defineFfButton } from '@fuggetlenfe/components/components/ff-button.js';
import { defineCustomElement as defineFfDropdown } from '@fuggetlenfe/components/components/ff-dropdown.js';
@ProxyCmp({
  defineCustomElementFn: defineFfButton,
  inputs: ['disabled', 'fullWidth', 'label', 'type']
})
@Component({
  selector: 'ff-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'fullWidth', 'label', 'type'],
  standalone: true
})
export class FfButton {
  protected el: HTMLFfButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface FfButton extends Components.FfButton {}


@ProxyCmp({
  defineCustomElementFn: defineFfDropdown,
  inputs: ['disabled', 'fullWidth', 'label', 'options', 'placeholder', 'value']
})
@Component({
  selector: 'ff-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'fullWidth', 'label', 'options', 'placeholder', 'value'],
  standalone: true
})
export class FfDropdown {
  protected el: HTMLFfDropdownElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ffValueChange', 'ffOpenChange']);
  }
}


import type { FfDropdownValueChangeDetail as IFfDropdownFfDropdownValueChangeDetail } from '@fuggetlenfe/components/components';
import type { FfDropdownOpenChangeDetail as IFfDropdownFfDropdownOpenChangeDetail } from '@fuggetlenfe/components/components';

export declare interface FfDropdown extends Components.FfDropdown {
  /**
   * Emitted when the selected value changes.
   */
  ffValueChange: EventEmitter<CustomEvent<IFfDropdownFfDropdownValueChangeDetail>>;
  /**
   * Emitted when the dropdown panel opens or closes.
   */
  ffOpenChange: EventEmitter<CustomEvent<IFfDropdownFfDropdownOpenChangeDetail>>;
}


