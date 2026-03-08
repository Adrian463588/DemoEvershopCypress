import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  selectors = {
    productTitle: 'h1.product-single-name, h3',
    productPrice: '.product-single-price, .sale-price',
    colorSwatches: 'ul.variant-swatches li a, button[role="radio"]',
    sizeSwatches: 'ul.variant-swatches li a, button[role="radio"]',
    quantityInput: 'input[name="qty"]',
    addToCartBtn: 'button:contains("ADD TO CART"), #product-addtocart-button',
    successToast: 'div.toast-success, span:contains("Just added to your cart")',
  };

  visitProduct(slug) {
    this.visit(`/slug/${slug}`);
  }

  selectColor(colorName) {
    // Relying on text content or aria-label for variants
    cy.contains('button', colorName).click({ force: true });
  }

  selectSize(sizeName) {
    cy.contains('button', sizeName).click({ force: true });
  }

  setQuantity(qty) {
    this.getElement(this.selectors.quantityInput).clear().type(String(qty));
  }

  addToCart() {
    cy.contains('button', 'ADD TO CART').click({ force: true });
  }

  assertSuccessToast() {
    cy.contains('span', 'Just added to your cart', { timeout: 10000 }).should('be.visible');
  }
}
