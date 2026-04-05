import type { Components, JSX } from "../dist/types/components";

interface FfDataTable extends Components.FfDataTable, HTMLElement {}
export const FfDataTable: {
    prototype: FfDataTable;
    new (): FfDataTable;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
