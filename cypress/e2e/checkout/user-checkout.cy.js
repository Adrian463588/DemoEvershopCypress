import { generateRandomUser } from '../../support/helpers/data-generator'
import HeaderComponent from '../../pages/HeaderComponent'
import LoginPage from '../../pages/LoginPage'
import AccountPage from '../../pages/AccountPage'
import HomePage from '../../pages/HomePage'
import ProductDetailPage from '../../pages/ProductDetailPage'
import CartSidebarComponent from '../../pages/CartSidebarComponent'
import CheckoutPage from '../../pages/CheckoutPage'
import CheckoutSuccessPage from '../../pages/CheckoutSuccessPage'

describe('Checkout - User/Logged In Checkout', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  /**
   * Helper: login and verify account
   */
  function loginAndVerify() {
    cy.visit('/')
    cy.wait(1000)
    HeaderComponent.clickAccountIcon()
    cy.wait(1000)
    
    LoginPage.assertUrl('/account/login')
    LoginPage.pageTitle.should('be.visible')
    
    cy.fixture('users').then((users) => {
      LoginPage.login(users.validUser.email, users.validUser.password)
    })
    
    cy.wait(3000)
    LoginPage.assertExactUrl('https://demo.evershop.io/')
    HeaderComponent.clickAccountIcon()
    cy.wait(2000)
    AccountPage.assertOnAccountPage()
  }

  /**
   * Helper: add thermos to cart and proceed to checkout
   */
  function addThermosAndCheckout() {
    cy.visit('/')
    cy.wait(1000)
    
    HomePage.clickProduct('Stainless Steel Thermos - Yellow')
    cy.wait(1000)
    CheckoutPage.assertUrl('/accessories/stainless-steel-thermos-yellow')
    
    ProductDetailPage.addProductToCart('White', 1)
    cy.wait(2000)
    
    CartSidebarComponent.clickCheckout()
    cy.wait(1000)
    CheckoutPage.assertUrl('/checkout')
  }

  /**
   * Helper: build shipping data (no email — pre-filled for logged-in user)
   */
  function buildShippingData() {
    const guest = generateRandomUser()
    return {
      fullName: `${guest.firstName} ${guest.lastName}`,
      phone: guest.phone,
      address: guest.address,
      city: guest.city,
      country: 'United States',
      zipCode: guest.zipCode
    }
  }

  it('TC-006.1: User (Login) checkout menggunakan email yang pre-filled di form', () => {
    loginAndVerify()
    addThermosAndCheckout()
    
    // Assert email pre-filled
    cy.wait(1000)
    CheckoutPage.assertPrefilledEmail('newuser@gmail.com')
    
    // Fill Shipping Address (no email — already pre-filled)
    const shippingData = buildShippingData()
    CheckoutPage.fillShippingAddress(shippingData)
    
    // Shipping & Payment
    CheckoutPage.selectShippingMethod(0)
    cy.wait(1000)
    CheckoutPage.selectPaymentCOD()
    cy.wait(1000)
    CheckoutPage.clickPlaceOrder()
    
    // Checkout Success
    cy.wait(3000)
    CheckoutSuccessPage.verifyAndContinue()
  })

  it('TC-006.2: User memverifikasi bahwa order tervalidasi terekam ke database profile', () => {
    loginAndVerify()
    addThermosAndCheckout()
    
    cy.wait(1000)
    CheckoutPage.assertPrefilledEmail('newuser@gmail.com')
    
    // Fill Shipping Address
    const shippingData = buildShippingData()
    CheckoutPage.fillShippingAddress(shippingData)
    
    // Shipping & Payment
    CheckoutPage.selectShippingMethod(0)
    cy.wait(1000)
    CheckoutPage.selectPaymentCOD()
    cy.wait(1000)
    CheckoutPage.clickPlaceOrder()
    
    // Checkout Success
    cy.wait(3000)
    CheckoutSuccessPage.assertCheckoutSuccess()
    
    // Grab Order ID and verify in profile
    CheckoutSuccessPage.getOrderId().then((orderText) => {
      const orderId = orderText.trim()
      cy.wait(1000)
      CheckoutSuccessPage.clickContinueShopping()
      cy.wait(2000)
      
      // Navigate to profile
      HeaderComponent.clickAccountIcon()
      cy.wait(2000)
      AccountPage.assertUrl('/account')
      AccountPage.recentOrders.should('exist')
      AccountPage.verifyOrderExists('Stainless Steel Thermos - White')
      
      // Verify order ID in profile
      const profileOrderId = orderId.replace('Order ', 'Order: ')
      AccountPage.verifyOrderId(profileOrderId)
    })
  })
})
