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
//
Cypress.Commands.add("register", (name, email, password) => {
  cy.visit("/register");
  cy.getByDataCy("register-name").type(name);
  cy.getByDataCy("register-email").type(email);
  cy.getByDataCy("register-password").type(password);
  cy.getByDataCy("register-password-again").type(password);
  cy.get("button").contains("Register").click();
})

Cypress.Commands.add("login", (email, password) => {
  cy.visit('/login');
  cy.get('[data-cy=email]').type(email);
  cy.get('[data-cy=password]').type(password);
  cy.get('[type=submit]').contains("Sign In").click();
})

Cypress.Commands.add("loginByAPI", (email, password) => {
  cy.session([email, password], () => {
    cy.request({
      method: "POST",
      url: "http://localhost:5000/api/login",
      body: {email, password},
    }),
  {
    validate() {
      cy.visit("/profile");
      cy.contains(email);
    },
  }});
});

Cypress.Commands.add("getByDataCy", (dataCy) => {
  cy.get(`[data-cy=${dataCy}]`);
})
