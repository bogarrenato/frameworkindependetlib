import { Config } from '@stencil/core';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'fuggetlenfe',
  srcDir: 'src',
  outputTargets: [
    reactOutputTarget({
      outDir: '../../apps/react-showcase/src/stencil-generated',
      stencilPackageName: '@fuggetlenfe/components'
    }),
    angularOutputTarget({
      componentCorePackage: '@fuggetlenfe/components',
      directivesProxyFile: '../../apps/angular-showcase/src/stencil-generated/components.ts',
      directivesArrayFile: '../../apps/angular-showcase/src/stencil-generated/index.ts',
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
