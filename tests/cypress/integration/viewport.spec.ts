/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

// const sizes = ['iphone-6'] // test viewports, update with relevant ones
const sizes = ['iphone-6', 'ipad-2', [1280, 1024]] // test viewports, update with relevant ones

describe(`Login page visibility`, () => {
  before(function() {
    cy.deleteMyUserIfExists()
    cy.registerUser()
  })

  beforeEach(() => {
    cy.clearCookies()
    // cy.visit('/')
  })

  sizes.forEach(size => {
    it(`displays "Sign In" greeting and login forms on the login page using ${size} viewport`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }
      cy.visit('/')
      console.log(cy.window())
      cy.get('h1')
        .should('contain', 'Sign in to Exodus')
        .and('be.inViewport')
      cy.getBySel('phone-input').should('be.inViewport')
      cy.getBySel('pwd-input').should('be.inViewport')
      cy.getBySel('signin-button').should('be.inViewport')
    })

    it(`displays "Sign Up" greeting and registration forms on the sign up page using ${size} viewport`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }
      cy.getBySel('link-signup-button').click()
      cy.get('h1')
        .should('contain', 'Sign Up')
        .and('be.inViewport')
      cy.getBySel('phone-input').should('be.inViewport')
      cy.getBySel('pwd-input').should('be.inViewport')
      cy.getBySel('confirm-pwd-input').should('be.inViewport')
      cy.getBySel('xtoken-input').should('be.inViewport')
      cy.getBySel('signup-button').should('be.inViewport')
    })

    it(`displays menu buttons and budget graphs on the home page using ${size} viewport`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }
      cy.loginByAPI()
      cy.visit('/')
      cy.getBySel('telegram-link').should('be.visible')
      cy.getBySel('menu-button').should('be.inViewport')
      cy.getBySel('limit-button')
        .first()
        .should('be.inViewport')
      cy.getBySel('limit-button')
        .first()
        .click()
      cy.getBySel('limit-setter').should('be.inViewport')
      cy.getBySel('limit-input')
        .first()
        .type('1') // rewrite this with proper values when the field gets fixed, currently this results in value '501'
      cy.getBySel('limit-setter')
        .first()
        .should('be.inViewport')
    })
  })
})
