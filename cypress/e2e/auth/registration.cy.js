import { generateRandomUser } from '../../support/helpers/data-generator'
import HeaderComponent from '../../pages/HeaderComponent'
import LoginPage from '../../pages/LoginPage'
import RegisterPage from '../../pages/RegisterPage'
import AccountPage from '../../pages/AccountPage'

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
    HeaderComponent.clickAccountIcon()
    LoginPage.assertUrl('/account/login')
    
    // Navigate to create account
    RegisterPage.navigateFromLogin()
    
    // Assert on registration page
    RegisterPage.pageTitle.should('be.visible')
    
    // Fill registration form & submit
    RegisterPage.register(fullName, newUser.email, newUser.password)
    
    // Assert redirect to home
    RegisterPage.assertExactUrl(Cypress.config().baseUrl + '/')
    
    // Assert logged in
    HeaderComponent.clickAccountIcon()
    AccountPage.assertOnAccountPage()
  })

  it('TC-002.2: should display validation errors on invalid registration', () => {
    // Navigate to registration page
    HeaderComponent.clickAccountIcon()
    RegisterPage.navigateFromLogin()
    
    // Test invalid email error
    RegisterPage.fillEmail('invalid')
    RegisterPage.clickCreateAccount()
    RegisterPage.getValidationError('Please enter a valid email address').should('be.visible')
    
    // Test short password error
    RegisterPage.emailField.clear()
    RegisterPage.fillPassword('123')
    RegisterPage.clickCreateAccount()
    RegisterPage.getValidationError('Password must be at least 6 characters long').should('be.visible')
  })
})
