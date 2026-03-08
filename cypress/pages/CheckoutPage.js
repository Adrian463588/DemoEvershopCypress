import { BasePage } from './BasePage';
import { generateRandomUser } from '../support/helpers/data-generator';

export class CheckoutPage extends BasePage {
  selectors = {
    emailInput: '[name="contact.email"], #checkout-email',
    fullNameInput: '[id="field-shippingAddress.full_name"], [name="shippingAddress.full_name"]',
    telephoneInput: '//input[@id="field-shippingAddress.telephone"]', 
    address1Input: '[id="field-shippingAddress.address_1"], [name="shippingAddress.address_1"]',
    cityInput: '[id="field-shippingAddress.city"], [name="shippingAddress.city"]',
    countrySelect: '//button[@id="field-shippingAddress.country"]',
    provinceSelect: '//button[@id="field-shippingAddress.province"]',
    postcodeInput: '[name="shippingAddress.postcode"]',
    shippingMethodRadio: '[role="radio"], input[type="radio"]',
    paymentMethodRadio: 'form div:contains("Credit Card"), input[value="credit_card"]',
    placeOrderBtn: '//div/div[4]/button', // Specific xpath from previous tests
    successMessage: 'span:contains("Checkout success")',
    iframeSelector: 'iframe[title="Secure payment input frame"]'
  };

  navigateTo() {
    this.visit('/checkout');
  }

  fillGuestShippingInfo(user = generateRandomUser()) {
    const fullName = `${user.firstName} ${user.lastName}`;
    this.getElement(this.selectors.emailInput).type(user.email, { force: true });
    this.getElement(this.selectors.fullNameInput).first().scrollIntoView().type(fullName, { force: true });
    cy.xpath(this.selectors.telephoneInput).type(user.phone, { force: true });
    this.getElement(this.selectors.address1Input).first().type(user.address, { force: true });
    this.getElement(this.selectors.cityInput).type(user.city, { force: true });

    // Assuming US
    cy.xpath(this.selectors.countrySelect).click({ force: true });
    cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click({ force: true });
    
    // Select first province
    cy.xpath(this.selectors.provinceSelect).click({ force: true });
    cy.xpath('//div[position()=2]/div[position()=1]/div[position()=1]/div[position()=3]/div[position()=1]').click({ force: true });

    this.getElement(this.selectors.postcodeInput).type(user.zipCode, { force: true });
  }

  selectStandardShipping() {
    this.getElement(this.selectors.shippingMethodRadio).first().click({ force: true });
    cy.wait(1000);
  }

  selectCreditCardPayment() {
    cy.get('form').find('div').contains('Credit Card').click({ force: true });
    cy.wait(2000);
  }

  fillStripeIframe(cardNumber, expiry = '04/26', cvc = '242', zip = '12345') {
    cy.get(this.selectors.iframeSelector, { timeout: 15000 }).should('exist');
    cy.frameLoaded(this.selectors.iframeSelector);

    cy.iframe(this.selectors.iframeSelector).find('#payment-numberInput').type(cardNumber, { force: true });
    cy.iframe(this.selectors.iframeSelector).find('#payment-expiryInput').type(expiry, { force: true });
    cy.iframe(this.selectors.iframeSelector).find('#payment-cvcInput').type(cvc, { force: true });
    cy.iframe(this.selectors.iframeSelector).find('#payment-countryInput').select('US', { force: true });
    cy.iframe(this.selectors.iframeSelector).find('#payment-postalCodeInput').type(zip, { force: true });
  }

  placeOrder() {
    cy.xpath(this.selectors.placeOrderBtn).last().click({ force: true });
  }

  assertCheckoutSuccess() {
    // If intercepting and redirecting manually:
    cy.contains('span', 'Checkout success', { timeout: 30000 }).should('be.visible');
  }

  assertOrderNumberGenerated() {
    // Assert order number format on success page
    cy.contains(/Order #\s*\d+/i).should('be.visible');
  }
}
