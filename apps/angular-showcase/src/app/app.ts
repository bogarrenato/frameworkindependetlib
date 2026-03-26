import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { tokens } from '@fuggetlenfe/tokens';
import { FfButton } from '../stencil-generated/components';

const themeOptions = ['light', 'dark'] as const;
const registryBrandKey = 'registry-owned';
const brandOptions = ['brand-1', 'brand-2', 'brand-3', 'client-acme', registryBrandKey] as const;
const paletteOrder = ['brand-1', 'brand-2', 'brand-3', 'success', 'warning', 'error', 'info', 'neutral'] as const;
const buttonStates = ['default', 'hover', 'active', 'disabled'] as const;
const ownedPresetOptions = ['registry-default', 'editorial', 'brutalist'] as const;
const externalBrandPalette = {
  '10': '#FFF4E8',
  '20': '#FFE4C2',
  '30': '#FFD09A',
  '40': '#FFB56B',
  '50': '#FF8B3D',
  '60': '#E06F25',
  '70': '#B85714',
  '80': '#8F410A',
  '90': '#6E3207',
  '100': '#4A2000'
} as const;
const registryOwnedPalette = {
  '10': '#FFF4FB',
  '20': '#FFD7EA',
  '30': '#FFB4D8',
  '40': '#FF8BC3',
  '50': '#FF5BAA',
  '60': '#E3388A',
  '70': '#B91F6C',
  '80': '#8F1050',
  '90': '#660739',
  '100': '#3C001F'
} as const;

type ThemeName = (typeof themeOptions)[number];
type BrandName = (typeof brandOptions)[number];
type PaletteName = (typeof paletteOrder)[number];
type ButtonState = (typeof buttonStates)[number];
type OwnedPresetName = (typeof ownedPresetOptions)[number];

type DemoBrand = {
  label: string;
  fontFamily: string;
  palette: Record<string, string>;
  sourceLabel: string;
  accent: string;
  accentSoft: string;
  accentDeep: string;
};

type LaunchEvent = {
  brand: BrandName;
  label: string;
  theme: ThemeName;
  launchedAt: string;
};

type OwnedBrandRecipe = {
  fontFamily: string;
  radius: number;
  paddingInline: number;
  paddingBlock: number;
  bgDefault: string;
  fgDefault: string;
  bgHover: string;
  fgHover: string;
  bgActive: string;
  fgActive: string;
};

const brandCatalog = {
  'brand-1': {
    ...tokens.brands['brand-1'],
    palette: tokens.palettes['brand-1'],
    sourceLabel: 'Figma preset',
    accent: tokens.palettes['brand-1']['50'],
    accentSoft: tokens.palettes['brand-1']['10'],
    accentDeep: tokens.palettes['brand-1']['100']
  },
  'brand-2': {
    ...tokens.brands['brand-2'],
    palette: tokens.palettes['brand-2'],
    sourceLabel: 'Figma preset',
    accent: tokens.palettes['brand-2']['50'],
    accentSoft: tokens.palettes['brand-2']['10'],
    accentDeep: tokens.palettes['brand-2']['100']
  },
  'brand-3': {
    ...tokens.brands['brand-3'],
    palette: tokens.palettes['brand-3'],
    sourceLabel: 'Figma preset',
    accent: tokens.palettes['brand-3']['50'],
    accentSoft: tokens.palettes['brand-3']['10'],
    accentDeep: tokens.palettes['brand-3']['100']
  },
  'client-acme': {
    label: 'Client Acme',
    fontFamily: '"Space Grotesk", Inter, Arial, sans-serif',
    palette: externalBrandPalette,
    sourceLabel: 'External CSS override',
    accent: externalBrandPalette['50'],
    accentSoft: externalBrandPalette['10'],
    accentDeep: externalBrandPalette['100']
  },
  'registry-owned': {
    label: 'Registry Owned',
    fontFamily: '"Sora", Inter, Arial, sans-serif',
    palette: registryOwnedPalette,
    sourceLabel: 'Registry installed override',
    accent: registryOwnedPalette['50'],
    accentSoft: registryOwnedPalette['10'],
    accentDeep: registryOwnedPalette['100']
  }
} satisfies Record<BrandName, DemoBrand>;

const ownedBrandPresets = {
  'registry-default': {
    fontFamily: '"Sora", Inter, Arial, sans-serif',
    radius: 22,
    paddingInline: 22,
    paddingBlock: 10,
    bgDefault: '#FF5BAA',
    fgDefault: '#FFF4FB',
    bgHover: '#E3388A',
    fgHover: '#FFF4FB',
    bgActive: '#FFD7EA',
    fgActive: '#660739'
  },
  editorial: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    radius: 6,
    paddingInline: 20,
    paddingBlock: 8,
    bgDefault: '#100B53',
    fgDefault: '#F6F2FF',
    bgHover: '#5147DB',
    fgHover: '#F6F2FF',
    bgActive: '#CECBFF',
    fgActive: '#100B53'
  },
  brutalist: {
    fontFamily: '"Courier New", monospace',
    radius: 0,
    paddingInline: 16,
    paddingBlock: 12,
    bgDefault: '#0E610E',
    fgDefault: '#F3FFF3',
    bgHover: '#4DC74D',
    fgHover: '#F3FFF3',
    bgActive: '#DAFFDA',
    fgActive: '#0E610E'
  }
} satisfies Record<OwnedPresetName, OwnedBrandRecipe>;

