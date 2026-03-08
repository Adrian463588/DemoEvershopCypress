import HeaderComponent from '../../pages/HeaderComponent'

describe('Product Browsing & Search', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('TC-007.1: User should search for a product successfully', () => {
    cy.visit('/')
    cy.wait(500)
    
    // Search for a product using HeaderComponent
    HeaderComponent.searchProduct('Stainless Steel Thermos')
    cy.wait(1500)
    
    // Assert product found
    cy.contains('h3', 'Stainless Steel Thermos - Yellow').should('be.visible')
  })
})
