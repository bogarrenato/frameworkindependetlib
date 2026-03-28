# ff-dropdown



<!-- Auto Generated Below -->


## Overview

Accessible dropdown primitive that keeps all interaction logic inside Stencil.

The component owns keyboard navigation, selection state, focus handling, and the
public accessibility contract. Visual identity still comes exclusively from the
external token contract and the active brand pack.

## Properties

| Property      | Attribute     | Description                                                                      | Type                  | Default              |
| ------------- | ------------- | -------------------------------------------------------------------------------- | --------------------- | -------------------- |
| `disabled`    | `disabled`    | Disables opening, keyboard navigation, and option selection.                     | `boolean`             | `false`              |
| `fullWidth`   | `full-width`  | Expands the host to the width of its container.                                  | `boolean`             | `false`              |
| `label`       | `label`       | Visible field label and accessible name for the dropdown trigger.                | `string`              | `'Select an option'` |
| `options`     | --            | Complete option list rendered by the dropdown panel.                             | `FfDropdownOption[]`  | `[]`                 |
| `placeholder` | `placeholder` | Placeholder text shown when no option is currently selected.                     | `string`              | `'Choose an option'` |
| `value`       | `value`       | Currently selected option value. Can be controlled from the consuming app shell. | `string \| undefined` | `undefined`          |


## Events

| Event           | Description                                      | Type                                       |
| --------------- | ------------------------------------------------ | ------------------------------------------ |
| `ffOpenChange`  | Emitted when the dropdown panel opens or closes. | `CustomEvent<FfDropdownOpenChangeDetail>`  |
| `ffValueChange` | Emitted when the selected value changes.         | `CustomEvent<FfDropdownValueChangeDetail>` |


## Shadow Parts

| Part                   | Description |
| ---------------------- | ----------- |
| `"empty-state"`        |             |
| `"icon"`               |             |
| `"label"`              |             |
| `"option"`             |             |
| `"option-description"` |             |
| `"option-indicator"`   |             |
| `"option-label"`       |             |
| `"panel"`              |             |
| `"trigger"`            |             |
| `"value"`              |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
