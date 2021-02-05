// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
const apiUrl = Cypress.env('apiUrl')

//
// -- API login command --
Cypress.Commands.add("login", (phone, password) => {
    cy.request({
        method: 'POST',
        url: 'https://ptchioly.github.io/login',
        body: {
            user: {
                phone: phone,
                password: password
            }
        }
    }).then((resp) => {
        cy.setCookie('jwt', resp.body.item.token, { expiry: 86400000 })

    })
})

// -- a custom command to login using XHR call and set the received cookie --
// log in with default user 
Cypress.Commands.add('login', (user = Cypress.env('user')) => {
    cy.getLoginToken(user).then(token => {
        cy.setCookie('jwt', token, { expiry: 86400000 })
    })
    cy.visit('/exodus')
    cy.get('[data-automation-id=user-profile]').should('be.visible')
})


// -- custom command to return a token after logging in --
Cypress.Commands.add('getLoginToken', (user = Cypress.env('user')) => {
    return cy
      .request('POST', `${apiUrl}/api/users/login`, {
        user: Cypress._.pick(user, ['phone', 'password'])
      })
      .its('body.item.token')
      .should('exist')
  })

  // creates a user with email and password
// defined in cypress.json environment variables
// if the user already exists, ignores the error
// or given user info parameters
Cypress.Commands.add('registerUserIfNeeded', (options = {}) => {
    const defaults = {
      // phone, password
      ...Cypress.env('user')
    }
    const user = Cypress._.defaults({}, options, defaults)
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/users`,
      body: {
        user
      },
      failOnStatusCode: false
    })
  })

  // -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
