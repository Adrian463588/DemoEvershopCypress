class HomePage {
  visit() {
    cy.visit('/')
  }

  get searchInput() { return cy.get('[data-cy="search-input"]') }
  
  search(keyword) {
    this.searchInput.type(`${keyword}{enter}`)
  }
}

export default new HomePage();
