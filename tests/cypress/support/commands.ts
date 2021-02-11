// @ts-check
///<reference path="./index.d.ts" />
// import { configs } from '../../../backend/src/config';


Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-automation-id=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  return cy.get(`[data-automation-id*=${selector}]`, ...args);
});

Cypress.Commands.add('loginByAPI', (user = Cypress.env('user')) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env("apiUrl")}/login`,
    body: {
      ...Cypress._.pick(user, ['username', 'password'])
    },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('deleteMyUserIfExists', (user = Cypress.env('user')) =>
  cy.loginByAPI(user)
    .then(() =>
      cy.getCookie('jwt').then((val) => {
        if (val) {
          cy.request({
            method: 'DELETE',
            url: `${Cypress.env("apiUrl")}/deleteUser`,
          })
        } else {
          cy.log(`Unable to login to delete user ${Cypress.env('user').username}.`)
        }
      })
    )
)

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
      ...user
    },
    // failOnStatusCode: false
  }).its('body.user_id').should('exist')
})

// Cypress.Commands.add('setToken', (response) => {
//   const token = response.headers['set-cookie'][0].match(/jwt=([^;]+)/)[1];
//   return cy.setCookie('jwt', token, { expiry: configs.MAX_AGE })
// })
