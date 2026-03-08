import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  selectors = {
    productTitles: 'h3',
  };

  assertHasResults(keyword) {
    cy.get(this.selectors.productTitles).should('have.length.greaterThan', 0);
  }

  assertNoResults() {
    cy.contains('We could not find anything').should('be.visible');
  }
}
