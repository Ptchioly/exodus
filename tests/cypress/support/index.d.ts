/// <reference types="cypress" />

declare namespace Cypress {
  type UserLoginInfo = {
    username?: string
    password?: string
  }

  type APISignupInfo = UserLoginInfo & { xtoken?: string }

  type manualSignupInfo = APISignupInfo & { confirmPassword?: string }
  interface Chainable<Subject> {
    /**
     * Custom command to select DOM element by data-automation-id attribute.
     * @example cy.getBySel('greeting')
     */

    getBySel(dataIdAttribute: string, args?: any): Chainable<Element>

    /**
     * Custom command to select DOM element which data-automation-id attribute includes a given string.
     * @example cy.getBySelLike('greeting')
     */

    getBySelLike(dataIdPrefixAttribute: string, args?: any): Chainable<Element>

    // /**
    //  * Logs-in user by using API request and sets the received JWT cookie
    //  */
    loginByAPI(options?: UserLoginInfo): Chainable<Response>

    // /**
    //  * Logs user in manually via app UI
    //  */
    manualLogin(options?: UserLoginInfo): void

    // /**
    //  * API request - creates a user with phone, xtoken and password, deletes JWT cookie after
    //  */
    registerUserbyAPI(options?: APISignupInfo): Chainable<Subject>

    sendSignUpRequest(options?: APISignupInfo): Chainable<Response>

    manualRegisterUser(options?: manualSignupInfo): void

    // /**
    //  *  logs in to get JWT with creds defined in cypress.env.json
    //  *  then deletes a user from inside his own account
    //  */
    deleteMyUserIfExists(options?: UserLoginInfo): Chainable<void>

    checkHomePageLoaded(): void

    waitInCIEnv(): void
  }
  interface Chainer<Subject> {
    /**
     * Custom Chai assertion that checks if the given subject is in viewport
     * @example
    cy.getBySel('menu-button').should('beInViewport')
    */
    (chainer: 'beInViewport'): Chainable<Subject>
  }
}
