// @ts-check
///<reference path="./index.d.ts" />
import { configs } from '../../../backend/src/config';


Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-automation-id=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  return cy.get(`[data-automation-id*=${selector}]`, ...args);
});

// -- custom command to return a token after logging in --
Cypress.Commands.add('getLoginToken', (user = Cypress.env('user')) => {
  return cy
    .request('POST', `${Cypress.env("apiUrl")}/login`, {
      ...Cypress._.pick(user, ['username', 'password'])
    })
})

Cypress.Commands.add('setToken', (token) => {
  return cy.setCookie('jwt', token.match(/jwt=([^;]+)/)[1], { expiry: configs.MAX_AGE })
})

// -- a custom command to login using XHR call and set the received cookie --
// log in with default user 
Cypress.Commands.add('loginByAPI', (user = Cypress.env('user')) => {
  return cy.getLoginToken(user).then(res => cy.setToken(res.headers['set-cookie'][0]))
})


// creates a user with phone, xtoken and password
// defined in cypress.env.json 
// if the user already exists, ignores the error
// or given user info parameters
Cypress.Commands.add('registerUser', (options = {}) => {
  const defaults = {
    // phone, password, xtoken
    ...Cypress.env('user')
  }
  const user = Cypress._.defaults({}, options, defaults)
  return cy.request({
    method: 'POST',
    url: `${Cypress.env("apiUrl")}/signup`,
    body: {
      ...Cypress.env('user')
    },
    failOnStatusCode: false
  })
})
