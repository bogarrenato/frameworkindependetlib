# ff-button



<!-- Auto Generated Below -->


## Overview

ff-button — framework-agnostic button primitive.

## Architectural role
Owns semantic behavior and a stable DOM contract. Visual identity is supplied from
outside via CSS custom properties (token contract + brand pack). This file never
references colors, fonts, or spacing values directly.

## SSR / SSG readiness contract
This component is written to be safe inside any server rendering context
(Next.js RSC, Angular Universal, Nuxt, Vite prerender, Stencil hydrate).

 1. The render() method is a pure function of props — no DOM access, no browser globals.
 2. connectedCallback has NO side effects. Any API that requires a real DOM
    (focus, click dispatch, observers) is only touched inside componentDidLoad,
    which Stencil deliberately does not invoke in the hydrate module.
 3. Public imperative methods (`setFocus`, `click`) are server-safe: they short-circuit
    when the host element is not attached to a real document.
 4. Shadow DOM output is serialized by the Stencil hydrate module as
    Declarative Shadow DOM (`<template shadowrootmode="open">`), so the first paint
    is correct even before client-side JS finishes downloading.
 5. State that differs between server and client (media queries, stored preferences)
    is NEVER read inside this file. The consumer passes brand/theme through the shell
    element's `data-brand` / `data-theme` attributes, which the CSS cascade picks up.

## Where the visual identity comes from (NOT here)
 - ff-button.css reads --ff-button-* CSS custom properties (bg, fg, radius, padding).
 - Those variables are defined in packages/tokens/src/contract.css (stable API).
 - Concrete brand values come from packages/brand-styles/src/*.css.
 - The consumer app shell sets data-brand + data-theme on any ancestor → the token
   cascade applies the correct overrides via attribute selectors in the brand pack.

## Properties

| Property      | Attribute       | Description                                                                    | Type                                              | Default     |
| ------------- | --------------- | ------------------------------------------------------------------------------ | ------------------------------------------------- | ----------- |
| `disabled`    | `disabled`      | Disables pointer and keyboard interaction on the native button element.        | `boolean`                                         | `false`     |
| `ffAriaLabel` | `ff-aria-label` | Optional aria-label for accessible name when the button only contains an icon. | `string \| undefined`                             | `undefined` |
| `fullWidth`   | `full-width`    | Expands the host to full width without coupling layout rules to a brand theme. | `boolean`                                         | `false`     |
| `label`       | `label`         | Provides a simple fallback label when no slotted content is passed.            | `string \| undefined`                             | `undefined` |
| `type`        | `type`          | Mirrors the native button type attribute so forms keep expected behavior.      | `"button" \| "reset" \| "submit"`                 | `'button'`  |
| `variant`     | `variant`       | Semantic variant for analytics and optional brand-pack styling hooks.          | `"danger" \| "ghost" \| "primary" \| "secondary"` | `'primary'` |


## Events

| Event     | Description                                                                                                                                                                                                     | Type                      |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `ffClick` | Fired on click. Exposed as a dedicated event so consumers in every framework (React, Angular, Vue, plain HTML) can subscribe through the generated wrapper without worrying about DOM event bubbling semantics. | `CustomEvent<MouseEvent>` |


## Methods

### `setFocus() => Promise<void>`

Imperatively move keyboard focus to the underlying native button.
SSR-safe: the hydrate module never invokes this method because it only runs
browser-triggered code paths. Still, we guard for `typeof document` to make
consumer code defensively safe when called from isomorphic effects.

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"button"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
