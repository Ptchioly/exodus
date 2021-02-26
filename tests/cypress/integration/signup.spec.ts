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
        expect(response.body).to.have.property('message', 'Phone number is invalid.')
      })
    })
  })

  it('does not register new user with incorrect data in password', () => {
    const invalidPasswords = [
      // 'testuserdata3@',
      'TESTUSERDATA4@',
      'TESTuserdata@',
      'Test1@',
      'Testuserdata 4456@'
    ]
    invalidPasswords.forEach(pwd => {
      cy.sendSignUpRequest({ password: pwd }).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property(
          'message',
          'Passwords must have at least 8 characters and contain uppercase letters, lowercase letters and numbers.'
        )
      })
    })
  })

  it('does not register new user with already registered phone number', () => {
    cy.registerUserbyAPI()
    cy.sendSignUpRequest().then(response => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('message', 'User already exists.')
    })
  })

  it('registers new user', () => {
    cy.manualRegisterUser()
    cy.checkHomePageLoaded()
  })

  it('does not register new user without incorrect X-Token', () => {
    cy.manualRegisterUser({ xtoken: 'test12345' })
    cy.getBySel('login-error-message')
      .should('be.visible')
      .and('have.text', 'Invalid X-Token')
  })

  it('does not register new user with "password" and "confirm password" inputs mismatched', () => {
    cy.manualRegisterUser({ confirmPassword: 'Testuserpwd123@' })
    cy.getBySel('login-error-message')
      .should('be.visible')
      .and('have.text', 'Passwords do not match')
  })
})
