import { generateRandomUser } from '../../support/helpers/data-generator'

describe('Checkout - User/Logged In Checkout', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('TC-006.1: User (Login) checkout menggunakan email yang pre-filled di form', () => {
    // Navigate to homepage
    cy.visit('https://demo.evershop.io/')
    cy.wait(1000)
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.wait(1000)
    
    // Assert login page
    cy.url().should('include', 'https://demo.evershop.io/account/login')
    cy.contains('Please sign in to your account').should('be.visible')
    
    cy.fixture('users').then((users) => {
      cy.get('#field-email').type(users.validUser.email, { force: true })
      cy.wait(500)
      cy.get('#field-password').type(users.validUser.password, { force: true })
      cy.wait(500)
    })
    cy.contains('Sign In').click({ force: true })
    
    // Wait for login and navigate to account page
    cy.wait(3000)
    cy.url({ timeout: 10000 }).should('eq', 'https://demo.evershop.io/')
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.wait(2000)
    cy.get('h1').contains("My Account").should('be.visible')
    cy.url().should('include', 'https://demo.evershop.io/account')
    
    // Navigate back to product and add to cart
    cy.visit('https://demo.evershop.io/')
    cy.wait(1000)
    cy.contains('h3', 'Stainless Steel Thermos - Yellow').scrollIntoView()
    cy.wait(500)
    cy.contains('h3', 'Stainless Steel Thermos - Yellow').click({ force: true })
    cy.wait(1000)
    cy.url().should('include', 'https://demo.evershop.io/accessories/stainless-steel-thermos-yellow')
    cy.contains('button', 'White').click({ force: true })
    cy.wait(500)
    cy.get('[name="qty"]').clear({ force: true }).type('1', { force: true })
    cy.wait(500)
    cy.contains('button', 'ADD TO CART').click({ force: true })
    cy.wait(2000)
    
    // Assert Side Bar and proceed to checkout (use text-based selector instead of dynamic #mui-5)
    cy.xpath("//button[normalize-space()='Checkout']", { timeout: 10000 }).should('be.visible')
    cy.xpath("//button[normalize-space()='Checkout']").click({ force: true })
    cy.wait(1000)
    cy.url().should('include', 'https://demo.evershop.io/checkout')
    
    // Assert email pre-filled handling
    cy.wait(1000)
    cy.get('p').contains('newuser@gmail.com').should('exist')
    
    // Fill Shipping Address
    const guest = generateRandomUser()
    const fullName = `${guest.firstName} ${guest.lastName}`
    
    cy.get('[id="field-shippingAddress.full_name"]').scrollIntoView().type(fullName, { force: true })
    cy.wait(500)
    cy.xpath("//input[@id='field-shippingAddress.telephone']").type(guest.phone, { force: true })
    cy.wait(500)
    cy.get('[id="field-shippingAddress.address_1"]').type(guest.address, { force: true })
    cy.wait(500)
    cy.scrollTo('bottom')
    cy.wait(500)
    cy.get('[name="shippingAddress.address_1"]').type(guest.address, { force: true })
    cy.wait(500)
    cy.get('[id="field-shippingAddress.city"]').type(guest.city, { force: true })
    cy.wait(500)
    
    // Dropdowns
    cy.xpath("//button[@id='field-shippingAddress.country']").click({ force: true })
    cy.wait(500)
    cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click({ force: true })
    cy.wait(500)
    
    cy.xpath("//button[@id='field-shippingAddress.province']").click({ force: true })
    cy.wait(500)
    cy.xpath("//div[position()=2]/div[position()=1]/div[position()=1]/div[position()=3]/div[position()=1]").click({ force: true })
    cy.wait(500)
    
    cy.get('[name="shippingAddress.postcode"]').type(guest.zipCode, { force: true })
    cy.wait(1500)
    
    // Shipping method and Payment
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.get('[role="radio"], input[type="radio"]').eq(0).click({ force: true })
    cy.wait(1000)
    cy.scrollTo('bottom')
    cy.wait(1000)
    // Payment Method
    cy.get('form').find('div').contains('Cash On Delivery').click({ force: true })
    cy.wait(1000)
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.xpath('//div/div[4]/button').last().click({ force: true })
    
    // Checkout Success Phase
    cy.wait(3000)
    cy.contains('span', 'Checkout success', { timeout: 15000 }).should('be.visible')
    cy.wait(1000)
    cy.scrollTo('bottom')
    cy.wait(500)
    cy.get('button[type="button"][title="CONTINUE SHOPPING"]').click({ force: true })
    cy.wait(500)
  })

  it('TC-006.2: User memverifikasi bahwa order tervalidasi terekam ke database profile', () => {
    // Navigate to homepage
    cy.visit('https://demo.evershop.io/')
    cy.wait(1000)
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.wait(1000)
    
    // Assert login page
    cy.url().should('include', 'https://demo.evershop.io/account/login')
    cy.contains('Please sign in to your account').should('be.visible')
    
    cy.fixture('users').then((users) => {
      cy.get('#field-email').type(users.validUser.email, { force: true })
      cy.wait(500)
      cy.get('#field-password').type(users.validUser.password, { force: true })
      cy.wait(500)
    })
    cy.contains('Sign In').click({ force: true })
    
    // Wait for login and navigate to account page
    cy.wait(3000)
    cy.url({ timeout: 10000 }).should('eq', 'https://demo.evershop.io/')
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.wait(2000)
    cy.get('h1').contains("My Account").should('be.visible')
    cy.url().should('include', 'https://demo.evershop.io/account')
    
    // Navigate back to product and add to cart
    cy.visit('https://demo.evershop.io/')
    cy.wait(1000)
    cy.contains('h3', 'Stainless Steel Thermos - Yellow').scrollIntoView()
    cy.wait(500)
    cy.contains('h3', 'Stainless Steel Thermos - Yellow').click({ force: true })
    cy.wait(1000)
    cy.url().should('include', 'https://demo.evershop.io/accessories/stainless-steel-thermos-yellow')
    cy.contains('button', 'White').click({ force: true })
    cy.wait(500)
    cy.get('[name="qty"]').clear({ force: true }).type('1', { force: true })
    cy.wait(500)
    cy.contains('button', 'ADD TO CART').click({ force: true })
    cy.wait(2000)
    
    // Assert Side Bar and proceed to checkout (use text-based selector instead of dynamic #mui-5)
    cy.xpath("//button[normalize-space()='Checkout']", { timeout: 10000 }).should('be.visible')
    cy.xpath("//button[normalize-space()='Checkout']").click({ force: true })
    cy.wait(1000)
    cy.url().should('include', 'https://demo.evershop.io/checkout')
    
    cy.wait(1000)
    cy.get('p').contains('newuser@gmail.com').should('exist')
    
    // Fill Shipping Address
    const guest = generateRandomUser()
    const fullName = `${guest.firstName} ${guest.lastName}`
    
    cy.get('[id="field-shippingAddress.full_name"]').scrollIntoView().type(fullName, { force: true })
    cy.wait(500)
    cy.xpath("//input[@id='field-shippingAddress.telephone']").type(guest.phone, { force: true })
    cy.wait(500)
    cy.get('[id="field-shippingAddress.address_1"]').type(guest.address, { force: true })
    cy.wait(500)
    cy.scrollTo('bottom')
    cy.wait(500)
    cy.get('[name="shippingAddress.address_1"]').type(guest.address, { force: true })
    cy.wait(500)
    cy.get('[id="field-shippingAddress.city"]').type(guest.city, { force: true })
    cy.wait(500)
    
    // Dropdowns
    cy.xpath("//button[@id='field-shippingAddress.country']").click({ force: true })
    cy.wait(500)
    cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click({ force: true })
    cy.wait(500)
    
    cy.xpath("//button[@id='field-shippingAddress.province']").click({ force: true })
    cy.wait(500)
    cy.xpath("//div[position()=2]/div[position()=1]/div[position()=1]/div[position()=3]/div[position()=1]").click({ force: true })
    cy.wait(500)
    
    cy.get('[name="shippingAddress.postcode"]').type(guest.zipCode, { force: true })
    cy.wait(1500)
    
    // Shipping method and Payment
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.get('[role="radio"], input[type="radio"]').eq(0).click({ force: true })
    cy.wait(1000)
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.get('form').find('div').contains('Cash On Delivery').click({ force: true })
    cy.wait(1000)
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.xpath('//div/div[4]/button').last().click({ force: true })
    
    // Checkout Success Phase
    cy.wait(3000)
    cy.contains('span', 'Checkout success', { timeout: 15000 }).should('be.visible')
    
    // Grab Order ID and verify in profile
    cy.get('span').contains('Order #').invoke('text').then((orderText) => {
      const orderId = orderText.trim()
      cy.wait(1000)
      cy.scrollTo('bottom')
      cy.wait(500)
      cy.get('button[type="button"][title="CONTINUE SHOPPING"]').click({ force: true })
      cy.wait(2000)
      
      // Click profile icon
      cy.get('div.self-center > a > svg').click({ force: true })
      cy.wait(2000)
      cy.url().should('include', 'https://demo.evershop.io/account')
      cy.xpath("//h2[normalize-space()='Recent Orders']").should('exist')
      cy.xpath("//div[normalize-space()='Stainless Steel Thermos - White']").should('exist')
      // Note: orderId contains "Order #1234", to match profile, we might need "Order: #1234"
      const profileOrderId = orderId.replace('Order ', 'Order: ')
      cy.xpath(`//span[normalize-space()='${profileOrderId}']`).should('exist')
    })
  })
})
