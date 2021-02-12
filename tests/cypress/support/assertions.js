// /**
//  * Assert for checking element visibility within viewport
//  * Usage: cy.get("element").should("be.inViewport");
//  */
const isInViewport = (_chai, utils) => {
    function assertIsInViewport(options) {
  
      const subject = this._obj;
  
      const bottom = Cypress.$(cy.state('window')).height();
      const right = Cypress.$(cy.state('window')).width();
      const rect = subject[0].getBoundingClientRect();
  
      this.assert(
        rect.top > 0 && rect.top < bottom && rect.left > 0 && rect.left < right,
        "expected #{this} to be in viewport",
        "expected #{this} to not be in viewport",
        this._obj
      )
    }
  
    _chai.Assertion.addMethod('inViewport', assertIsInViewport)
  };
  
  chai.use(isInViewport);