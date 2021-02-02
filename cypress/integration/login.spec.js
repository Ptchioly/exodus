/// <reference types="cypress" />

describe.only('Login', () => {
  //TO DO
  // before(() => cy.registerUserIfNeeded())
  beforeEach(() => {
    cy.visit('/exodus/')
  })

  it('does not work with wrong credentials', () => {
    cy.window().should('have.property', 'tofp')
  })

  it('logs in', () => { })

  it("should redirect unauthenticated user to signin page", () => { })

})
