/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe.only('Login', {
  env: {
    phone: Cypress.env('username').slice(3) //user phone without region
  }
}, () => {
  before(function() {
    cy.deleteMyUserIfExists()
    cy.registerUser()
  })

  beforeEach(() => {
    cy.visit('/')
  })

  it('displays "Sign in to Exodus" on the login page', () => {
    cy.contains('h1', 'Sign in to Exodus').should('be.visible')
  })

  it('displays register page on "Join now" click', () => {
    cy.contains('Join Now').click()
    cy.get('h1').should('contain', 'Sign Up')
  })

  // it('requires phone number', () => {
  //   cy.getBySel('country-code--input').clear
  //   cy.getBySel('phone-input').clear
  //   cy.getBySel('form-button').click()
  //   //add asserts when frontend supports it
  // })

  // it('requires password', () => {
  //   cy.getBySel('phone-input').clear
  //   cy.getBySel('pwd-input').clear
  //   cy.getBySel('phone').type(`${Cypress.env('phone')}{enter}`)
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
    cy.getBySel('phone-input').type(`${Cypress.env('phone')}`)
    cy.getBySel('pwd-input').type(`${Cypress.env('user').password}`)
    // cy.getBySel('pwd-input').type(`${Cypress.env('user').password}{enter}`)
    cy.getBySel('form-button').click()
    cy.get('.cursor-pointer').should('contain', 'LOG OUT');
    cy.getCookie('jwt').should('have.property', 'value');
  })

})
