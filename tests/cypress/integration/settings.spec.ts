/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('settings actions', () => {
  before(function() {
    cy.deleteMyUserIfExists()
    cy.waitInCIEnv()
    cy.registerUser()
  })

  beforeEach(() => {
    cy.visit('/')
  })

  it('check telegramm link', () => {
    // cy.getBySel('telegram-button').should('be.visible');
    cy.request({
      method: 'GET',
      url: 'https://t.me/exodus_MonobankBudgetBot'
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).contain('<title>Telegram: Contact @exodus_MonobankBudgetBot</title>')
    })
  })
})
