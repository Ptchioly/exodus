/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('sign up', () => {
  before(() => {
    cy.waitInCIEnv()
  })

  beforeEach(() => {
    cy.deleteMyUserIfExists()
    cy.visit('/')
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

  it('does not register new user with incorrect data in username', () => {
    const invalidUsernames = ['testuser_01', '078323', '0783233232323223323333']
    invalidUsernames.forEach(user => {
      cy.sendSignUpRequest({ username: user }).then(response => {
        expect(response.status).to.eq(400)
      })
    })
  })

  it('does not register new user with incorrect data in password', () => {
    const invalidPasswords = ['testuserdata3@', 'TESTUSERDATA4@', 'TESTuserdata@', 'Test1@', 'Testuserdata 4456@']
    invalidPasswords.forEach(pwd => {
      cy.sendSignUpRequest({ password: pwd }).then(response => {
        expect(response.status).to.eq(400)
      })
    })
  })

  it('does not register new user with already registered phone number', () => {
    cy.registerUserbyAPI()
    cy.sendSignUpRequest().then(response => {
      expect(response.status).to.eq(400)
    })
  })

  it('registers new user', () => {
    cy.manualRegisterUser()
    cy.checkHomePageLoaded()
    cy.percySnapshot('home page after signup')
  })

  it('does not register new user without incorrect X-Token', () => {
    cy.manualRegisterUser({ xtoken: 'test12345' })
    cy.getBySel('login-error-message')
      .should('be.visible')
      .and('have.text', 'X-Token is not valid')
  })

  it('does not register new user with "password" and "confirm password" inputs mismatched', () => {
    cy.manualRegisterUser({ confirmPassword: 'Testuserpwd123@' })
    cy.getBySel('login-error-message')
      .should('be.visible')
      .and('have.text', 'Passwords do not match')
  })
})
