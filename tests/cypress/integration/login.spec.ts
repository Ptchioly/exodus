/// <reference types="cypress" />

describe.only('Login', () => {
  //DONE _WAITING FOR TEST CREDS FROM LEV
  // before(() => cy.registerUser())
  beforeEach(() => {
    cy.visit('/exodus')
    // cy.task("db:deleteUser", { username: Cypress.env("user").username, ...Cypress.env("aws") });
    // cy.registerUser().then(res => cy.setToken(res))
  })

  // it('greets with Sign in', () => {
  //   cy.contains('h1', 'Sign In')
  // })

  // it('displays register page on "Join now" click', () => {
  //   cy.contains('Join now').click()
  //     .should('have.attr', 'href', '/signup')
  // })

  // it('requires phone number', () => {
  //   cy.get('form').contains('Sign in').click()
  // })

  // it('requires password', () => {
  //   cy.getBySel('phone').type(`${Cypress.env('user').username}{enter}`)
  //   cy.get('.error-msg')
  //     .should('contain', 'password number can\'t be blank')
  // })

  // it("should error for an invalid user", function () {
  //   cy.login("invalidUserName", "invalidPa$$word");

  //   cy.getBySel("signin-error")
  //     .should("be.visible")
  //     .and("have.text", "Username or password is invalid");
  // });

  // it("should error for an invalid password for existing user", function () {
  // });

  it('displays home page on successful login', () => {
    // cy.getBySel('phone').type(`Cypress.env('user').username{enter}`)
    // cy.getBySel('password').type(`Cypress.env('user').password{enter}`)
    cy.window().should('have.property', 'top');
  })

})
