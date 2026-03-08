import BasePage from './BasePage'

class ProductDetailPage extends BasePage {
  // ─── Elements ──────────────────────────────────────────────────────
  get qtyInput()        { return cy.get('#field-qty') }
  get addToCartButton() { return cy.xpath('//button[normalize-space()="ADD TO CART"]') }
  get sidebarOverlay()  { return cy.get('[data-slot="sheet-overlay"]', { timeout: 15000 }) }

  // ─── Actions ───────────────────────────────────────────────────────
  selectVariant(color) {
    cy.xpath(`//button[normalize-space()="${color}"]`).click({ force: true })
    cy.wait(1000)
  }

  setQuantity(qty) {
    this.qtyInput.clear({ force: true }).type(String(qty), { force: true })
    cy.wait(500)
  }

  clickAddToCart() {
    cy.wait(1000)
    this.addToCartButton.click({ force: true })
    cy.wait(3000) // Wait for sidebar/cart API to respond
  }

  closeSidebar() {
    cy.wait(1000)
    cy.get('[data-slot="sheet-overlay"]', { timeout: 15000 }).click({ force: true })
    cy.wait(2000) // Wait for sidebar close animation
  }

  /**
   * Composite: pilih variant, set qty, add to cart
   */
  addProductToCart(color, qty = 1) {
    this.selectVariant(color)
    this.setQuantity(qty)
    this.clickAddToCart()
  }

  /**
   * Composite: add to cart lalu tutup sidebar (untuk lanjut belanja)
   */
  addProductAndContinueShopping(color, qty = 1) {
    this.addProductToCart(color, qty)
    this.closeSidebar()
  }

  /**
   * Add variant kedua setelah variant pertama (tanpa tutup sidebar di akhir)
   */
  addAnotherVariant(colorPattern = /(Yellow|Black|Green|Red)/, qty = 1) {
    cy.contains('button', colorPattern).click({ force: true })
    cy.wait(1000)
    this.setQuantity(qty)
    this.clickAddToCart()
  }
}

export default new ProductDetailPage()
