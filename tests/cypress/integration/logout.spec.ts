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
    cy.getBySel('menu-dropdown')
      .find('[data-automation-id=logout]')
      .click()
    cy.get('h1').should('contain', 'Sign in to Exodus')
    cy.getCookie('jwt').should('not.exist')
  })

  it.only('logs out when deleting the jwt cookie', () => {
    cy.checkHomePageLoaded()
    cy.clearCookie('jwt')
    cy.getCookie('jwt').should('not.exist')
    cy.reload()
    cy.get('h1').should('contain', 'Sign in to Exodus')
  })
})
