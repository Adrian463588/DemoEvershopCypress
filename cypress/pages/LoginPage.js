import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // ── Selectors ───────────────────────────────────────────
  selectors = {
    emailInput:      '[name="email"], [data-testid="email-input"]',
    passwordInput:   '[name="password"], [data-testid="password-input"]',
    submitButton:    '[type="submit"], [data-testid="login-btn"]',
    errorMessage:    '[data-testid="error-msg"], .error-message, .text-critical',
    userNameHeader:  '[data-testid="user-name"], .header-user-name, a[href="/account"]',
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
    this.getElement(this.selectors.submitButton).click();
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
    this.getElement(this.selectors.userNameHeader).should('be.visible');
  }

  assertUserNameVisible() {
    this.getElement(this.selectors.userNameHeader).should('be.visible');
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
