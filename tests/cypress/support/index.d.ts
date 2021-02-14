/// <reference types="cypress" />

declare namespace Cypress {
  type UserSignupInfo = {
    username: string
    password: string
    xtoken: string
    // [propName: string]: any;
  }

  type manualSignupInfo = {
    username?: string
    password?: string
    confirmPassword?: string
    xtoken?: string
    // [propName: string]: any;
  }

  type UserLoginInfo = {
    username?: string
    password?: string
  }
  interface Chainable<Subject = any> {
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
    //  * creates a user with phone, xtoken and password, sets JWT and transfer a user to his account
    //  */
    registerUser(options?: UserSignupInfo): Chainable<any>

    manualRegisterUser(options?: manualSignupInfo): void

    // /**
    //  *  logs in to get JWT with creds defined in cypress.env.json
    //  *  then deletes a user from inside his own account
    //  */
    deleteMyUserIfExists(options?: UserLoginInfo): Chainable<any>

    checkHomePageLoaded(): void

    // /**
    //  * Gets JWT Token
    //  */
    // getLoginToken(username: string, password?: string): Chainable<Response>;

    // /**
    //  * Sets JWT Token
    //  */
    // setToken(token: Response): void;

    // /**
    //  *  Cypress task for deleting user from database
    //  */
    // task(
    //   event: "db:deleteUser",
    //   arg: {
    //     username: string,
    //     accessKeyId: string,
    //     secretAccessKey: string,
    //     region: string
    //   }
    // ): Chainable<any>;

    // /**
    //  *  Cypress task for creating user in database
    //  */

    // task(
    //   event: "db:createUser",
    //   arg: { user: string, password: string }
    // ): Chainable<any>;

    // /**
    //  *  Cypress task for quering user from database
    //  */

    // task(
    //   event: "db:getUser",
    //   arg: {
    //     username: string,
    //     accessKeyId: string,
    //     secretAccessKey: string,
    //     region: string
    //   }
    // ): Chainable<any>;
  }
}
