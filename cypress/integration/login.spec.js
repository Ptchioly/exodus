/// <reference types="cypress" />

describe.only('Login', () => {
  //TO DO
  // before(() => cy.registerUserIfNeeded())
  beforeEach(() => {
    cy.visit('/exodus/')
  })

  // it('does not work with wrong credentials', () => {
  // })

  it('logs in', () => { cy.window().should('have.property', 'top') })

})
