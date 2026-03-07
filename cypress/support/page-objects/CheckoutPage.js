class CheckoutPage {
  get emailInput() { return cy.get('[data-cy="checkout-email"]') }
  get firstNameInput() { return cy.get('[data-cy="checkout-first-name"]') }
  get lastNameInput() { return cy.get('[data-cy="checkout-last-name"]') }
  get addressInput() { return cy.get('[data-cy="checkout-address"]') }
  get cityInput() { return cy.get('[data-cy="checkout-city"]') }
  get postcodeInput() { return cy.get('[data-cy="checkout-postcode"]') }
  get telephoneInput() { return cy.get('[data-cy="checkout-telephone"]') }
  get submitButton() { return cy.get('[data-cy="submit-checkout"]') }

  fillShippingInfo(data) {
    this.emailInput.type(data.email)
    this.firstNameInput.type(data.firstName)
    this.lastNameInput.type(data.lastName)
    this.addressInput.type(data.address)
    this.cityInput.type(data.city)
    this.postcodeInput.type(data.postcode)
    this.telephoneInput.type(data.telephone)
  }
}

export default new CheckoutPage();
