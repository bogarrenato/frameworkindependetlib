import type { Components, JSX } from "../dist/types/components";

interface FfDropdown extends Components.FfDropdown, HTMLElement {}
export const FfDropdown: {
    prototype: FfDropdown;
    new (): FfDropdown;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
