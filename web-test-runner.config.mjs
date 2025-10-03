import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: 'test/**/*.test.html',
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
  ],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 5000,
    },
  },
};
