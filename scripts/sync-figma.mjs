import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FIGMA_FILE_KEY = 'scEvsCrwxBBllYGMaz4vKH';
const FIGMA_TOKEN = process.env.FIGMA_TOKEN ?? process.env.FIGMA_OAUTH_TOKEN;

if (!FIGMA_TOKEN) {
  console.error('Missing FIGMA_TOKEN or FIGMA_OAUTH_TOKEN environment variable.');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const tokensDir = path.join(repoRoot, 'packages', 'tokens', 'src');

const paletteNodeGroups = {
  'brand-1': ['6:40', '6:41', '6:42', '6:43', '6:44', '6:45', '6:46', '6:47', '6:48', '6:49'],
  'brand-2': ['6:51', '6:52', '6:53', '6:54', '6:55', '6:56', '6:57', '6:58', '6:59', '6:60'],
  'brand-3': ['6:73', '6:74', '6:75', '6:76', '6:77', '6:78', '6:79', '6:80', '6:81', '6:82'],
  info: ['6:84', '6:85', '6:86', '6:87', '6:88', '6:89', '6:90', '6:91', '6:92', '6:93'],
  warning: ['6:95', '6:96', '6:97', '6:98', '6:99', '6:100', '6:101', '6:102', '6:103', '6:104'],
  error: ['6:106', '6:107', '6:108', '6:109', '6:110', '6:111', '6:112', '6:113', '6:114', '6:115'],
  success: ['14:892', '14:893', '14:894', '14:895', '14:896', '14:897', '14:898', '14:899', '14:900', '14:901'],
  neutral: ['6:145', '6:146', '6:147', '6:148', '6:149', '6:150', '6:151', '6:152', '6:153', '6:154']
};

const buttonSetNodes = ['15:339', '17:189', '17:190'];
const paletteIds = Object.values(paletteNodeGroups).flat();

const nodeIds = [...new Set([...paletteIds, ...buttonSetNodes])];
const fetchedNodes = await fetchNodes(nodeIds);

const palettes = Object.fromEntries(
  Object.entries(paletteNodeGroups).map(([name, ids]) => [
    name,
    Object.fromEntries(
      ids.map((id, index) => {
        const step = String(100 - index * 10);
        return [step, colorFromNode(fetchedNodes[id])];
      })
    )
  ])
);

const buttonTokens = extractButtonTokens(fetchedNodes['15:339'], fetchedNodes);

const tokens = {
  meta: {
    source: {
      figmaFileKey: FIGMA_FILE_KEY,
      syncedAt: new Date().toISOString()
    },
    notes: [
      'This sync is derived from the provided Figma file.',
      'The file currently exposes palettes and a multi-brand button component family.'
    ]
  },
  palettes,
  themes: {
    light: {
      canvas: colorFromNode(fetchedNodes['17:189']),
      surface: palettes.neutral['10'],
      textPrimary: palettes.neutral['100'],
      textSecondary: palettes.neutral['70'],
      textMuted: palettes.neutral['50'],
      borderSubtle: '#D9D9D9'
    },
    dark: {
      canvas: colorFromNode(fetchedNodes['17:190']),
      surface: palettes.neutral['100'],
      textPrimary: palettes.neutral['10'],
      textSecondary: palettes.neutral['30'],
      textMuted: palettes.neutral['60'],
      borderSubtle: palettes.neutral['80']
    }
  },
  brands: {
    'brand-1': {
      label: 'Brand 1',
      fontFamily: 'Arial, sans-serif',
      radius: '0px',
      paddingInline: '8px',
      paddingBlock: '0px'
    },
    'brand-2': {
      label: 'Brand 2',
      fontFamily: '"Inter", Arial, sans-serif',
      radius: '4px',
      paddingInline: '8px',
      paddingBlock: '0px'
    },
    'brand-3': {
      label: 'Brand 3',
      fontFamily: '"Open Sans", Arial, sans-serif',
      radius: '999px',
      paddingInline: '16px',
      paddingBlock: '4px'
    }
  },
  components: {
    button: buttonTokens
  }
};

await mkdir(tokensDir, { recursive: true });
await writeFile(path.join(tokensDir, 'tokens.json'), `${JSON.stringify(tokens, null, 2)}\n`);
await writeFile(path.join(tokensDir, 'contract.css'), buildContractCss(tokens));
await writeFile(path.join(tokensDir, 'figma-preset.css'), buildFigmaPresetCss(tokens));
await writeFile(path.join(tokensDir, 'theme.css'), buildThemeCss());
await writeFile(path.join(tokensDir, 'index.js'), buildIndexJs());
await writeFile(path.join(tokensDir, 'index.d.ts'), buildIndexTypes());

console.log(`Synced Figma tokens to ${tokensDir}`);

async function fetchNodes(nodeIds) {
  const params = new URLSearchParams({ ids: nodeIds.join(',') });
  const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?${params}`, {
    headers: {
      'X-Figma-Token': FIGMA_TOKEN
    }
  });

  if (!response.ok) {
    throw new Error(`Figma node fetch failed with ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  return Object.fromEntries(Object.entries(payload.nodes).map(([nodeId, nodeEntry]) => [nodeId, nodeEntry.document]));
}

function colorFromNode(node) {
  const solidFill = node?.fills?.find((fillDefinition) => fillDefinition.type === 'SOLID' && fillDefinition.visible !== false);
  if (!solidFill) {
    return '#000000';
  }

  const { r: red, g: green, b: blue, a: alpha = 1 } = solidFill.color;
  if (alpha !== 1) {
    return `rgba(${to255(red)}, ${to255(green)}, ${to255(blue)}, ${Number(alpha.toFixed(2))})`;
  }

  return `#${[red, green, blue]
    .map((channelValue) => to255(channelValue).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

function to255(channelValue) {
  return Math.round(channelValue * 255);
}

function extractButtonTokens(componentSetNode, allNodes) {
  const brandNameMap = {
    'Brand=1': 'brand-1',
    'Brand=2': 'brand-2',
    'Brand=3': 'brand-3'
  };
  const states = ['Default', 'Hover', 'Active', 'Disabled'];

  const mapping = {};

  for (const brandKey of Object.values(brandNameMap)) {
    mapping[brandKey] = { light: {}, dark: {} };
  }

  const componentChildren = componentSetNode.children ?? [];
  for (const component of componentChildren) {
    const brandName = Object.entries(brandNameMap).find(([pattern]) => component.name.includes(pattern))?.[1];
    const stateName = states.find((state) => component.name.includes(`State=${state}`));
    if (!brandName || !stateName) continue;

    const instance = component.children?.[0];
    const label = instance?.children?.[0];
    mapping[brandName].light[stateName.toLowerCase()] = {
      background: colorFromNode(instance),
      foreground: colorFromNode(label)
    };
  }

  const themeFrames = {
    light: '17:189',
    dark: '17:190'
  };

  for (const [theme, nodeId] of Object.entries(themeFrames)) {
    const frame = allNodes[nodeId];
    const children = frame.children ?? [];
    const ordered = ['brand-1', 'brand-1', 'brand-1', 'brand-1', 'brand-2', 'brand-2', 'brand-2', 'brand-2', 'brand-3', 'brand-3', 'brand-3', 'brand-3'];
    const statesForOrder = ['default', 'hover', 'active', 'disabled'];

    children.forEach((child, index) => {
      const brandName = ordered[index];
      const stateName = statesForOrder[index % statesForOrder.length];
      const buttonNode = child.children?.[0];
      const labelNode = buttonNode?.children?.[0];
      mapping[brandName][theme][stateName] = {
        background: colorFromNode(buttonNode),
        foreground: colorFromNode(labelNode)
      };
    });
  }

  return mapping;
}

function buildContractCss(tokens) {
  return `:root {
  --ff-font-family-brand: Arial, sans-serif;
  --ff-button-radius: 0px;
  --ff-button-padding-inline: 8px;
  --ff-button-padding-block: 0px;
  --ff-dropdown-radius: 0px;
  --ff-dropdown-padding-inline: 0.875rem;
  --ff-dropdown-padding-block: 0.75rem;
  --ff-color-canvas: ${tokens.themes.light.canvas};
  --ff-color-surface: ${tokens.themes.light.surface};
  --ff-color-text-primary: ${tokens.themes.light.textPrimary};
  --ff-color-text-secondary: ${tokens.themes.light.textSecondary};
  --ff-color-text-muted: ${tokens.themes.light.textMuted};
  --ff-color-border-subtle: ${tokens.themes.light.borderSubtle};
  --ff-button-bg-default: ${tokens.components.button['brand-1'].light.default.background};
  --ff-button-fg-default: ${tokens.components.button['brand-1'].light.default.foreground};
  --ff-button-bg-hover: ${tokens.components.button['brand-1'].light.hover.background};
  --ff-button-fg-hover: ${tokens.components.button['brand-1'].light.hover.foreground};
  --ff-button-bg-active: ${tokens.components.button['brand-1'].light.active.background};
  --ff-button-fg-active: ${tokens.components.button['brand-1'].light.active.foreground};
  --ff-button-bg-disabled: ${tokens.components.button['brand-1'].light.disabled.background};
  --ff-button-fg-disabled: ${tokens.components.button['brand-1'].light.disabled.foreground};
  --ff-dropdown-label-color: ${tokens.themes.light.textPrimary};
  --ff-dropdown-trigger-bg: ${tokens.themes.light.surface};
  --ff-dropdown-trigger-fg: ${tokens.themes.light.textPrimary};
  --ff-dropdown-placeholder-color: ${tokens.themes.light.textPrimary};
  --ff-dropdown-border-color: ${tokens.themes.light.borderSubtle};
  --ff-dropdown-panel-bg: ${tokens.themes.light.surface};
  --ff-dropdown-panel-shadow: 0 18px 42px rgba(17, 17, 17, 0.16);
  --ff-dropdown-option-fg: ${tokens.themes.light.textPrimary};
  --ff-dropdown-option-description-color: ${tokens.themes.light.textSecondary};
  --ff-dropdown-option-bg-hover: color-mix(in srgb, ${tokens.components.button['brand-1'].light.default.background} 12%, ${tokens.themes.light.surface});
  --ff-dropdown-option-fg-hover: ${tokens.themes.light.textPrimary};
  --ff-dropdown-option-bg-selected: ${tokens.components.button['brand-1'].light.default.background};
  --ff-dropdown-option-fg-selected: ${tokens.components.button['brand-1'].light.default.foreground};
  --ff-dropdown-focus-ring: ${tokens.components.button['brand-1'].light.default.background};
}
`;
}

function buildFigmaPresetCss(tokens) {
  const paletteCss = Object.entries(tokens.palettes)
    .map(([group, values]) =>
      Object.entries(values)
        .map(([step, color]) => `  --ff-palette-${group}-${step}: ${color};`)
        .join('\n')
    )
    .join('\n');

  const brandCss = Object.entries(tokens.brands)
    .map(
      ([brand, config]) => `
[data-brand="${brand}"] {
  --ff-font-family-brand: ${config.fontFamily};
  --ff-button-radius: ${config.radius};
  --ff-button-padding-inline: ${config.paddingInline};
  --ff-button-padding-block: ${config.paddingBlock};
  --ff-dropdown-radius: ${config.radius};
  --ff-dropdown-padding-inline: ${brand === 'brand-3' ? '1rem' : '0.85rem'};
  --ff-dropdown-padding-block: ${brand === 'brand-3' ? '0.7rem' : '0.7rem'};
}`.trim()
    )
    .join('\n\n');

  const themeCss = Object.entries(tokens.themes)
    .map(
      ([theme, values]) => `
[data-theme="${theme}"] {
  --ff-color-canvas: ${values.canvas};
  --ff-color-surface: ${values.surface};
  --ff-color-text-primary: ${values.textPrimary};
  --ff-color-text-secondary: ${values.textSecondary};
  --ff-color-text-muted: ${values.textMuted};
  --ff-color-border-subtle: ${values.borderSubtle};
}`.trim()
    )
    .join('\n\n');

  const buttonCss = Object.entries(tokens.components.button)
    .flatMap(([brand, modes]) =>
      Object.entries(modes).map(
        ([theme, states]) => `
[data-brand="${brand}"][data-theme="${theme}"] {
  --ff-button-bg-default: ${states.default.background};
  --ff-button-fg-default: ${states.default.foreground};
  --ff-button-bg-hover: ${states.hover.background};
  --ff-button-fg-hover: ${states.hover.foreground};
  --ff-button-bg-active: ${states.active.background};
  --ff-button-fg-active: ${states.active.foreground};
  --ff-button-bg-disabled: ${states.disabled.background};
  --ff-button-fg-disabled: ${states.disabled.foreground};
  --ff-dropdown-label-color: var(--ff-color-text-primary);
  --ff-dropdown-trigger-bg: var(--ff-color-surface);
  --ff-dropdown-trigger-fg: var(--ff-color-text-primary);
  --ff-dropdown-placeholder-color: var(--ff-color-text-primary);
  --ff-dropdown-border-color: var(--ff-color-border-subtle);
  --ff-dropdown-panel-bg: var(--ff-color-surface);
  --ff-dropdown-panel-shadow: 0 18px 42px color-mix(in srgb, ${states.default.background} 18%, transparent);
  --ff-dropdown-option-fg: var(--ff-color-text-primary);
  --ff-dropdown-option-description-color: var(--ff-color-text-secondary);
  --ff-dropdown-option-bg-hover: color-mix(in srgb, ${states.default.background} 12%, var(--ff-color-surface));
  --ff-dropdown-option-fg-hover: var(--ff-color-text-primary);
  --ff-dropdown-option-bg-selected: ${states.default.background};
  --ff-dropdown-option-fg-selected: ${states.default.foreground};
  --ff-dropdown-focus-ring: ${states.default.background};
}`.trim()
      )
    )
    .join('\n\n');

  return `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Open+Sans:wght@400;600&display=swap');

:root {
${paletteCss}
}

${brandCss}

${themeCss}

${buttonCss}
`;
}

function buildThemeCss() {
  return `@import './contract.css';
@import './figma-preset.css';
`;
}

function buildIndexJs() {
  return `import tokens from './tokens.json' with { type: 'json' };

export { tokens };
export const contractStylesheet = './contract.css';
export const figmaPresetStylesheet = './figma-preset.css';
export const themeStylesheet = './theme.css';
`;
}

function buildIndexTypes() {
  return `export declare const tokens: typeof import('./tokens.json');
export declare const contractStylesheet: string;
export declare const figmaPresetStylesheet: string;
export declare const themeStylesheet: string;
`;
}
