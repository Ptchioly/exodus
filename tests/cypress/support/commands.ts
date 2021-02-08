// @ts-check
///<reference path="./index.d.ts" />

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
      user: Cypress._.pick(user, ['username', 'password'])
    })
    .its('body.item.token')
    .should('exist')
})

// -- a custom command to login using XHR call and set the received cookie --
// log in with default user 
Cypress.Commands.add('login', (user = Cypress.env('user')) => {
  return cy.getLoginToken(user).then(token => {
    cy.setCookie('jwt', token, { expiry: 86400000 })
  })
  // cy.visit('/')
  // cy.getBySel('user-profile').should('be.visible')
})

// creates a user with phone, xtoken and password
// defined in cypress.json environment variables
// if the user already exists, ignores the error
// or given user info parameters
Cypress.Commands.add('registerUser', (options = {}) => {
  const defaults = {
    // phone, password, xtoken
    ...Cypress.env('user'), ...Cypress.env("xToken")
  }
  const user = Cypress._.defaults({}, options, defaults)
  return cy.request({
    method: 'POST',
    url: `${Cypress.env("apiUrl")}/signup`,
    body: {
      user
    },
    failOnStatusCode: false
  })
})



// -- API login command --

// Cypress.Commands.add("login", (phone, password) => {
//   cy.request({
//     method: 'POST',
//     url: 'https://ptchioly.github.io/login',
//     body: {
//       user: {
//         phone: phone,
//         password: password
//       }
//     }
//   }).then((resp) => {
//     cy.setCookie('jwt', resp.body.item.token, { expiry: 86400000 })

//   })
// })
