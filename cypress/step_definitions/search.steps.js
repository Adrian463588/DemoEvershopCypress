import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';

const homePage = new HomePage();
const searchPage = new SearchPage();

Given('User berada di homepage', () => {
  homePage.navigateTo();
  cy.wait(1000);
});

When('User mengetik {string} di search box', (keyword) => {
  homePage.clickSearchIcon();
  homePage.getElement(homePage.selectors.searchInput).clear().type(keyword, { force: true });
});

When('User menekan Enter atau mengklik Search', () => {
  homePage.getElement(homePage.selectors.searchInput).type('{enter}', { force: true });
  cy.wait(2000);
});

Then('Halaman search results ditampilkan', () => {
  cy.url().should('include', '/search');
});

Then('Results mengandung produk yang relevan dengan {string}', (keyword) => {
  searchPage.assertHasResults(keyword);
});

Then('Pesan "No results found" ditampilkan', () => {
  searchPage.assertNoResults();
});
