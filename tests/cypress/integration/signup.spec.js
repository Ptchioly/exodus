/// <reference types="cypress" />

describe('sign up', () => {
    beforeEach(() => {
        // cy.task('cleanDatabase')
        // we are not logged in
        cy.visit('/exodus/')
    })

    it('registers new user', () => { })

})
