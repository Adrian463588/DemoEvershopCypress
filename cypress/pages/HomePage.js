import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  selectors = {
    searchIcon: 'a.search-icon',
    searchInput: 'input[placeholder="Search"]',
    productTitles: 'h3, .product-name', // Dynamic selector since Evershop frequently changes classes
  };

  navigateTo() {
    this.visit('/');
  }

  clickSearchIcon() {
    this.getElement(this.selectors.searchIcon).click({ force: true });
  }

  searchFor(keyword) {
    this.clickSearchIcon();
    this.getElement(this.selectors.searchInput).clear().type(`${keyword}{enter}`, { force: true });
  }
}
