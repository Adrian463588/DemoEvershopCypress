// Cypress commands for EverShop

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/account/login')
  cy.wait(1000)
  cy.get('#field-email').type(email, { force: true })
  cy.wait(500)
  cy.get('#field-password').type(password, { force: true })
  cy.wait(500)
  cy.contains('Sign In').click({ force: true })
  cy.wait(3000)
  cy.url({ timeout: 10000 }).should('not.include', '/login')
})

Cypress.Commands.add('addToCart', (productName) => {
  cy.contains(productName).click()
  // This will need to be updated with correct selectors later
  cy.get('button').contains(/add to cart/i).click() 
})
