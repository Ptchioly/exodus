/// <reference types="cypress" />

declare namespace Cypress {


  type UserInfo = {
    username: string;
    password: string;
    xtoken: string;
  };


  type UserItem = {
    Item: {
      id: string;
      key: string;
      username: string;
      password: string;
      xtoken: string;
      telegramId?: string;
    }
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
    //  * Get JWT Token
    //  */
    getLoginToken(username: string, password?: string): Chainable<string>;

    // /**
    //  * logs in using XHR call and sets the received JWT cookie 
    //  */
    login(username?: string, password?: string): Chainable<any>;

    // /**
    //  * Registers user
    //  */
    registerUser(options?: UserInfo): Chainable<any>;

    // /**
    //  *  Cypress task for deleting user from database
    //  */
    task(
      event: "db:deleteUser",
      arg: { user: string }
    ): Chainable<any>;

    // /**
    //  *  Cypress task for creating user in database
    //  */

    task(
      event: "db:createUser",
      arg: { user: string, password: string }
    ): Chainable<any>;

    // /**
    //  *  Cypress task for quering user from database
    //  */

    task(
      event: "db:getUser",
      arg: { user: string }
    ): Promise<UserItem>;

    // /**
    //  *  Cypress task for setting JWT in browser cookie
    //  */

    task(
      event: "user:setJWT",
      arg: { username: string }
    ): void;

  }
}

// declare module 'nanoid' {
//   export default function nanoid(size?: number): string;
// }