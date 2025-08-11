// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/**
 * Comando personalizado para realizar el login en la aplicación.
 * Carga las credenciales desde el archivo de fixtures.
 * @example cy.login()
 */
Cypress.Commands.add('login', () => {
  // Cargamos los datos desde nuestro archivo de fixture
  cy.fixture('usuarios').then((datos) => {
    const admin = datos.admin;

    cy.visit('https://qatest.supervisionenlinea.com/login');
    
    cy.get('#user').type(admin.usuario);
    cy.get('#pass').type(admin.contrasena);
    cy.get('#login').click(); // Selector final del botón

    // Verificación de que el login fue exitoso
    cy.url().should('include', '/almacen');
  });
});