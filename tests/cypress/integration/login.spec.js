/// <reference types="cypress" />

context('Login', () => {
    beforeEach(() => {
      cy.visit('/exodus/')
    })
  
    it('cy.window() - get the global window object', () => {
      cy.window().should('have.property', 'tosp')
    })

  })
  