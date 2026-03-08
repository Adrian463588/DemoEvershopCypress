import BasePage from './BasePage'

class CategoryPage extends BasePage {
  // ─── Actions ───────────────────────────────────────────────────────
  clickProduct(productName) {
    cy.contains('h3', productName).scrollIntoView()
    cy.contains('h3', productName).click({ force: true })
  }

  navigateToCategory(categoryName) {
    cy.contains('a', categoryName).click({ force: true })
  }
}

export default new CategoryPage()
