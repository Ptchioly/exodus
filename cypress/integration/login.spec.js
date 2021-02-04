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

  // it('requires 12 chars in phone number', () => {
    // cy.get('[data-automation-id=phone]').type('12345690{enter}')
  //   cy.get('.error-msg')
  //     .should('contain', 'phone number should be not less than 12 chars')
  // })

  // it('requires only digits in phone number', () => {
    // cy.get('[data-automation-id=phone]').type('A^HJF@3F32fh{enter}')
  //   cy.get('.error-msg')
  //     .should('contain', 'phone number should contain only digits')
  // })

  // it('requires password', () => {
  //   cy.get('[data-automation-id=phone]').type('1234567890{enter}')
  //   cy.get('.error-msg')
  //     .should('contain', 'password number can\'t be blank')
  // })

  // it('requires minimum 1 upper-case char in password', () => { })

  // it('requires minimum 1 lower-case char in password', () => { })

  // it('requires minimum 1 digit in password', () => { })

  // it('requires minimum 8 symbols in password', () => { })

  // it('requires no whitespaces in password', () => { })

  // it('does not work with wrong credentials', () => {
  //   cy.get('[data-automation-id=phone]').type('1234567890{enter}')
  //   cy.get('[data-automation-id=password]').type('invalid{enter}')
  //   cy.get('.error-msg')
  //     .should('contain', 'phone or password is invalid')
  // })

  it('displays home page on successful login', () => { 
    // cy.get('[data-automation-id=phone]').type('1234567890{enter}')
    // cy.get('[data-automation-id=password]').type('valid{enter}')
    cy.window().should('have.property', 'top')
   })

})
