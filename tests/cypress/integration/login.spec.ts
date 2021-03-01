/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('login', () => {
  before(() => {
    cy.waitInCIEnv()
  })

  beforeEach(() => {
    cy.deleteMyUserIfExists()
    cy.registerUserbyAPI()
    cy.visit('/')
  })

  it('displays "Sign In" greeting on the login page', () => {
    cy.get('h1').should('contain', 'Sign in to Exodus')
    cy.percySnapshot('login page')
  })

  it('displays "Sign Up" on navigating to Sign Up page', () => {
    cy.getBySel('link-signup-button').click()
    cy.get('h1').should('contain', 'Sign Up')
    cy.percySnapshot('signup page')
  })

  it('displays register page on "Join now" click', () => {
    cy.getBySel('link-signup-button').click()
    cy.get('h1')
      .should('contain', 'Sign Up')
      .and('be.visible')
  })

  it('requires phone number', () => {
    cy.getBySel('phone-input').clear()
    cy.getBySel('signin-button').click()
    cy.getBySel('login-error-message').should('contain', 'Required fields are empty')
  })

  it('requires password', () => {
    cy.getBySel('phone-input').clear()
    cy.getBySel('pwd-input').clear()
    cy.getBySel('phone-input').type(`${Cypress.env('username')}`)
    cy.getBySel('signin-button').click()
    cy.getBySel('login-error-message')
      .should('be.visible')
      .and('contain', 'Required fields are empty')
  })

  it('should error for an invalid user', () => {
    cy.manualLogin({ username: `123456789123` })
    cy.wait('@login')
      .its('response.statusCode')
      .should('eq', 400)
    cy.getBySel('login-error-message')
      .should('be.visible')
      .and('have.text', 'User does not exist.')
  })

  it('should error for an invalid password for existing user', () => {
    cy.manualLogin({ password: `Wr0ngPa$$word` })
    cy.wait('@login')
      .its('response.statusCode')
      .should('eq', 400)
    cy.getBySel('login-error-message')
      .should('be.visible')
      .and('have.text', 'Incorrect password.')
  })

  it('displays home page on successful login', () => {
    cy.manualLogin()
    cy.wait('@login')
      .its('response.statusCode')
      .should('eq', 200)
    cy.checkHomePageLoaded()
  })
})
