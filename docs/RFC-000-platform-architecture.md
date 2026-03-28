# RFC-000 Platform Architecture

## Status

Draft

## Context

A platformnak egyszerre kell tamogatnia:

- Angular reuse-t
- React fogyasztast
- frameworkfuggetlen komponenslogikat
- kulso styling libraryt
- multi-brand es light/dark modot
- microfrontend-kompatibilis shell ownershipet

## Decision

A platform negy fo retegbol all:

1. Stencil web component core
2. React es Angular wrapper library
3. token contract es official brand packek
4. consuming app shell, amely a `data-brand` es `data-theme` kontextust adja

## PlantUML - statikus architektura

```plantuml
@startuml
title Frontend Platform Architecture

package "Design Source" {
  [Figma tokens] as Figma
}

package "Design Layer" {
  [Token Contract] as Contract
  [Figma Preset] as Preset
  [Official Brand Packs] as BrandPacks
}

package "Core Component Layer" {
  [Stencil Components] as StencilCore
}

package "Framework Adapters" {
  [React Wrapper] as ReactWrapper
  [Angular Wrapper] as AngularWrapper
}

package "Consumer Layer" {
  [React Brand 2 App] as ReactBrandTwo
  [React Custom Brand App] as ReactCustom
  [Angular Brand 1 App] as AngularBrandOne
  [Angular Custom Brand App] as AngularCustom
}

Figma --> Contract
Figma --> Preset
Contract --> BrandPacks
Contract --> StencilCore
Preset --> BrandPacks
StencilCore --> ReactWrapper
StencilCore --> AngularWrapper
ReactWrapper --> ReactBrandTwo
ReactWrapper --> ReactCustom
AngularWrapper --> AngularBrandOne
AngularWrapper --> AngularCustom
BrandPacks --> ReactBrandTwo
BrandPacks --> ReactCustom
BrandPacks --> AngularBrandOne
BrandPacks --> AngularCustom

note bottom of StencilCore
Logic only.
No brand or theme ownership.
end note

note bottom of BrandPacks
Visual identity lives here.
end note

note bottom of ReactBrandTwo
App shell sets data-brand and data-theme.
end note
@enduml
```

## PlantUML - runtime ownership

```plantuml
@startuml
title Runtime Ownership Flow

actor User
rectangle "Shell App" as Shell
rectangle "Remote App" as Remote
rectangle "Shared Wrapper" as Wrapper
rectangle "Stencil Component" as Component
rectangle "Brand CSS Pack" as BrandCss
rectangle "Keycloak / Auth Layer" as Auth

User --> Shell
Shell --> Auth
Shell --> Remote
Shell --> BrandCss : sets data-brand/data-theme
Remote --> Wrapper
Wrapper --> Component
BrandCss --> Component

note right of Auth
Authentication, session,
WebAuthn and passkey flow
belong outside the component library.
end note
@enduml
```

## Consequences

### Positive

- egyszer irt komponenslogika
- central styling governance
- Angular es React reuse
- microfrontend-kompatibilis ownership modell

### Negative

- tobb csomag es release koordinacio
- eros public contract discipline kell
- wrapper drift veszely, ha nem maradnak vekonyak

## Rules

1. A komponensek ne kapjanak brand vagy theme propot.
2. A wrapper libraryk ne tartsanak sajat stylingot.
3. A shell ownership a consuming appban maradjon.
4. Copy ownership registry csak kiveteles escape hatch legyen.

## Rollout

1. `ff-button` mint referencia primitive fenntartasa
2. public token contract stabilizalasa
3. wrapper boundary tovabbi vedelme
4. tovabbi primitivek epítese ugyanezen a mintan
