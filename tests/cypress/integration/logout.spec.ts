/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('Logout', () => {
  before(() => {
    cy.waitInCIEnv()
  })

  beforeEach(() => {
    cy.deleteMyUserIfExists()
    cy.registerUserbyAPI()
    // cy.loginByAPI()
    cy.visit('/')
    cy.manualLogin()
  })

  it('logs out using the menu buton', () => {
    cy.getBySel('menu-button').click()
    cy.getBySel('menu-dropdown').should('have.attr', 'style')
    cy.getBySel('logout').click()
    cy.get('h1').should('contain', 'Sign in to Exodus')
    cy.getCookie('jwt').should('not.exist')
  })

  it('logs out when deleting the jwt cookie', () => {
    cy.clearCookies()
    cy.get('h1').should('contain', 'Sign in to Exodus')
    cy.getCookie('jwt').should('not.exist')
  })
})
