# ff-dropdown



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute       | Description                                                                      | Type                           | Default     |
| ------------- | --------------- | -------------------------------------------------------------------------------- | ------------------------------ | ----------- |
| `disabled`    | `disabled`      | Disables the entire dropdown.                                                    | `boolean`                      | `false`     |
| `ffAriaLabel` | `ff-aria-label` | Accessible name for the dropdown trigger.                                        | `string \| undefined`          | `undefined` |
| `open`        | `open`          | Controlled open state. Consumers can drive open/close from outside.              | `boolean`                      | `false`     |
| `options`     | `options`       | Array of options. Accept both attribute (JSON string) and property (live array). | `FfDropdownOption[] \| string` | `[]`        |
| `placeholder` | `placeholder`   | Visible placeholder when nothing is selected.                                    | `string`                       | `'Select…'` |
| `value`       | `value`         | Selected value (controlled). Omit or pass `undefined` for uncontrolled mode.     | `string \| undefined`          | `undefined` |


## Events

| Event          | Description                                                                                                                          | Type                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `ffChange`     | Emitted when the selection changes.  Note: the inner `option` shape is inlined rather than referencing FfDropdownOption, because the | `CustomEvent<{ value: string; option: { value: string; label: string; disabled?: boolean \| undefined; }; }>` |
| `ffOpenChange` | Emitted whenever the dropdown opens or closes.                                                                                       | `CustomEvent<{ open: boolean; }>`                                                                             |


## Methods

### `closeDropdown() => Promise<void>`

Imperative API — programmatically close the dropdown. SSR-safe no-op on server.

#### Returns

Type: `Promise<void>`



### `openDropdown() => Promise<void>`

Imperative API — programmatically open the dropdown. SSR-safe no-op on server.

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"listbox"` |             |
| `"option"`  |             |
| `"trigger"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
