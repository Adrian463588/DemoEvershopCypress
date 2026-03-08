import { BasePage } from './BasePage';

export class FormValidationPage extends BasePage {
  selectors = {
    formSubmitBtn: 'button[type="submit"]',
    requiredFieldError: 'div:contains("This field is required"), .field-error',
    emailFormatError: 'div:contains("Invalid email"), .email-error',
    passwordMismatchError: 'div:contains("Passwords do not match"), .password-error',
  };

  assertRequiredFieldsError() {
    // Assert generic validation styling or message
    cy.contains('div', 'Required', { matchCase: false }).should('be.visible');
  }

  assertEmailFormatError() {
    cy.contains('div', 'Invalid email', { matchCase: false }).should('be.visible');
  }

  assertPasswordMismatchError() {
    cy.contains('div', 'Passwords do not match', { matchCase: false }).should('be.visible');
  }
}
