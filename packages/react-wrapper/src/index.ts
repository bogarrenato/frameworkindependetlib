/**
 * React bridge layer for the shared Stencil web components.
 *
 * This file is the public entry point of @fuggetlenfe/react-wrapper.
 * It re-exports auto-generated React component wrappers from ./generated/components.
 *
 * The generated wrappers (created by @stencil/react-output-target) use createComponent()
 * to map web component properties and events to React props. They also call
 * defineCustomElement() to register the underlying custom element.
 *
 * ## What this package provides
 * - FfButton: React component that renders the <ff-button> web component
 *
 * ## What this package does NOT provide
 * - No styling, brand, or theme logic
 * - No CSS imports (consumers must import contract.css + a brand pack themselves)
 * - No business logic
 *
 * The visual identity comes from external CSS packages:
 *   @fuggetlenfe/tokens/contract.css     → stable token API
 *   @fuggetlenfe/brand-styles/*.css      → brand+theme overrides
 */
export * from './generated/components';
