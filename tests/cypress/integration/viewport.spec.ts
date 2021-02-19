/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe(`Login page visibility`, () => {
  const sizes = ['iphone-6', 'ipad-2', [1280, 1024]] // viewport sizes

  before(function() {
    cy.deleteMyUserIfExists()
    cy.registerUser()
  })

  beforeEach(() => {
    cy.loginByAPI()
    cy.visit('/')
  })

  sizes.forEach(size => {
    it(`displays menu buttons and budget graphs on the home page using ${size} viewport`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.viewport(size)
      }
      cy.getBySel('telegram-link').should('be.visible')
      cy.getBySel('menu-button').should('be.inViewport')
      cy.getBySel('limit-button')
        .first()
        .should('be.inViewport')
      cy.getBySel('limit-button')
        .first()
        .click()
      cy.getBySel('limit-setter')
        .first()
        .should('be.inViewport')
      cy.getBySel('limit-input')
        .first()
        .type('1') // rewrite this with proper values when the field gets fixed, currently this results in value '501'
      cy.getBySel('limit-setter')
        .first()
        .should('be.inViewport')
    })
  })
})
