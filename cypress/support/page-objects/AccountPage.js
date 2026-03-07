class AccountPage {
  get dashboardTitle() { return cy.get('[data-cy="account-dashboard-title"]') }
  get logoutButton() { return cy.get('[data-cy="logout-btn"]') }

  logout() {
    this.logoutButton.click()
  }
}

export default new AccountPage();
