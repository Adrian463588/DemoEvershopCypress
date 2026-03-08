import BasePage from './BasePage'

class ForgotPasswordPage extends BasePage {
  // ─── Elements ──────────────────────────────────────────────────────
  get emailField()         { return cy.get('[name="email"]') }
  get submitButton()       { return cy.get('button[type="submit"]') }
  get resetPasswordLink()  { return cy.get('a[href*="/account/reset-password"]') }

  // ─── Actions ───────────────────────────────────────────────────────
  navigateFromLogin() {
    this.resetPasswordLink.click()
    this.assertUrl('/account/reset-password')
  }

  fillEmail(email) {
    this.emailField.type(email)
  }

  submitResetPassword(email) {
    this.fillEmail(email)
    this.submitButton.click()
  }
}

export default new ForgotPasswordPage()
