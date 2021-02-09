/// <reference types="cypress" />

declare namespace Cypress {

  type UserInfo = {
    username: string;
    password: string;
    xtoken: string;
  };

  // interface ApplicationWindow {
  // }

  interface Chainable {

    /**
    * Custom command to select DOM element by data-automation-id attribute.
    * @example cy.getBySel('greeting')
   */

    getBySel(dataTestAttribute: string, args?: any): Chainable<Element>;

    /**
    * Custom command to select DOM element which data-automation-id attribute includes a given string.
    * @example cy.getBySelLike('greeting')
   */

    getBySelLike(dataTestPrefixAttribute: string, args?: any): Chainable<Element>;

    // /**
    //  * Gets JWT Token
    //  */
    getLoginToken(username: string, password?: string): Chainable<Response>;

    // /**
    //  * Sets JWT Token
    //  */
    setToken(token: string): void;

    // /**
    //  * Logs-in user by using API request and sets the received JWT cookie 
    //  */
    loginByAPI(username?: string, password?: string): Chainable<any>;


    // /**
    //  * Registers user
    //  */
    registerUser(options?: UserInfo): Chainable<Response>;

    // /**
    //  *  Cypress task for deleting user from database
    //  */
    task(
      event: "db:deleteUser",
      arg: {
        username: string,
        accessKeyId: string,
        secretAccessKey: string,
        region: string
      }
    ): Chainable<any>;

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

    task(
      event: "db:getUser",
      arg: {
        username: string,
        accessKeyId: string,
        secretAccessKey: string,
        region: string
      }
    ): Chainable<any>;

    // /**
    //  *  Cypress task for setting JWT in browser cookie
    //  */

    // task(
    //   event: "user:setJWT",
    //   arg: { username: string }
    // ): void;

  }
}

// declare module 'nanoid' {
//   export default function nanoid(size?: number): string;
// }