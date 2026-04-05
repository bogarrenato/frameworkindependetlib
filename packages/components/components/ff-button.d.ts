import type { Components, JSX } from "../dist/types/components";

interface FfButton extends Components.FfButton, HTMLElement {}
export const FfButton: {
    prototype: FfButton;
    new (): FfButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
