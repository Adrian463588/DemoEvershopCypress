// Cypress commands for EverShop

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/account/login')
  cy.get('#field-email').type(email)
  cy.get('#field-password').type(password)
  cy.contains('Sign In').click()
  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('addToCart', (productName) => {
  cy.contains(productName).click()
  // This will need to be updated with correct selectors later
  cy.get('button').contains(/add to cart/i).click() 
})

