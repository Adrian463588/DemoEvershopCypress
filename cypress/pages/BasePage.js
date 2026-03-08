export class BasePage {
  /**
   * Navigate ke URL relatif
   * @param {string} path
   */
  visit(path = '/') {
    cy.visit(path);
    this.waitForPageLoad();
  }

  waitForPageLoad() {
    cy.document().should('have.property', 'readyState', 'complete');
  }

  /**
   * Generic getter dengan fallback strategy:
   * Priority: data-cy > data-testid > id > class
   */
  getElement(selector) {
    return cy.get(selector);
  }

  getByDataCy(value) {
    return cy.get(`[data-cy="${value}"]`);
  }

  getByDataTestId(value) {
    return cy.get(`[data-testid="${value}"]`);
  }

  /**
   * Intercept API call dan beri alias
   */
  interceptApi(method, url, alias) {
    cy.intercept(method, url).as(alias);
  }

  waitForApi(alias) {
    cy.wait(`@${alias}`);
  }
}
