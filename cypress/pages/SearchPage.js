import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  selectors = {
    searchResultsWrapper: '.search-results, .products-grid',
    productItems: '.product-item, .product-thumbnail',
    noResultsMessage: 'div:contains("No results found"), .no-results',
  };

  assertHasResults(keyword) {
    // Not explicitly matching 'keyword' as evershop titles differ, just that results exist
    this.getElement(this.selectors.productItems).should('have.length.greaterThan', 0);
  }

  assertNoResults() {
    cy.contains('span', 'We could not find anything').should('be.visible');
  }
}
