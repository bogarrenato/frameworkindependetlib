/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@fuggetlenfe/components/components';

import { defineCustomElement as defineFfButton } from '@fuggetlenfe/components/components/ff-button.js';
@ProxyCmp({
  defineCustomElementFn: defineFfButton,
  inputs: ['brand', 'disabled', 'fullWidth', 'label', 'previewState', 'theme', 'type']
})
@Component({
  selector: 'ff-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['brand', 'disabled', 'fullWidth', 'label', 'previewState', 'theme', 'type'],
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


