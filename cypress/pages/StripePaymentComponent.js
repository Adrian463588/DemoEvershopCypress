import BasePage from './BasePage'

class StripePaymentComponent extends BasePage {
  // ─── Config ────────────────────────────────────────────────────────
  get iframeSelector() { return 'iframe[title="Secure payment input frame"]' }

  // ─── Elements (inside iframe) ──────────────────────────────────────
  get cardNumber() { return cy.iframe(this.iframeSelector).find('#payment-numberInput') }
  get expiry()     { return cy.iframe(this.iframeSelector).find('#payment-expiryInput') }
  get cvc()        { return cy.iframe(this.iframeSelector).find('#payment-cvcInput') }
  get country()    { return cy.iframe(this.iframeSelector).find('#payment-countryInput') }
  get postalCode() { return cy.iframe(this.iframeSelector).find('#payment-postalCodeInput') }

  // ─── Actions ───────────────────────────────────────────────────────

  /**
   * Wait for Stripe iframe to be fully loaded
   */
  waitForIframe() {
    cy.get(this.iframeSelector, { timeout: 15000 }).should('exist')
    cy.wait(2000)
    cy.frameLoaded(this.iframeSelector)
    cy.wait(2000)
  }

  /**
   * ⭐ Composite: fill semua card fields di dalam Stripe iframe
   */
  fillCard(cardData) {
    this.waitForIframe()

    // Card number
    this.cardNumber.type(cardData.number, { force: true })
    cy.wait(500)

    // Expiry date
    this.expiry.type(cardData.expiry || '12/29', { force: true })
    cy.wait(500)

    // CVC
    this.cvc.type(cardData.cvc || '242', { force: true })
    cy.wait(500)

    // Country
    this.country.select(cardData.country || 'US', { force: true })
    cy.wait(500)

    // Postal code
    this.postalCode.type(cardData.postalCode || '12345', { force: true })
    cy.wait(1000)
  }

  /**
   * Fill with valid test card
   */
  fillValidCard() {
    this.fillCard({
      number: '4242424242424242',
      expiry: '12/29',
      cvc: '242',
      country: 'US',
      postalCode: '12345'
    })
  }

  /**
   * Fill with declined test card
   */
  fillDeclinedCard() {
    this.fillCard({
      number: '4000000000009995',
      expiry: '12/29',
      cvc: '242',
      country: 'US',
      postalCode: '12345'
    })
  }
}

export default new StripePaymentComponent()
