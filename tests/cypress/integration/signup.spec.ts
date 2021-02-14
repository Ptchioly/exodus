/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('sign up', () => {
  beforeEach(() => {
    cy.deleteMyUserIfExists()
    cy.visit('/')
  })

  it('registers new user', () => {
    cy.manualRegisterUser()
    cy.checkHomePageLoaded()
  })

  it('check monobank link', () => {
    cy.getBySel('link-signup-button').click()
    cy.getBySel('monobank-link').should('be.visible')
    cy.request({
      method: 'GET',
      url: 'https://api.monobank.ua',
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
