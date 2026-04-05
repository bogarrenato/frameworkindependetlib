# ff-modal



<!-- Auto Generated Below -->


## Overview

ff-modal — framework-agnostic modal dialog primitive.

## Architectural role
Owns dialog semantics, focus trap, escape handling, and scroll lock. Visual chrome
(surface color, radius, backdrop, shadow, typography) comes from the token contract
and brand pack via CSS custom properties. No brand values in this file.

## SSR / SSG readiness contract
 1. `open` is a prop, default `false`. Server and client render the same DOM on first
    paint — the modal is present but hidden via `aria-hidden="true"` + display:none,
    eliminating hydration mismatches even when the modal state is computed from a
    URL parameter or cookie.
 2. Focus management, scroll lock, and keydown listeners are only attached inside
    componentDidLoad (client-only). No `document.body.style.overflow` touch on server.
 3. The modal uses a div with role="dialog" rather than the native <dialog> element,
    because <dialog> has inconsistent SSR behavior across browsers when rendered via
    Declarative Shadow DOM.
 4. Portalization is NOT done here. The element renders in its natural DOM position.
    Host apps that need a portal can wrap the component themselves — this keeps the
    SSR output deterministic and avoids teleport-induced hydration warnings.

## Token contract inputs
 --ff-modal-backdrop, --ff-modal-surface, --ff-modal-radius,
 --ff-modal-shadow, --ff-modal-title-color, --ff-modal-body-color,
 --ff-color-text-primary, --ff-font-family-brand

## Properties

| Property            | Attribute             | Description                                                      | Type                  | Default     |
| ------------------- | --------------------- | ---------------------------------------------------------------- | --------------------- | ----------- |
| `ariaDescribedbyId` | `aria-describedby-id` | Accessible description id reference for aria-describedby.        | `string \| undefined` | `undefined` |
| `closeOnBackdrop`   | `close-on-backdrop`   | When false, clicking the backdrop will NOT close the modal.      | `boolean`             | `true`      |
| `closeOnEscape`     | `close-on-escape`     | When false, pressing Escape will NOT close the modal.            | `boolean`             | `true`      |
| `ffTitle`           | `ff-title`            | Title displayed in the modal header. Falls back to slot="title". | `string \| undefined` | `undefined` |
| `lockScroll`        | `lock-scroll`         | Prevents body scroll while the modal is open. Defaults to true.  | `boolean`             | `true`      |
| `open`              | `open`                | Controlled open state. Parent app drives open/close.             | `boolean`             | `false`     |


## Events

| Event     | Description                                                                                                                                | Type                |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| `ffClose` | Emitted before the modal closes. Consumers may call preventDefault on the underlying event to cancel closing (e.g. unsaved changes guard). | `CustomEvent<void>` |


## Methods

### `close() => Promise<void>`

Imperative API — close the modal from code.

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Imperative API — open the modal from code.

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part         | Description |
| ------------ | ----------- |
| `"backdrop"` |             |
| `"body"`     |             |
| `"close"`    |             |
| `"footer"`   |             |
| `"header"`   |             |
| `"surface"`  |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
