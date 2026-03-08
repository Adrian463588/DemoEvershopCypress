import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  selectors = {
    logoutBtn: 'a[href="/account/logout"], button:contains("Logout")',
    accountDetails: '.account-details, .customer-info',
    addressBook: '.address-book',
  };

  navigateTo() {
    this.visit('/account');
  }

  logout() {
    this.getElement(this.selectors.logoutBtn).click();
  }
}
