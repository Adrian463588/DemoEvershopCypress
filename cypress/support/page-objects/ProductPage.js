class ProductPage {
  get productTitle() { return cy.get('[data-cy="product-title"]') }
  get productPrice() { return cy.get('[data-cy="product-price"]') }
  get addToCartButton() { return cy.get('[data-cy="add-to-cart-btn"]') }
  
  addToCart() {
    this.addToCartButton.click()
  }
}

export default new ProductPage();
