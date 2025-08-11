const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // --- SECCIÓN DEL REPORTERO ---
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Reporte de Pruebas de Supervisión en Línea',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  // --- FIN DE LA SECCIÓN DEL REPORTERO ---

  e2e: {
    setupNodeEvents(on, config) {
      // Esta línea es crucial para que el reportero funcione
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    specPattern: '**/*.cy.js'
  },
});