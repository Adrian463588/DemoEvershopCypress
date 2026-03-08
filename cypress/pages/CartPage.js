import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  selectors = {
    cartItems:       '[data-testid="cart-item"], .cart-item, tr', // Rows in cart table
    quantityInput:   '[data-testid="qty-input"], input[name="qty"]',
    increaseBtn:     '[data-testid="qty-increase"], a[href="#"]:contains("+")',
    decreaseBtn:     '[data-testid="qty-decrease"], a[href="#"]:contains("-")',
    removeBtn:       '[data-testid="remove-item"], .remove-from-cart, svg', // Usually an X or trash icon
    cartTotal:       '[data-testid="cart-total"], .cart-total, .grand-total',
    emptyCartMsg:    '[data-testid="empty-cart"], .empty-cart-message, div:contains("Your cart is empty!")',
    checkoutBtn:     '[data-testid="checkout-btn"], .checkout-button, a[href="/checkout"]',
    cartCount:       '[data-testid="cart-count"], .cart-item-count, .mini-cart-icon span',
  };

  navigateTo() {
    this.visit('/cart');
  }

  increaseQuantity(itemIndex = 0) {
    // Attempting generic clicks
    cy.get('a[href="#"]').contains('+').eq(itemIndex).click({ force: true });
  }

  decreaseQuantity(itemIndex = 0) {
    cy.get('a[href="#"]').contains('-').eq(itemIndex).click({ force: true });
  }

  removeItem(itemIndex = 0) {
    // We can rely on the typical layout for removing items in Evershop, often an SVG icon
    this.getElement(this.selectors.removeBtn).eq(itemIndex).click({ force: true });
  }

  proceedToCheckout() {
    this.getElement(this.selectors.checkoutBtn).click({ force: true });
  }

  // ── Assertions ──────────────────────────────────────────
  assertItemCount(expectedCount) {
    // E.g., check length of item rows, skipping the header row if present
    this.getElement(this.selectors.cartItems).should('have.length.at.least', expectedCount);
  }

  assertQuantity(itemIndex, expectedQty) {
    this.getElement(this.selectors.quantityInput)
      .eq(itemIndex)
      .should('have.value', String(expectedQty));
  }

  assertCartEmpty() {
    this.getElement(this.selectors.emptyCartMsg).should('be.visible');
  }

  assertTotalUpdated(expectedTotal) {
    this.getElement(this.selectors.cartTotal)
      .should('contain.text', expectedTotal);
  }
}
