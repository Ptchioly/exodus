// @ts-check
///<reference path="./index.d.ts" />
// import { configs } from '../../../backend/src/config';

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-automation-id=${selector}]`, ...args)
})

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-automation-id*=${selector}]`, ...args)
})

Cypress.Commands.add(
  'loginByAPI',
  (
    user = {
      username: Cypress.env('username'),
      password: Cypress.env('password')
    }
  ) => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      body: {
        ...user
      },
      failOnStatusCode: false
    })
  }
)

Cypress.Commands.add(
  'deleteMyUserIfExists',
  (
    user = {
      username: Cypress.env('username'),
      password: Cypress.env('password')
    }
  ) => {
    cy.loginByAPI(user)
    cy.getCookie('jwt').then(val => {
      if (val) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiUrl')}/deleteUser`
        })
      } else {
        cy.log(`Unable to login to delete user ${Cypress.env('username')}.`)
      }
    })
  }
)

Cypress.Commands.add('waitInCIEnv', () => {
  if (Cypress.env('CIWait') === true) {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(60000)
  }
})

Cypress.Commands.add('sendSignUpRequest', (options = {}) => {
  const defaults = {
    // phone, password, xtoken
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    xtoken: Cypress.env('xtoken')
  }
  const user = Cypress._.defaults({}, options, defaults)
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/signup`,
    body: {
      ...user
    },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('registerUserbyAPI', (options = {}) => {
  cy.sendSignUpRequest(options).then(response => {
    expect(response.status).to.eq(200)
    //don't save cookie, login on purpose
    cy.clearCookie('jwt')
  })
})

// /**
//  * Check home page loaded when you login or signup
//  */
Cypress.Commands.add('checkHomePageLoaded', () => {
  cy.getBySel('telegram-link', { timeout: 8000 }).should('be.visible')
  cy.getBySel('menu-button').should('be.visible')
  // cy.get('section>div.limits')
  //   .first()
  //   .should('exist') //not visible height 0px wtf??
  // cy.getBySel('limit-setter').should('be.visible');
  // cy.getBySel('limit-input').should('be.visible');
  cy.getCookie('jwt').should('have.property', 'value')
})

// /**
//  * Trim country code off the phone
//  */
const trimUsername = (username: string = Cypress.env('username')): string => username.slice(3)

// /**
//  * Do manual UI login
//  */
Cypress.Commands.add('manualLogin', (user = {}) => {
  const defaults = {
    username: Cypress.env('username'),
    password: Cypress.env('password')
  }
  const userInfo = Cypress._.defaults({}, user, defaults)
  cy.getBySel('phone-input').type(trimUsername(userInfo.username))
  cy.getBySel('pwd-input').type(userInfo.password)
  cy.intercept('POST', 'login').as('login')
  cy.getBySel('signin-button').click()
})

// /**
//  * Do manual UI register user
//  */
Cypress.Commands.add('manualRegisterUser', (user = {}) => {
  const defaults = {
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    confirmPassword: Cypress.env('password'),
    xtoken: Cypress.env('xtoken')
  }
  const userInfo = Cypress._.defaults({}, user, defaults)
  cy.getBySel('link-signup-button').click()
  cy.getBySel('phone-input').type(trimUsername(userInfo.username))
  cy.getBySel('pwd-input').type(userInfo.password)
  cy.getBySel('confirm-pwd-input').type(userInfo.confirmPassword)
  cy.getBySel('xtoken-input').type(userInfo.xtoken)
  cy.getBySel('signup-button').click()
})
