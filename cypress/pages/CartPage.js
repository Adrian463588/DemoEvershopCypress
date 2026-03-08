import BasePage from './BasePage'

class CartPage extends BasePage {
  // ─── Elements ──────────────────────────────────────────────────────
  get checkoutButton() { return cy.get('button[type="button"][title="CHECKOUT"]') }
  get tableRows()      { return cy.get('table tbody tr') }

  // ─── Actions ───────────────────────────────────────────────────────
  verifyProductInCart(productName) {
    cy.contains('td', productName).parent('tr').should('exist')
  }

  incrementItem(rowIndex) {
    this.tableRows.eq(rowIndex).contains('+').click({ force: true })
  }

  decrementItem(rowIndex) {
    this.tableRows.eq(rowIndex).contains('-').click({ force: true })
  }

  removeItem(rowIndex) {
    this.tableRows.eq(rowIndex).find('a').contains('Remove').click({ force: true })
  }

  clickCheckout() {
    this.checkoutButton.click({ force: true })
  }

  /**
   * Adjust quantity: increment or decrement item multiple times
   */
  adjustQuantity(rowIndex, action, times) {
    for (let i = 0; i < times; i++) {
      if (action === 'increment') {
        this.incrementItem(rowIndex)
      } else {
        this.decrementItem(rowIndex)
      }
      cy.wait(500)
    }
  }
}

export default new CartPage()
