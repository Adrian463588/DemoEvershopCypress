import BasePage from './BasePage'

class RegisterPage extends BasePage {
  // ─── Elements ──────────────────────────────────────────────────────
  get fullNameField()        { return cy.get('#field-full_name') }
  get emailField()           { return cy.get('#field-email') }
  get passwordField()        { return cy.get('#field-password') }
  get createAccountButton()  { return cy.xpath("//button[@data-slot='button']") }
  get createAccountLink()    { return cy.xpath("//a[normalize-space()='Create an account']") }
  get pageTitle()            { return cy.get('h1').contains('Create an account') }

  // ─── Actions ───────────────────────────────────────────────────────
  navigateFromLogin() {
    this.createAccountLink.click()
    this.assertUrl('/account/register')
  }

  fillFullName(name) {
    this.fullNameField.type(name)
  }

  fillEmail(email) {
    this.emailField.type(email)
  }

  fillPassword(password) {
    this.passwordField.type(password)
  }

  clickCreateAccount() {
    this.createAccountButton.click()
  }

  /**
   * Composite: register dengan data lengkap
   */
  register(fullName, email, password) {
    this.fillFullName(fullName)
    this.fillEmail(email)
    this.fillPassword(password)
    this.clickCreateAccount()
  }

  /**
   * Assert validation error message
   */
  getValidationError(message) {
    return cy.xpath(`//div[normalize-space()='${message}']`)
  }
}

export default new RegisterPage()
