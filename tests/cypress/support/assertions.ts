/// <reference types="cypress" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./index.d.ts" />

// /**
//  * Assert for checking element visibility within viewport
//  * Usage: cy.get("element").should("be.inViewport");
//  */
const isInViewport = _chai => {
  function assertIsInViewport() {
    const subject = this._obj
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const bottom = Cypress.$(cy.state('window')).height()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const right = Cypress.$(cy.state('window')).width()
    const rect = subject[0].getBoundingClientRect()

    this.assert(
      rect.top > 0 && rect.top < bottom && rect.left > 0 && rect.left < right,
      'expected #{this} to be in viewport',
      'expected #{this} to not be in viewport',
      this._obj
    )
  }

  _chai.Assertion.addMethod('inViewport', assertIsInViewport)
}

chai.use(isInViewport)
