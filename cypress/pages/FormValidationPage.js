import { BasePage } from './BasePage';

export class FormValidationPage extends BasePage {
  selectors = {
    formSubmitBtn: 'button[type="submit"]',
    requiredFieldError: 'div:contains("Required"), .field-error',
    emailFormatError: '//div[normalize-space()="Please enter a valid email address"]',
    passwordMismatchError: 'div:contains("Password must be at least 6 characters long")',
  };

  assertRequiredFieldsError() {
    cy.get('.text-critical, .field-error, .error', { timeout: 5000 }).should('be.visible');
  }

  assertEmailFormatError() {
    cy.xpath(this.selectors.emailFormatError).should('be.visible');
  }

  assertPasswordMismatchError() {
    // Note: The feature file says "password mismatch" but the sprint test checks for "at least 6 characters" or mismatch
    // Using the legacy locator for password error
    cy.xpath('//div[normalize-space()="Password must be at least 6 characters long"]', { timeout: 4000 }).should('be.visible');
  }
}
