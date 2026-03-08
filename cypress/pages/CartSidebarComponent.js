import BasePage from './BasePage'

class CartSidebarComponent extends BasePage {
  // ─── Elements ──────────────────────────────────────────────────────
  get checkoutButton() { return cy.xpath('//button[normalize-space()="Checkout"]', { timeout: 15000 }) }

  // ─── Actions ───────────────────────────────────────────────────────
  clickCheckout() {
    cy.wait(3000)
    this.checkoutButton.click({ force: true })
  }

  viewCart(itemCount) {
    cy.xpath(`//button[normalize-space()='View Cart (${itemCount})']`).click({ force: true })
  }
}

export default new CartSidebarComponent()
