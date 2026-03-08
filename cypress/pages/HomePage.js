import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  selectors = {
    searchIcon: 'a.search__icon > svg > circle, a.search__icon',
    searchInput: '[placeholder="Search"]',
    productTitles: 'h3',
  };

  navigateTo() {
    this.visit('/');
  }

  clickSearchIcon() {
    this.getElement(this.selectors.searchIcon).first().click({ force: true });
  }

  searchProduct(keyword) {
    this.clickSearchIcon();
    this.getElement(this.selectors.searchInput).clear().type(`${keyword}{enter}`, { force: true });
  }
}
