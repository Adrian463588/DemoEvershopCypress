import { generateRandomUser } from '../../support/helpers/data-generator'
import HomePage from '../../pages/HomePage'
import ProductDetailPage from '../../pages/ProductDetailPage'
import CartSidebarComponent from '../../pages/CartSidebarComponent'
import CartPage from '../../pages/CartPage'
import CategoryPage from '../../pages/CategoryPage'
import CheckoutPage from '../../pages/CheckoutPage'
import CheckoutSuccessPage from '../../pages/CheckoutSuccessPage'

describe('Checkout - Guest Checkout', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  /**
   * Helper: generate shipping data from random user
   */
  function buildShippingData(includeEmail = true) {
    const guest = generateRandomUser()
    const data = {
      fullName: `${guest.firstName} ${guest.lastName}`,
      phone: guest.phone,
      address: guest.address,
      city: guest.city,
      country: 'United States',
      zipCode: guest.zipCode
    }
    if (includeEmail) data.email = guest.email
    return data
  }

  it('TC-005.1: Flow Add to cart tanpa login - Satu produk dari dashboard', () => {
    HomePage.open()
    cy.wait(500)
    
    // Add product to cart
    HomePage.clickProduct('Stainless Steel Thermos - Yellow')
    cy.wait(1000)
    CheckoutPage.assertUrl('/accessories/stainless-steel-thermos-yellow')
    
    ProductDetailPage.addProductToCart('White', 1)
    cy.wait(1000)
    ProductDetailPage.sidebarOverlay.should('be.visible')
    
    // Proceed to checkout
    CartSidebarComponent.clickCheckout()
    cy.wait(1000)
    CheckoutPage.assertUrl('/checkout')

    // Fill shipping & complete COD checkout
    const shippingData = buildShippingData()
    CheckoutPage.fillShippingAddress(shippingData)
    
    CheckoutPage.selectShippingMethod(0)
    cy.wait(1000)
    CheckoutPage.selectPaymentCOD()
    cy.wait(1000)
    CheckoutPage.clickPlaceOrder()
    cy.wait(2000)
    
    // Assert success
    CheckoutSuccessPage.verifyAndContinue()
  })

  it('TC-005.2: checkout multiple variant dari dashboard', () => {
    HomePage.open()
    cy.wait(500)
    
    HomePage.clickProduct('Stainless Steel Thermos - Yellow')
    cy.wait(1000)
    CheckoutPage.assertUrl('/accessories/stainless-steel-thermos-yellow')
    
    // First variant
    ProductDetailPage.addProductAndContinueShopping('White', 1)
    
    // Second variant
    ProductDetailPage.addAnotherVariant(/(Yellow|Black|Green|Red)/, 1)
    cy.wait(1000)
    
    ProductDetailPage.sidebarOverlay.should('be.visible')
    CartSidebarComponent.clickCheckout()
    cy.wait(1000)
    CheckoutPage.assertUrl('/checkout')

    // Fill shipping & complete COD checkout
    const shippingData = buildShippingData()
    CheckoutPage.fillShippingAddress(shippingData)
    
    CheckoutPage.selectShippingMethod(0)
    cy.wait(1000)
    CheckoutPage.selectPaymentCOD()
    cy.wait(1000)
    CheckoutPage.clickPlaceOrder()
    cy.wait(2000)
    
    CheckoutSuccessPage.assertCheckoutSuccess()
  })

  it('TC-005.3: checkout multiple variant multiple produk dari dashboard', () => {
    HomePage.open()
    cy.wait(500)
    
    // ── Product 1: Stainless Steel Thermos ──
    HomePage.clickProduct('Stainless Steel Thermos - Yellow')
    cy.wait(1000)
    CheckoutPage.assertUrl('/accessories/stainless-steel-thermos-yellow')
    
    ProductDetailPage.addProductAndContinueShopping('White', 1)
    ProductDetailPage.addAnotherVariant(/(Yellow|Black|Green|Red)/, 1)
    cy.wait(1000)
    
    // ── Product 2: Modern Ceramic Vase ──
    HomePage.navigateHome()
    cy.wait(1000)
    HomePage.assertExactUrl('https://demo.evershop.io/')
    
    HomePage.clickProduct('Modern Ceramic Vase - Green')
    cy.wait(1000)
    CheckoutPage.assertUrl('/accessories/modern-ceramic-vase-green')
    
    ProductDetailPage.addProductAndContinueShopping('White', 1)
    ProductDetailPage.addAnotherVariant(/(Yellow|Black|Green|Red)/, 1)
    cy.wait(1000)

    // Proceed to checkout
    ProductDetailPage.sidebarOverlay.should('be.visible')
    CartSidebarComponent.clickCheckout()
    cy.wait(1000)
    CheckoutPage.assertUrl('/checkout')

    // Fill shipping & complete COD checkout
    const shippingData = buildShippingData()
    CheckoutPage.fillShippingAddress(shippingData)
    
    CheckoutPage.selectShippingMethod(0)
    cy.wait(1000)
    CheckoutPage.selectPaymentCOD()
    cy.wait(1000)
    CheckoutPage.clickPlaceOrder()
    cy.wait(2000)
    
    CheckoutSuccessPage.assertCheckoutSuccess()
  })

  it('TC-005.4: User checkout tanpa login barang dari Category page', () => {
    HomePage.open()
    cy.wait(500)
    
    // Navigate to category page
    HomePage.clickViewCollection('/accessories')
    cy.wait(1000)
    CategoryPage.assertExactUrl('https://demo.evershop.io/accessories')
    
    // ── Product 1: Modern Ceramic Vase - White ──
    CategoryPage.clickProduct('Modern Ceramic Vase - White')
    cy.wait(1000)
    ProductDetailPage.addProductAndContinueShopping('White', 1)
    ProductDetailPage.addAnotherVariant(/(Yellow|Black|Green|Red)/, 1)
    cy.wait(1000)
    ProductDetailPage.closeSidebar()
    cy.wait(1500)
    
    // Navigate back to category
    CategoryPage.navigateToCategory('Accessories')
    cy.wait(1000)
    CategoryPage.assertExactUrl('https://demo.evershop.io/accessories')
    
    // ── Product 2: Ceramic Coffee Cup - Yellow ──
    CategoryPage.clickProduct('Ceramic Coffee Cup - Yellow')
    cy.wait(1000)
    CategoryPage.assertExactUrl('https://demo.evershop.io/accessories/ceramic-coffee-cup-yellow')
    
    ProductDetailPage.addProductAndContinueShopping('White', 1)
    ProductDetailPage.addAnotherVariant(/(Yellow|Black|Green|Red)/, 1)
    cy.wait(1000)
    
    // View cart with 4 items
    CartSidebarComponent.viewCart(4)
    cy.wait(1000)
    
    // Verify products in cart
    CartPage.verifyProductInCart('Ceramic Coffee Cup - White')
    CartPage.verifyProductInCart('Ceramic Coffee Cup - Black')
    CartPage.verifyProductInCart('Modern Ceramic Vase - White')
    CartPage.verifyProductInCart('Modern Ceramic Vase - Black')
    
    // Adjust quantities
    CartPage.adjustQuantity(0, 'increment', 5)
    CartPage.adjustQuantity(1, 'increment', 5)
    CartPage.adjustQuantity(0, 'decrement', 2)
    CartPage.adjustQuantity(1, 'decrement', 2)
    
    // Remove one item
    CartPage.removeItem(1)
    cy.wait(1000)
    
    // Proceed to checkout from cart page
    CartPage.clickCheckout()
    cy.wait(1000)
    CheckoutPage.assertUrl('/checkout')
    
    cy.contains('Modern Ceramic Vase').should('be.visible')
    
    // Fill shipping & complete COD checkout
    const shippingData = buildShippingData()
    CheckoutPage.fillShippingAddress(shippingData)
    
    CheckoutPage.selectShippingMethod(0)
    cy.wait(1000)
    CheckoutPage.selectPaymentCOD()
    cy.wait(1000)
    CheckoutPage.clickPlaceOrder()
    cy.wait(2000)
    
    CheckoutSuccessPage.assertCheckoutSuccess()
  })
})
