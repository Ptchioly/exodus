/// <reference types="cypress" />

context('Login', () => {
    beforeEach(() => {
      cy.visit('https://ptchioly.github.io/exodus/')
    })
  
    it('cy.window() - get the global window object', () => {
      cy.window().should('have.property', 'top')
    })

  })
  