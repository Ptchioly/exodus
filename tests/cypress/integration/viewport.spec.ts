/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('responsible UI', () => {
  before(() => {
    cy.waitInCIEnv()
  })

  const sizes = ['iphone-xr', 'ipad-2', 'macbook-15']
  sizes.forEach(size => {
    context('non-authenticated user', () => {
      beforeEach(() => {
        cy.deleteMyUserIfExists()
        cy.registerUserbyAPI()
        cy.visit('/')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.viewport(size)
      })
      it(`displays "Sign Up" greeting and registration forms on the sign up page on ${size} screen`, () => {
        cy.getBySel('link-signup-button').click()
        cy.get('h1')
          .should('contain', 'Sign Up')
          .and('beInViewport')
        cy.getBySel('phone-input').should('beInViewport')
        cy.getBySel('pwd-input').should('beInViewport')
        cy.getBySel('confirm-pwd-input').should('beInViewport')
        cy.getBySel('xtoken-input').should('beInViewport')
        cy.getBySel('signup-button').should('beInViewport')
      })

      it(`displays "Sign In" greeting and login forms on the login page on ${size} screen`, () => {
        cy.get('h1')
          .should('contain', 'Sign in to Exodus')
          .and('beInViewport')
        cy.getBySel('phone-input').should('beInViewport')
        cy.getBySel('pwd-input').should('beInViewport')
        cy.getBySel('signin-button').should('beInViewport')
      })
    })
    context('authenticated user', () => {
      beforeEach(() => {
        cy.deleteMyUserIfExists()
        cy.registerUserbyAPI()
        cy.loginByAPI()
        cy.visit('/')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.viewport(size)
      })

      it(`displays menu buttons and budget graphs on the home page on ${size} screen`, () => {
        cy.getBySel('telegram-link').should('be.visible')
        // cy.getBySel('menu-button').should('beInViewport')
        cy.getBySel('limit-button')
          .first()
          .should('beInViewport')
        cy.getBySel('limit-button')
          .first()
          .click()
        cy.getBySel('limit-setter')
          .first()
          .should('beInViewport')
        cy.getBySel('limit-input')
          .first()
          .type('1') // rewrite this with proper values when the field gets fixed, currently this results in value '501'
        cy.getBySel('limit-setter')
          .first()
          .should('beInViewport')
      })
    })
  })
})
