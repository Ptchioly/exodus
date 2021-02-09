/// <reference types="cypress" />

describe.only('Login', () => {
  //DONE _WAITING FOR TEST CREDS FROM LEV with valid XTOKEN
  before(() => {
    cy.task("db:deleteUser", { username: Cypress.env("user").username, ...Cypress.env("aws") });
    cy.registerUser()
  })

  beforeEach(() => {
    cy.visit('/')
  })

  // it('displays "Sign in to Exodus" on the login page', () => {
  //   cy.contains('h1', 'Sign in to Exodus')
  // })

  // it('displays register page on "Join now" click', () => {
  //   cy.contains('Join Now').click()
  //   cy.get('h1').should('contain', 'Sign Up')
  // })

  it('requires phone number', () => {
    cy.getBySel('country-code--input').clear
    cy.getBySel('phone-input').clear
    cy.getBySel('form-button').click()
    //add asserts when frontend supports it
  })

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
