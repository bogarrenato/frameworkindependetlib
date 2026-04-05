# ff-data-table



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                                   | Type                               | Default                 |
| --------------- | ---------------- | ----------------------------------------------------------------------------- | ---------------------------------- | ----------------------- |
| `columns`       | `columns`        | Column definitions. Accept both JSON string (attribute) and array (property). | `FfDataTableColumn[] \| string`    | `[]`                    |
| `emptyLabel`    | `empty-label`    | Message displayed when the rows array is empty.                               | `string`                           | `'No data to display.'` |
| `ffCaption`     | `ff-caption`     | Accessible caption for screen readers.                                        | `string \| undefined`              | `undefined`             |
| `rows`          | `rows`           | Row data. Accept both JSON string (attribute) and array (property).           | `FfDataTableRow[] \| string`       | `[]`                    |
| `selectedIds`   | `selected-ids`   | Array of selected row ids (controlled).                                       | `(string \| number)[] \| string`   | `[]`                    |
| `selectionMode` | `selection-mode` | Selection mode. 'none' disables selection entirely.                           | `"multiple" \| "none" \| "single"` | `'none'`                |
| `sortDirection` | `sort-direction` | Current sort direction (controlled).                                          | `"asc" \| "desc"`                  | `'asc'`                 |
| `sortKey`       | `sort-key`       | Currently sorted column key (controlled).                                     | `string \| undefined`              | `undefined`             |
| `sortable`      | `sortable`       | When true, header clicks toggle sort direction for sortable columns.          | `boolean`                          | `true`                  |


## Events

| Event               | Description | Type                                                                |
| ------------------- | ----------- | ------------------------------------------------------------------- |
| `ffSelectionChange` |             | `CustomEvent<{ selectedIds: (string \| number)[]; }>`               |
| `ffSortChange`      |             | `CustomEvent<{ sortKey: string; sortDirection: "asc" \| "desc"; }>` |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"body"`   |             |
| `"header"` |             |
| `"table"`  |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