const fontChoices = [
  { value: '"Sora", Inter, Arial, sans-serif', label: 'Sora' },
  { value: 'Georgia, "Times New Roman", serif', label: 'Editorial serif' },
  { value: '"Courier New", monospace', label: 'Mono utility' }
] as const;

@Component({
  selector: 'app-root',
  imports: [CommonModule, FfButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly tokens = tokens;
  protected readonly brandCatalog = brandCatalog;
  protected readonly themeOptions = themeOptions;
  protected readonly brandOptions = brandOptions;
  protected readonly paletteOrder = paletteOrder;
  protected readonly buttonStates = buttonStates;
  protected readonly ownedPresetOptions = ownedPresetOptions;
  protected readonly fontChoices = fontChoices;

  protected readonly theme = signal<ThemeName>('light');
  protected readonly brand = signal<BrandName>('brand-1');
  protected readonly launches = signal<LaunchEvent[]>([]);
  protected readonly ownedPreset = signal<OwnedPresetName | 'custom'>('registry-default');
  protected readonly ownedBrandRecipe = signal<OwnedBrandRecipe>(this.cloneOwnedRecipe('registry-default'));

  protected readonly activeBrand = computed(() => this.brandCatalog[this.brand()]);
  protected readonly latestLaunch = computed(() => this.launches()[0] ?? null);
  protected readonly activeBrandEntries = computed(() =>
    Object.entries(this.activeBrand().palette).sort((left, right) => Number(right[0]) - Number(left[0]))
  );
  protected readonly ownedBrandStyle = computed<Record<string, string>>(() => {
    const recipe = this.ownedBrandRecipe();

    return {
      '--ff-font-family-brand': recipe.fontFamily,
      '--ff-button-radius': `${recipe.radius}px`,
      '--ff-button-padding-inline': `${recipe.paddingInline}px`,
      '--ff-button-padding-block': `${recipe.paddingBlock}px`,
      '--ff-button-bg-default': recipe.bgDefault,
      '--ff-button-fg-default': recipe.fgDefault,
      '--ff-button-bg-hover': recipe.bgHover,
      '--ff-button-fg-hover': recipe.fgHover,
      '--ff-button-bg-active': recipe.bgActive,
      '--ff-button-fg-active': recipe.fgActive
    };
  });
  protected readonly ownedBrandSnippet = computed(() => {
    const recipe = this.ownedBrandRecipe();
    const theme = this.theme();

    return `[data-brand='registry-owned'] {
  --ff-font-family-brand: ${recipe.fontFamily};
  --ff-button-radius: ${recipe.radius}px;
  --ff-button-padding-inline: ${recipe.paddingInline}px;
  --ff-button-padding-block: ${recipe.paddingBlock}px;
}

[data-brand='registry-owned'][data-theme='${theme}'] {
  --ff-button-bg-default: ${recipe.bgDefault};
  --ff-button-fg-default: ${recipe.fgDefault};
  --ff-button-bg-hover: ${recipe.bgHover};
  --ff-button-fg-hover: ${recipe.fgHover};
  --ff-button-bg-active: ${recipe.bgActive};
  --ff-button-fg-active: ${recipe.fgActive};
}`;
  });

  protected setTheme(theme: ThemeName) {
    this.theme.set(theme);
  }

  protected setBrand(brand: BrandName) {
    this.brand.set(brand);
  }

  protected queueLaunch(brand: BrandName) {
    const selectedBrand = this.brandCatalog[brand];
    const nextLaunch: LaunchEvent = {
      brand,
      label: selectedBrand.label,
      theme: this.theme(),
      launchedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    this.launches.update((current) => [nextLaunch, ...current].slice(0, 4));
  }

  protected applyOwnedPreset(name: OwnedPresetName) {
    this.ownedPreset.set(name);
    this.ownedBrandRecipe.set(this.cloneOwnedRecipe(name));
  }

  protected updateOwnedFont(value: string) {
    this.ownedPreset.set('custom');
    this.ownedBrandRecipe.update((current) => ({
      ...current,
      fontFamily: value
    }));
  }

  protected updateOwnedNumber(
    key: 'radius' | 'paddingInline' | 'paddingBlock',
    value: string
  ) {
    this.ownedPreset.set('custom');
    this.ownedBrandRecipe.update((current) => ({
      ...current,
      [key]: Number(value)
    }));
  }

  protected updateOwnedColor(
    key: 'bgDefault' | 'fgDefault' | 'bgHover',
    value: string
  ) {
    this.ownedPreset.set('custom');
    this.ownedBrandRecipe.update((current) => ({
      ...current,
      [key]: value
    }));
  }

  protected titleFromKey(key: string) {
    return key.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  protected paletteEntries(name: PaletteName) {
    return Object.entries(this.tokens.palettes[name]).sort((left, right) => Number(right[0]) - Number(left[0]));
  }

  protected stateLabel(state: ButtonState) {
    return {
      default: 'Default',
      hover: 'Hover',
      active: 'Active',
      disabled: 'Disabled'
    }[state];
  }

  private cloneOwnedRecipe(name: OwnedPresetName): OwnedBrandRecipe {
    return { ...ownedBrandPresets[name] };
  }
}
