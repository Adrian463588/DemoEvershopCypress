//HIDUP JOKOWI 

import HeaderComponent from '../../pages/HeaderComponent'
import LoginPage from '../../pages/LoginPage'
import AccountPage from '../../pages/AccountPage'

describe('Authentication - Login', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
    cy.wait(1000)
  })

  it('TC-001.1: should login with valid credentials', () => {
    // Navigate to login
    HeaderComponent.clickAccountIcon()
    cy.wait(1000)
    
    // Assert on login page
    LoginPage.assertUrl('/account/login')
    LoginPage.pageTitle.should('be.visible')
    
    // Fill credentials & submit
    cy.fixture('users').then((users) => {
      LoginPage.login(users.validUser.email, users.validUser.password)
    })
    cy.wait(3000)
    
    // Wait for redirect to home
    LoginPage.assertExactUrl(Cypress.config().baseUrl + '/')
    
    // Assert logged in
    HeaderComponent.clickAccountIcon()
    cy.wait(2000)
    AccountPage.assertOnAccountPage()
  })

  it('TC-001.2: should display error message on invalid login', () => {
    // Navigate to login
    HeaderComponent.clickAccountIcon()
    cy.wait(1000)
    
    // Fill credentials
    cy.fixture('users').then((users) => {
      LoginPage.login(users.invalidUser.email, users.invalidUser.password)
    })
    cy.wait(1000)
    
    // Check validation error
    LoginPage.validationError.should('be.visible').and('contain.text', 'Password must be at least 6 characters long')
  })

  it('TC-001.3: should display toast error on invalid credentials', () => {
    // Navigate to login
    HeaderComponent.clickAccountIcon()
    cy.wait(1000)
    
    // Fill credentials
    LoginPage.login('newuser@gmail.com', 'ValidPass12345454554')
    cy.wait(2000)
    
    // Check validation error
    LoginPage.toastError.should('have.text', 'Invalid email or password')
  })
})
