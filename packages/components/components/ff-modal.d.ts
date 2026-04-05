import type { Components, JSX } from "../dist/types/components";

interface FfModal extends Components.FfModal, HTMLElement {}
export const FfModal: {
    prototype: FfModal;
    new (): FfModal;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
