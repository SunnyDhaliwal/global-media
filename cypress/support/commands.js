// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

Cypress.Commands.add('addProduct', (searchParam, altTag, size, colour, quantity) => {
  cy.get('#search').type(searchParam + '{enter}')
  cy.get('.wrapper > .products ')
  /* cy.get('.wrapper > .products > :nth-child(1)')          I originally had this but the nth child could potentially change, which is why I went with the second option below using the images ALT value. */
  cy.intercept('**/Magento_Ui/template/messages.html').as('getButtons') //here we intercept one of the last HTML requests made to the page and wait for that to complete - this lets us know that the page has finished loading. 
  cy.get(`[alt= '${altTag}']`).click()
  cy.wait('@getButtons')
  cy.get(`[aria-label='${size}']`).click()
  cy.get(`[aria-label= '${colour}']`).click()
  cy.get('[id=qty]').clear().type(quantity)
  cy.intercept('customer/section/load/**').as('addToCart')
  cy.get('[id=product-addtocart-button]').click()
  cy.wait('@addToCart')
  //lets check the cart

})

Cypress.Commands.add('fillTestCartDetails', () => {
  cy.get('#customer-email').should('be.visible').type('test135@test.com')
  cy.get('[name=firstname').should('be.visible').type('tester')
  cy.get('[name=lastname').should('be.visible').type('Testington')
  cy.get('[name="shippingAddress.street.0"]').type('10 Downing Street')
  cy.get('[name=city').should('be.visible').type('London')
  cy.get('[name=postcode').should('be.visible').type('SW1A 2AA')
  cy.get('[name=country_id').should('be.visible').select('United Kingdom')
  cy.intercept('**/estimate-shipping-methods').as('getShippingMethod')
  cy.get('[name=telephone').should('be.visible').type('07999999999')
  cy.wait('@getShippingMethod') // the shipping method is automatically calculated as it is  a UK address entered 
  cy.contains('Next').click()
})