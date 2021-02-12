/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('sign up', {
  env: {
    phone: Cypress.env('username').slice(3) //user phone without region
  }
}, () => {
  beforeEach(() => {
    // cy.deleteMyUserIfExists()
    // we are not logged in
    cy.visit('/')
  })

//   it('does not register new user with already registered phone number', () => { 
//     cy.registerUser();
//     cy.getBySel('link-signup-button').click();
//     cy.getBySel('phone-input').type(`${Cypress.env('phone')}`);
//     cy.getBySel('pwd-input').type(`${Cypress.env('password')}`);
//     cy.getBySel('confirm-pwd-input').type(`${Cypress.env('password')}`);
//     cy.getBySel('xtoken-input').type(`${Cypress.env('xtoken')}`);
//     cy.getBySel('signup-button').click();
// })

//   it('requires only digits in phone number', () => {
//     cy.getBySel('link-signup-button').click();
//     cy.getBySel('phone-input').type('invalidPhoneNumber123');
//     cy.getBySel('pwd-input').type(`${Cypress.env('password')}`);
//     cy.getBySel('confirm-pwd-input').type(`${Cypress.env('password')}`);
//     cy.getBySel('xtoken-input').type(`${Cypress.env('xtoken')}`);
//     cy.getBySel('signup-button').click();
  //   cy.get('login-error-message').should('eq',"Phone number is not valid.")
//   })

  // it('does not register new user without incorrct X-Token', () => {
  //   cy.getBySel('link-signup-button').click();
  //   cy.getBySel('phone-input').type(`${Cypress.env('phone')}`);
  //   cy.getBySel('pwd-input').type(`${Cypress.env('password')}`);
  //   cy.getBySel('confirm-pwd-input').type(`${Cypress.env('password')}`);
  //   cy.getBySel('xtoken-input').type('invalidXtoken123');
  //   cy.get('login-error-message').should('eq'," 'X-Token'")
  //  })

//   it('does not register new user with less than 12 chars in phone number', () => { 
    //   cy.getBySel('link-signup-button').click();
  //   cy.getBySel('phone-input').type(`${Cypress.env('phone')}`);
  //   cy.getBySel('pwd-input').type(`${Cypress.env('password')}`);
  //   cy.getBySel('confirm-pwd-input').type(`${Cypress.env('password')}`);
  //   cy.getBySel('xtoken-input').type('invalidXtoken123');
  //   cy.get('login-error-message').should('eq',"Unknown 'X-Token'")
// })

//   it('does not register new user with less than 1 upper-case char in password', () => { })

//   it('does not register new user with less than 1 lower-case char in password', () => { })

//   it('does not register new user with less than 1 digit in password', () => { })

//   it('does not register new user with less than 8 symbols in password', () => { })

//   it('does not register new user with whitespaces in password', () => { })

//   it('does not register new user with "password" and "confirm password" inputs mismatched', () => { })

  it('registers new user', () => { 
    cy.getBySel('link-signup-button').click();
    cy.getBySel('phone-input').type(`${Cypress.env('phone')}`);
    cy.getBySel('pwd-input').type(`${Cypress.env('password')}`);
    cy.getBySel('confirm-pwd-input').type(`${Cypress.env('password')}`);
    cy.getBySel('xtoken-input').type(`${Cypress.env('xtoken')}`);
    cy.getBySel('signup-button').click();
    cy.checkHomePageLoaded();
  })


})
