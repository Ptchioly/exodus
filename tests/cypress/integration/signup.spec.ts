/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('sign up', () => {
  const sizes = ['iphone-6', 'ipad-2', [1280, 1024]] // viewport sizes

  before(() => cy.waitInCIEnv())

  beforeEach(() => {
    cy.deleteMyUserIfExists()
    cy.visit('/')
  })

  sizes.forEach(size => {
    it(`displays "Sign Up" greeting and registration forms on the sign up page using ${size} viewport`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
  })

  it('registers new user', () => {
    cy.manualRegisterUser()
    cy.wait('@signup')
      .its('response.statusCode')
      .should('eq', 200)
    cy.checkHomePageLoaded()
  })

  it('check monobank link', () => {
    cy.getBySel('link-signup-button').click()
    cy.getBySel('monobank-link').should('be.visible')
    cy.request({
      method: 'GET',
      url: 'https://api.monobank.ua'
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).contain('id="qrcode"')
    })
  })

  //   it('does not register new user with already registered phone number', () => { })

  //   it('requires only digits in phone number', () => { })

  // it('does not register new user without incorrct X-Token', () => { })

  //   it('does not register new user with less than 12 chars in phone number', () => { })

  //   it('does not register new user with less than 1 upper-case char in password', () => { })

  //   it('does not register new user with less than 1 lower-case char in password', () => { })

  //   it('does not register new user with less than 1 digit in password', () => { })

  //   it('does not register new user with less than 8 symbols in password', () => { })

  //   it('does not register new user with whitespaces in password', () => { })

  //   it('does not register new user with "password" and "confirm password" inputs mismatched', () => { })
})
