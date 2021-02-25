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

  it('edits limit with setter (drag and drop)', () => {
    cy.getBySel(`limit-button`)
      .first()
      .click()
    cy.getBySel(`limit-setter`)
      .first()
      .then($limit => {
        const limit = $limit.attr('data-value')
        cy.getBySel(`limit-setter`)
          .first()
          .trigger('mousedown', { button: 0 })
          .trigger('mousemove', { clientX: 500 })
          .trigger('mouseup')
          .should('have.attr', 'data-value')
          .and('not.equal', limit)
      })
  })

  it('creates a budget for category', () => {
    cy.getBySel('unbudgeted-categories', { timeout: 80000 }).click()
    cy.contains('Unbudgeted').should('not.exist')
    cy.getBySel('category-title-unbudgeted')
      .first()
      .then($category => {
        const name = $category.text()
        cy.getBySel('category-title-unbudgeted')
          .first()
          .click()
        cy.getBySel(`category-title-budgeted`)
          .contains(name)
          .should('be.visible')
      })
  })

// it('deletes a budget for category', () => {
// })

// it('shows a budget info from previous month', () => {
// })

})
