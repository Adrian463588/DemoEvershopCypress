import { generateRandomUser } from '../../support/helpers/data-generator'

describe('Checkout - User/Logged In Checkout', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('TC-004a: User (Login) checkout menggunakan email yang pre-filled di form', () => {
    // Navigate to homepage
    cy.visit('https://demo.evershop.io/')
    cy.get('div.self-center > a > svg').click({ force: true })
    
    // Assert login page
    cy.url().should('include', 'https://demo.evershop.io/account/login')
    cy.contains('Please sign in to your account').should('be.visible')
    
    cy.fixture('users').then((users) => {
      cy.get('#field-email').type(users.validUser.email, { force: true })
      cy.get('#field-password').type(users.validUser.password, { force: true })
    })
    cy.contains('Sign In').click({ force: true })
    
    // Wait for login and navigate to account page
    cy.wait(2000)
    cy.url().should('eq', 'https://demo.evershop.io/')
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.get('h1').contains("My Account").should('be.visible')
    cy.url().should('include', 'https://demo.evershop.io/account')
    
    // Navigate back to product and add to cart
    cy.visit('https://demo.evershop.io/')
    cy.contains('h3', 'Stainless Steel Thermos - Yellow').scrollIntoView()
    cy.contains('h3', 'Stainless Steel Thermos - Yellow').click({ force: true })
    cy.url().should('include', 'https://demo.evershop.io/accessories/stainless-steel-thermos-yellow')
    cy.contains('button', 'White').click({ force: true })
    cy.wait(500)
    cy.get('[name="qty"]').clear({ force: true }).type('1', { force: true })
    cy.wait(500)
    cy.contains('button', 'ADD TO CART').click({ force: true })
    cy.wait(1500)
    
    // Assert Side Bar and proceed to checkout
    cy.get('#mui-5', { timeout: 10000 }).should('be.visible')
    cy.xpath("//button[normalize-space()='Checkout']").click({ force: true })
    cy.url().should('include', 'https://demo.evershop.io/checkout')
    
    // Assert email pre-filled handling
    // We check if the spans with email exist, based on locators
    cy.get('p').contains('newuser@gmail.com').should('exist')
    
    // Fill Shipping Address
    const guest = generateRandomUser()
    const fullName = `${guest.firstName} ${guest.lastName}`
    
    cy.get('[id="field-shippingAddress.full_name"]').scrollIntoView().type(fullName, { force: true })
    cy.xpath("//input[@id='field-shippingAddress.telephone']").type(guest.phone, { force: true })
    cy.get('[id="field-shippingAddress.address_1"]').type(guest.address, { force: true })
    cy.scrollTo('bottom')
    cy.get('[name="shippingAddress.address_1"]').type(guest.address, { force: true })
    cy.get('[id="field-shippingAddress.city"]').type(guest.city, { force: true })
    
    // Dropdowns
    cy.xpath("//button[@id='field-shippingAddress.country']").click({ force: true })
    cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click({ force: true })
    
    cy.xpath("//button[@id='field-shippingAddress.province']").click({ force: true })
    cy.xpath("//div[position()=2]/div[position()=1]/div[position()=1]/div[position()=3]/div[position()=1]").click({ force: true })
    
    cy.get('[name="shippingAddress.postcode"]').type(guest.zipCode, { force: true })
    
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
    cy.wait(2000)
    cy.contains('span', 'Checkout success').should('be.visible')
    cy.scrollTo('bottom')
    cy.get('button[type="button"][title="CONTINUE SHOPPING"]').click({ force: true })
  })

  it('TC-004b: User memverifikasi bahwa order tervalidasi terekam ke database profile', () => {
    // Navigate to homepage
    cy.visit('https://demo.evershop.io/')
    cy.get('div.self-center > a > svg').click({ force: true })
    
    // Assert login page
    cy.url().should('include', 'https://demo.evershop.io/account/login')
    cy.contains('Please sign in to your account').should('be.visible')
    
    cy.fixture('users').then((users) => {
      cy.get('#field-email').type(users.validUser.email, { force: true })
      cy.get('#field-password').type(users.validUser.password, { force: true })
    })
    cy.contains('Sign In').click({ force: true })
    
    // Wait for login and navigate to account page
    cy.wait(2000)
    cy.url().should('eq', 'https://demo.evershop.io/')
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.get('h1').contains("My Account").should('be.visible')
    cy.url().should('include', 'https://demo.evershop.io/account')
    
    // Navigate back to product and add to cart
    cy.visit('https://demo.evershop.io/')
    cy.contains('h3', 'Stainless Steel Thermos - Yellow').scrollIntoView()
    cy.contains('h3', 'Stainless Steel Thermos - Yellow').click({ force: true })
    cy.url().should('include', 'https://demo.evershop.io/accessories/stainless-steel-thermos-yellow')
    cy.contains('button', 'White').click({ force: true })
    cy.wait(500)
    cy.get('[name="qty"]').clear({ force: true }).type('1', { force: true })
    cy.wait(500)
    cy.contains('button', 'ADD TO CART').click({ force: true })
    cy.wait(1500)
    
    // Assert Side Bar and proceed to checkout
    cy.get('#mui-5', { timeout: 10000 }).should('be.visible')
    cy.xpath("//button[normalize-space()='Checkout']").click({ force: true })
    cy.url().should('include', 'https://demo.evershop.io/checkout')
    
    cy.get('p').contains('newuser@gmail.com').should('exist')
    
    // Fill Shipping Address
    const guest = generateRandomUser()
    const fullName = `${guest.firstName} ${guest.lastName}`
    
    cy.get('[id="field-shippingAddress.full_name"]').scrollIntoView().type(fullName, { force: true })
    cy.xpath("//input[@id='field-shippingAddress.telephone']").type(guest.phone, { force: true })
    cy.get('[id="field-shippingAddress.address_1"]').type(guest.address, { force: true })
    cy.scrollTo('bottom')
    cy.get('[name="shippingAddress.address_1"]').type(guest.address, { force: true })
    cy.get('[id="field-shippingAddress.city"]').type(guest.city, { force: true })
    
    // Dropdowns
    cy.xpath("//button[@id='field-shippingAddress.country']").click({ force: true })
    cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click({ force: true })
    
    cy.xpath("//button[@id='field-shippingAddress.province']").click({ force: true })
    cy.xpath("//div[position()=2]/div[position()=1]/div[position()=1]/div[position()=3]/div[position()=1]").click({ force: true })
    
    cy.get('[name="shippingAddress.postcode"]').type(guest.zipCode, { force: true })
    
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
    cy.wait(2000)
    cy.contains('span', 'Checkout success').should('be.visible')
    
    // Grab Order ID and verify in profile
    cy.get('span').contains('Order #').invoke('text').then((orderText) => {
      const orderId = orderText.trim()
      cy.scrollTo('bottom')
      cy.get('button[type="button"][title="CONTINUE SHOPPING"]').click({ force: true })
      
      // Click profile icon (circle)
      cy.get('div.self-center > a > svg').click({ force: true })
      cy.url().should('include', 'https://demo.evershop.io/account')
      cy.xpath("//h2[normalize-space()='Recent Orders']").should('exist')
      cy.xpath("//div[normalize-space()='Stainless Steel Thermos - White']").should('exist')
      // Note: orderId contains "Order #1234", to match profile, we might need "Order: #1234"
      const profileOrderId = orderId.replace('Order ', 'Order: ')
      cy.xpath(`//span[normalize-space()='${profileOrderId}']`).should('exist')
    })
  })
})
