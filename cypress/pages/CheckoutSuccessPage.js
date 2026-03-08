import BasePage from './BasePage'

class CheckoutSuccessPage extends BasePage {
  // ─── Elements ──────────────────────────────────────────────────────
  get successMessage()         { return cy.contains('span', 'Checkout success', { timeout: 15000 }) }
  get orderId()                { return cy.get('span').contains('Order #') }
  get continueShoppingButton() { return cy.get('button[type="button"][title="CONTINUE SHOPPING"]') }

  // ─── Actions ───────────────────────────────────────────────────────
  assertCheckoutSuccess() {
    this.successMessage.should('be.visible')
  }

  getOrderId() {
    return this.orderId.invoke('text')
  }

  clickContinueShopping() {
    this.scrollToBottom()
    this.continueShoppingButton.click({ force: true })
  }

  /**
   * Composite: verify success + klik continue
   */
  verifyAndContinue() {
    this.assertCheckoutSuccess()
    cy.wait(1000)
    this.clickContinueShopping()
  }
}

export default new CheckoutSuccessPage()
