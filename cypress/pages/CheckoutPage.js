import BasePage from './BasePage'

class CheckoutPage extends BasePage {
  // ─── Shipping Address Elements ─────────────────────────────────────
  get contactEmail()      { return cy.get('[name="contact.email"]') }
  get fullName()          { return cy.get('[id="field-shippingAddress.full_name"]') }
  get telephone()         { return cy.xpath("//input[@id='field-shippingAddress.telephone']") }
  get addressLabel()      { return cy.get('[id="field-shippingAddress.address_1"]') }
  get addressInput()      { return cy.get('[name="shippingAddress.address_1"]') }
  get city()              { return cy.get('[id="field-shippingAddress.city"]') }
  get countryDropdown()   { return cy.xpath("//button[@id='field-shippingAddress.country']") }
  get provinceDropdown()  { return cy.xpath("//button[@id='field-shippingAddress.province']") }
  get postcode()          { return cy.get('[name="shippingAddress.postcode"]') }

  // ─── Shipping & Payment Elements ───────────────────────────────────
  get shippingMethodRadio() { return cy.get('[role="radio"], input[type="radio"]') }
  get codPaymentOption()    { return cy.get('form').find('div').contains('Cash On Delivery') }
  get creditCardOption()    { return cy.get('form').find('div').contains('Credit Card') }
  get placeOrderButton()    { return cy.xpath('//button[normalize-space()="Place Order"]', { timeout: 15000 }) }

  // ─── Actions ───────────────────────────────────────────────────────

  /**
   * Fill contact email (for guest checkout)
   */
  fillContactEmail(email) {
    this.contactEmail.type(email, { force: true })
  }

  /**
   * Assert pre-filled email (for logged-in user checkout)
   */
  assertPrefilledEmail(email) {
    cy.get('p').contains(email).should('exist')
  }

  /**
   * Select country from dropdown
   */
  selectCountry(countryName = 'United States') {
    this.countryDropdown.click({ force: true })
    cy.get('div.flex.flex-1.whitespace-nowrap').contains(countryName).click({ force: true })
  }

  /**
   * Select province from dropdown (first option)
   */
  selectProvince() {
    this.provinceDropdown.click({ force: true })
    cy.xpath("//div[position()=2]/div[position()=1]/div[position()=1]/div[position()=3]/div[position()=1]").click({ force: true })
  }

  /**
   * ⭐ Composite: Fill entire shipping address form
   * Menggantikan 30+ lines duplikasi di 6 test cases
   */
  fillShippingAddress(data) {
    if (data.email) {
      this.fillContactEmail(data.email)
    }

    this.fullName.scrollIntoView().type(data.fullName, { force: true })
    this.telephone.type(data.phone, { force: true })
    this.addressLabel.type(data.address, { force: true })
    
    this.scrollToBottom()
    
    this.addressInput.type(data.address, { force: true })
    this.city.type(data.city, { force: true })
    
    this.selectCountry(data.country || 'United States')
    this.selectProvince()
    
    this.postcode.type(data.zipCode, { force: true })
    cy.wait(1500)
  }

  /**
   * Select shipping method by index (0 = first option)
   */
  selectShippingMethod(index = 0) {
    this.scrollToBottom()
    this.shippingMethodRadio.eq(index).click({ force: true })
  }

  /**
   * Select Cash On Delivery payment
   */
  selectPaymentCOD() {
    this.scrollToBottom()
    cy.wait(1000)
    this.codPaymentOption.click({ force: true })
  }

  /**
   * Select Credit Card payment
   */
  selectPaymentCreditCard() {
    this.scrollToBottom()
    cy.wait(1000)
    this.creditCardOption.click({ force: true })
    cy.wait(3000) // Wait for Stripe iframe to load
  }

  /**
   * Click Place Order button (COD)
   */
  clickPlaceOrder() {
    this.scrollToBottom()
    cy.wait(1000)
    this.placeOrderButton.click({ force: true })
  }

  /**
   * Click Place Order button (Credit Card / Stripe)
   */
  clickPlaceOrderCreditCard() {
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.xpath('//div/div[4]/button').click({ force: true })
  }

  /**
   * ⭐ Composite: Complete COD checkout dari shipping address sampai place order
   */
  completeCODCheckout(shippingData) {
    this.fillShippingAddress(shippingData)
    this.selectShippingMethod(0)
    cy.wait(1000)
    this.selectPaymentCOD()
    cy.wait(1000)
    this.clickPlaceOrder()
  }
}

export default new CheckoutPage()
