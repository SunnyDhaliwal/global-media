describe('Global Media tests', () => {

    beforeEach(() => {
        cy.intercept('**/content.html').as('loadHomepage') // check for the last thing to load as the page loaded - this helps us to let the page load without using a wait 
        cy.visit('')
        cy.wait('@loadHomepage')

    })
    it('Check we can add our products and the correct discounts apply', () => {        // First test stated, steps below will be run.

        cy.addProduct('Gwyn Endurance Tee', 'Gwyn Endurance Tee', 'M', 'Green', '4') // available in the commands.js file
        cy.get('.counter-number').should('have.text', '4').click()
        cy.get('[class="minicart-items"]').should('be.visible') // check that the product details have loaded onto the minicart
        // at this point this discount is not applied, lets get to the checkout and see if any offers apply
        cy.intercept('**/price.html').as('checkoutPage')
        cy.get('[id=top-cart-btn-checkout]').click()
        cy.wait('@checkoutPage')
        //lets fill in the details needed for the customer to checkout 
        cy.fillTestCartDetails() //available in the commands.js file
        // now we are onto the order summary page we can check that the discount is applied
        cy.get('.totals.discount > .amount > .price').should('have.text', '-$24.00')
        // the discount is applied if this is visible
        cy.log("$24.00 discount is applied")
        cy.get('.amount > strong').should('have.text', '$92.00') // if this goes through then it means the correct amount is visible
        // we need to go back to the homepage in order to update the amount of TShirts 
        cy.intercept('**/totals.html').as('reloadHomepage')
        cy.visit('')
        cy.wait('@reloadHomepage')
        cy.get('.counter-number').should('have.text', '4').click()
        cy.get('[id=minicart-content-wrapper]').should('be.visible')
        cy.get('[class="item-qty cart-item-qty"]').clear().type(3)
        cy.get('[class="update-cart-item"]').click()
        cy.contains('$72.00') // if this yields successfull then it means the cart has updated 
        cy.get('[class="action close"]').click()
        //lets add the next product 
        cy.addProduct('Gwyn Endurance Tee', 'Gwyn Endurance Tee', 'S', 'Yellow', '1')
        cy.get('.counter-number').should('have.text', '4').click()
        cy.get('[class="minicart-items"]').should('be.visible')
        //lets add the last item
        cy.get('#search').click().type('Quest Lumaflex™ Band {enter}')
        cy.get('.wrapper > .products ')
        cy.intercept('**/Magento_Ui/template/messages.html').as('getButtons') //here we intercept one of the last HTML requests made to the page and wait for that to complete - this lets us know that the page has finished loading. 
        cy.get('[alt="Quest Lumaflex™ Band"]').click()
        cy.wait('@getButtons')
        cy.intercept('customer/section/load/**').as('addToCart')
        cy.get('[id=product-addtocart-button]').click()
        cy.wait('@addToCart')
        cy.get('.counter-number').should('have.text', '5').click()
        cy.get('[id=minicart-content-wrapper]').should('be.visible')
        cy.contains('$115.00') // if this yields successfull then it means the cart has updated I couldnt get this to $116.00 at all 
























    })

})