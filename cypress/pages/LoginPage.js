import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // ── Selectors ───────────────────────────────────────────
  selectors = {
    emailInput:      '#field-email, [name="email"]',
    passwordInput:   '#field-password, [name="password"]',
    submitButton:    'button[type="submit"], button:contains("SIGN IN")',
    errorMessage:    '.Toastify__toast-body, [data-slot="field-error"]',
    userNameHeader:  'h1:contains("My Account"), a[href="/account"]',
  };

  // ── Actions ─────────────────────────────────────────────
  navigateTo() {
    this.visit('/account/login');
  }

  fillEmail(email) {
    if (email) {
      this.getElement(this.selectors.emailInput).clear().type(email);
    }
  }

  fillPassword(password) {
    if (password) {
      this.getElement(this.selectors.passwordInput).clear().type(password, { log: false });
    }
  }

  submit() {
    cy.contains('SIGN IN', { matchCase: false }).click({ force: true });
  }

  login(email, password) {
    this.navigateTo();
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }

  // ── Assertions ──────────────────────────────────────────
  assertLoginSuccess() {
    cy.url().should('include', '/account');
    cy.contains('h1', 'My Account').should('be.visible');
  }

  assertUserNameVisible() {
    cy.contains('h1', 'My Account').should('be.visible');
  }

  assertLoginFailed() {
    this.getElement(this.selectors.errorMessage)
      .should('be.visible')
      .and('not.be.empty');
  }

  assertOnLoginPage() {
    cy.url().should('include', '/account/login');
  }
}
