/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('sign up', () => {
  before(function() {
    cy.waitInCIEnv()
    cy.deleteMyUserIfExists()
    cy.registerUserbyAPI()
  })

  beforeEach(() => {
    cy.clearCookies()
    cy.loginByAPI()
    cy.visit('/')
  })

// it('edits limit with input', () => {
// })

// it('edits limit with setter (drag and drop)', () => {
// })

  it('creates a budget for category', () => {
    cy.getBySel('unbudgeted-categories', { timeout: 80000 }).click()
    cy.get(`div[class*="flex-wrap justify-center"]`).should('be.visible')
    cy.getBySel('category-title')
      .first()
      .then(($category) => {
        const name = $category.text()
        cy.getBySel('category-title-unbudgeted')
          .first()
          .click()
        cy.getBySel(`category-title-budgeted`)
          .contains(name)
          .should('have.text', name)
      })
})

// it('deletes a budget for category', () => {
// })

// it('shows a budget info from previous month', () => {
// })

})
