/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

// const sizes = ['iphone-6'] // test viewports, update with relevant ones
const sizes = ['iphone-6', 'ipad1-2', [1280, 1024]] // test viewports, update with relevant ones

describe(`Login page visibility`, () => {
    before(function() {
        cy.log(Cypress.env('username'))
        cy.log(Cypress.env('password'))
        cy.deleteMyUserIfExists()
        cy.registerUser()
    })
    
    
    beforeEach(() => {
        cy.clearCookies()
        // cy.visit('/')
    })

    sizes.forEach((size) => {
        it(`displays "Sign In" greeting and login forms on the login page using ${size} viewport`, () => {
          if (Cypress._.isArray(size)) {
            cy.viewport(size[0], size[1])
          } else {
            cy.viewport(size)
          }
          cy.visit('/')
          cy.contains('h1', 'Sign in to Exodus').should('be.inViewport')
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
          cy.contains('Join Now').click()  
          cy.get('h1').should('contain', 'Sign Up').and('be.inViewport')
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
        //   cy.getBySel('telegram-button').should('be.visible')
          cy.getBySel('menu-button').should('be.inViewport')
          cy.getBySel('limit-button').first().should('be.inViewport')
          cy.getBySel('limit-button').click()
          cy.getBySel('limit-setter').should('be.inViewport')
            // cy.getBySel('limit-input').clear()
            // cy.get(':nth-child(1) > .top > .actions > .action').click()
          cy.getBySel('limit-input').type('150')
          cy.getBySel('limit-setter').first().should('be.inViewport')
        })

    })
})