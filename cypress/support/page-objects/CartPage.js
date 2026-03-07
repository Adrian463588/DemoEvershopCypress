class CartPage {
  get cartItems() { return cy.get('[data-cy="cart-item"]') }
  get cartTotal() { return cy.get('[data-cy="cart-total"]') }
  get checkoutButton() { return cy.get('[data-cy="checkout-btn"]') }
  
  removeItem(productName) {
    cy.contains(productName)
      .parents('[data-cy="cart-item"]')
      .find('[data-cy="remove-btn"]')
      .click()
  }
}

export default new CartPage();
