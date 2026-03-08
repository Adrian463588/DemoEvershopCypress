describe('Product Browsing & Search', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('TC-007.1: User should search for a product successfully', () => {
    // When user in https://demo.evershop.io/
    cy.visit('https://demo.evershop.io/')
    cy.wait(500)
    
    // lalu klik pada cy.get('a.search__icon > svg > circle')
    cy.get('a.search__icon > svg > circle').click({ force: true })
    cy.wait(500)
    
    // klik pada field cy.get('[placeholder="Search"]')
    // lalu cari Stainless Steel Thermos
    // klik enter keyboard
    cy.get('[placeholder="Search"]').type('Stainless Steel Thermos{enter}', { force: true })
    cy.wait(1500)
    
    // assert terdapat cy.get('h3:has-text("Stainless Steel Thermos - Yellow")') -> Cypress syntax adjust
    cy.contains('h3', 'Stainless Steel Thermos - Yellow').should('be.visible')
  })
})
