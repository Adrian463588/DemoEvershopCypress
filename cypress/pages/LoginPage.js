import BasePage from './BasePage'

class LoginPage extends BasePage {
  // ─── Elements ──────────────────────────────────────────────────────
  get emailField()       { return cy.get('#field-email') }
  get passwordField()    { return cy.get('#field-password') }
  get signInButton()     { return cy.contains('Sign In') }
  get pageTitle()        { return cy.contains('Please sign in to your account') }
  get validationError()  { return cy.xpath('//div[@data-slot="field-error"]') }
  get toastError()       { return cy.get('.Toastify__toast-body', { timeout: 10000 }) }

  // ─── Actions ───────────────────────────────────────────────────────
  fillEmail(email) {
    this.emailField.type(email, { force: true })
  }

  fillPassword(password) {
    this.passwordField.type(password, { force: true })
  }

  clickSignIn() {
    this.signInButton.click({ force: true })
  }

  /**
   * Composite: login lengkap dari halaman login
   */
  login(email, password) {
    this.fillEmail(email)
    this.fillPassword(password)
    this.clickSignIn()
  }

  /**
   * Login menggunakan fixture data
   */
  loginWithFixture() {
    cy.fixture('users').then((users) => {
      this.login(users.validUser.email, users.validUser.password)
    })
  }
}

export default new LoginPage()
