import HeaderComponent from '../../pages/HeaderComponent'
import LoginPage from '../../pages/LoginPage'
import AccountPage from '../../pages/AccountPage'

describe('Authentication - Logout', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Login first
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.email, users.validUser.password)
    })
    
    cy.wait(2000)
    cy.visit('/')
    cy.wait(2000)
  })

  it('TC-003.1: should logout successfully', () => {
    // Assert on home
    AccountPage.assertExactUrl(Cypress.config().baseUrl + '/')
    
    // Navigate to account
    HeaderComponent.clickAccountIcon()
    cy.wait(2000)
    AccountPage.assertOnAccountPage()
    
    // Logout
    AccountPage.logout()
    cy.wait(2000)
    
    // Assert redirect to home
    AccountPage.assertExactUrl(Cypress.config().baseUrl + '/')
    
    // Verify logged out state when clicking account icon
    HeaderComponent.clickAccountIcon()
    cy.wait(2000)
    LoginPage.assertUrl('/account/login')
    LoginPage.pageTitle.should('be.visible')
  })
})
