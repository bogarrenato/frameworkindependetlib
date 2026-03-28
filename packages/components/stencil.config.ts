import { Config } from '@stencil/core';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { reactOutputTarget } from '@stencil/react-output-target';

/**
 * The Stencil package is the single source of truth for shared component behavior.
 * Framework wrappers are generated from this layer so React and Angular stay aligned
 * to the same runtime contract.
 */
export const config: Config = {
  namespace: 'fuggetlenfe',
  srcDir: 'src',
  outputTargets: [
    reactOutputTarget({
      outDir: '../react-wrapper/src/generated',
      stencilPackageName: '@fuggetlenfe/components'
    }),
    angularOutputTarget({
      componentCorePackage: '@fuggetlenfe/components',
      directivesProxyFile: '../angular-wrapper/src/lib/generated/components.ts',
      directivesArrayFile: '../angular-wrapper/src/lib/generated/index.ts',
      valueAccessorConfigs: [],
      outputType: 'standalone'
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'dist-custom-elements',
      externalRuntime: false
    },
    {
      type: 'docs-readme'
    }
  ],
  testing: {
    browserHeadless: 'shell'
  }
};
