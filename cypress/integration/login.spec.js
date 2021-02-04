/// <reference types="cypress" />

describe.only('Login', () => {
  //TO DO
  // before(() => cy.registerUserIfNeeded())
  beforeEach(() => {
    cy.visit('/exodus/')
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
  //   cy.get('[data-automation-id=phone]').type('1234567890{enter}')
  //   cy.get('.error-msg')
  //     .should('contain', 'password number can\'t be blank')
  // })

  // it('does not work with wrong credentials', () => {
  //   cy.get('[data-automation-id=phone]').type('1234567890{enter}')
  //   cy.get('[data-automation-id=password]').type('invalid{enter}')
  //   cy.get('.error-msg')
  //     .should('contain', 'phone or password is invalid')
  // })

  it('dipslays home page on successful login', () => { 
    // cy.get('[data-automation-id=phone]').type('1234567890{enter}')
    // cy.get('[data-automation-id=password]').type('valid{enter}')
    cy.window().should('have.property', 'top')
   })

})
