# Maintenance Guide

## 1. Platform cel

A platform celja, hogy:

- a komponenslogika egyszer legyen megirva
- a framework integracio kulon retegben maradjon
- a styling kulon librarybol jojjon
- a consuming app shell kapja a theme es brand ownershipet

## 2. Retteg felelossegek

### Components

- csak logika
- stabil public DOM contract
- stabil prop, slot, `::part` contract

### Wrappers

- csak framework bridge
- nincs sajat styling vagy business logika

### Tokens

- public contract
- Figma Variables sync source
- explicit nev-alapu bindingok
- fail-fast validacio

### Brand styles

- official design packek
- kulso arculati overrideok

### Consumer apps

- shell-level `data-brand`
- shell-level `data-theme`
- alkalmazas specifikus layout es use-case

## 3. Public vs internal

### Public

- `packages/tokens/src/contract.css`
- Stencil propok, slotok, `::part`
- wrapper exportok
- dokumentalt host classok

### Internal

- wrapper generated fileok implementacios reszletei
- storybook-only markup es demo status panelek
- app-level osztalynevek

## 4. Milyen valtozas hova menjen

### Ha viselkedes valtozik

- `packages/components`

### Ha React vagy Angular integracio torik

- megfelelo wrapper package

### Ha vizualis rendszer valtozik

- `packages/tokens`
- `packages/brand-styles`
- eloszor a Figma Variables contractot kell ellenorizni, nem a generalt CSS-t kezzel javitani

### Ha csak egy app sajat layoutja valtozik

- adott consuming app

## 5. Szabalyok, amiket szigoruan meg kell huzni

1. A core componentbe ne keruljon brand vagy theme prop.
2. A wrapper librarybe ne keruljon business logika.
3. A consumer app ne targetaljon belso shadow DOM implementacios reszleteket.
4. A public token contract atnevezese mindig governance-koteles valtozas.
5. A copy-ownership registry csak kiveteles escape hatch legyen.
6. A sync ne olvasson node ID-ket vagy preview frame sorrendet, csak named variable bindingokat.
7. A consuming app official brand eseten package-et fogyasszon, ne lokalisan forkolt brand packet.

## 6. Release szabaly

### Patch

- belso refaktor
- tesztjavitas
- nem lathato doc frissites

### Minor

- uj komponens
- uj dokumentalt token
- uj official brand pack

### Major

- public token atnevezes
- komponens prop torles vagy jelentesvaltas
- wrapper export torles
- `::part` contract torese

## 7. Minimum tesztmatrix

- Stencil unit teszt
- React consumer integracios teszt
- Angular consumer integracios teszt
- Storybook build
- workspace build

## 8. Microfrontend kompatibilitasi szabaly

- auth, shell tema es brand kontextus a host alkalmazasban eljen
- remote app ne sajat design systemet kezdjen epitani
- a remote app a kozponti token contractot es wrapper libraryt fogyassza

## 9. Keycloak es biometry helye

Ez nem a component library dolga.

- Keycloak es session kezeles a shell vagy shared auth layer felelossege
- WebAuthn / biometry flow szinten auth infrastruktura felelosseg
- a komponens library csak UI surface-et adhat hozza

## 10. Pull request checklist

- a valtozas a megfelelo retegben tortent
- public contract nem serult veletlenul
- tesztek lefutottak
- a Storybook tovabbra is epul
- a docs frissultek, ha public API valtozott
- a Figma tokenhez szukseges scope-ok dokumentalva vannak, ha a sync valtozott
