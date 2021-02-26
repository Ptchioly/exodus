/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('Logout', () => {
  before(function() {
    cy.waitInCIEnv()
  })

  beforeEach(() => {
    cy.deleteMyUserIfExists()
    cy.registerUserbyAPI()
    cy.loginByAPI()
    cy.visit('/')
  })

  it('logs out using the menu buton', () => {
    cy.getBySel('menu-button').click()
    cy.getBySel('logout').click()
    cy.get('h1')
      .should('contain', 'Sign in to Exodus')
      .and('beInViewport')
    cy.getCookie('jwt').should('not.exist')
  })
})
