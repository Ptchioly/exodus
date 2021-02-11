/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

// const sizes = ['iphone-6', 'ipad-2', [1024, 768]] // test viewports, update with relevant ones

// describe(`resolution tests`, () => {
//     sizes.forEach((size) => {
//       it(`displays page properly`, () => {
//           if (Cypress._.isArray(size)) {
//               cy.viewport(size[0], size[1])
//           } else {
//               cy.viewport(size)
//           }
//           cy.visit(`/exodus/`)
//           // asserts go here
//           //also maybe add different orientations
//         })
//     })
// })