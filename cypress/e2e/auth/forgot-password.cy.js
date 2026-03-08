import HeaderComponent from '../../pages/HeaderComponent'
import LoginPage from '../../pages/LoginPage'
import ForgotPasswordPage from '../../pages/ForgotPasswordPage'

describe('Authentication - Forgot Password', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('TC-004.1: should verify forgot password flow and display error', () => {
    // Navigate to login
    HeaderComponent.clickAccountIcon()
    LoginPage.assertUrl('/account/login')
    LoginPage.pageTitle.should('be.visible')
    
    // Navigate to forgot password
    ForgotPasswordPage.navigateFromLogin()
    
    // Fill email & submit
    cy.fixture('users').then((users) => {
      ForgotPasswordPage.submitResetPassword(users.validUser.email)
    })

    // PASTI ERROR DARI SISTEM, DAN TIDAK BERHASIL 
    
    // Assert error toast for forgot password
    ForgotPasswordPage.toastMessage.should('be.visible')
  })
})
