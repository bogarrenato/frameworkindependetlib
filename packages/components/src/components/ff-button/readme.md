# ff-button



<!-- Auto Generated Below -->


## Overview

Logic-only button primitive shared across every consumer framework.

The component intentionally owns only semantic behavior and a stable DOM contract.
Visual identity must come from the consuming application's token contract and brand pack.

## Properties

| Property    | Attribute    | Description                                                                    | Type                              | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------ | --------------------------------- | ----------- |
| `disabled`  | `disabled`   | Disables pointer and keyboard interaction on the native button element.        | `boolean`                         | `false`     |
| `fullWidth` | `full-width` | Expands the host to full width without coupling layout rules to a brand theme. | `boolean`                         | `false`     |
| `label`     | `label`      | Provides a simple fallback label when no slotted content is passed.            | `string \| undefined`             | `undefined` |
| `type`      | `type`       | Mirrors the native button type attribute so forms keep expected behavior.      | `"button" \| "reset" \| "submit"` | `'button'`  |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"button"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
