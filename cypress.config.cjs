const { defineConfig } = require('cypress');
const codeCoverageTask = require('@cypress/code-coverage/task');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5174',
        setupNodeEvents(on, config) {
            // Register code coverage collection
            codeCoverageTask(on, config);
            return config;
        },
        supportFile: 'cypress/support/e2e.ts',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        viewportWidth: 1280,
        viewportHeight: 720,
        video: false,
        screenshotOnRunFailure: true,
    },
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
        setupNodeEvents(on, config) {
            // Register code coverage for component tests too
            codeCoverageTask(on, config);
            return config;
        },
        supportFile: 'cypress/support/component.ts',
        specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    },
});