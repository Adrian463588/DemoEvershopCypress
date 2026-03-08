import { generateRandomUser } from '../../support/helpers/data-generator'

describe('Authentication - Registration', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('TC-002.1: should register a new account with valid data', () => {
    const newUser = generateRandomUser()
    const fullName = `${newUser.firstName} ${newUser.lastName}`
    
    // Navigate to login page
    cy.get('div.self-center > a > svg').click()
    cy.url().should('include', '/account/login')
    
    // Navigate to create account
    cy.xpath("//a[normalize-space()='Create an account']").click()
    
    // Assert on registration page
    cy.url().should('include', '/account/register')
    cy.get('h1').contains('Create an account').should('be.visible')
    
    // Fill registration form
    cy.get('#field-full_name').type(fullName)
    cy.get('#field-email').type(newUser.email)
    cy.get('#field-password').type(newUser.password)
    
    // Submit
    cy.xpath("//button[@data-slot='button']").click()
    
    // Assert redirect to home
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // Assert logged in
    cy.get('div.self-center > a > svg').click()
    cy.get('h1').contains('My Account').should('be.visible')
    cy.url().should('include', '/account')
  })

  it('TC-002.2: should display validation errors on invalid registration', () => {
    // Navigate to registration page
    cy.get('div.self-center > a > svg').click()
    cy.xpath("//a[normalize-space()='Create an account']").click()
    
    // Test invalid email error
    cy.get('#field-email').type('invalid')
    cy.xpath("//button[@data-slot='button']").click()
    cy.xpath("//div[normalize-space()='Please enter a valid email address']").should('be.visible')
    
    // Test short password error
    cy.get('#field-email').clear()
    cy.get('#field-password').type('123')
    cy.xpath("//button[@data-slot='button']").click()
    cy.xpath("//div[normalize-space()='Password must be at least 6 characters long']").should('be.visible')
  })
})
