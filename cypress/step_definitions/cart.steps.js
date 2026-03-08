import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

const productPage = new ProductPage();
const cartPage = new CartPage();

Given('User berada di halaman product detail', () => {
  productPage.visitProduct('accessories/stainless-steel-thermos-yellow');
});

When('User memilih varian produk jika tersedia', () => {
  // Try selecting typical variants, wrap in body to allow failure gracefully if none exist for this product
  cy.get('body').then(($body) => {
    if ($body.find('ul.variant-swatches li a').length > 0) {
      cy.get('ul.variant-swatches li a').first().click({ force: true });
    }
  });
});

When('User mengatur quantity menjadi 1', () => {
  productPage.setQuantity(1);
});

When('User mengklik tombol Add to Cart', () => {
  productPage.addToCart();
  cy.wait(1000);
});

Then('Notifikasi sukses ditampilkan', () => {
  productPage.assertSuccessToast();
});

Then('Icon cart menampilkan jumlah yang updated', () => {
  cy.get('.mini-cart-icon span').should('not.have.text', '0');
});

Then('Product tersimpan di cart dengan detail yang benar', () => {
  cartPage.navigateTo();
  cartPage.assertItemCount(1);
});

Given('User memiliki minimal 1 produk di cart', () => {
  productPage.visitProduct('accessories/stainless-steel-thermos-yellow');
  productPage.selectColor('White');
  productPage.setQuantity(1);
  productPage.addToCart();
  cy.wait(2000);
});

Given('User navigasi ke halaman cart', () => {
  cartPage.navigateTo();
  cy.wait(1000);
});

When('User menaikkan quantity produk', () => {
  cartPage.increaseQuantity(0);
  cy.wait(2000);
});

Then('Quantity terupdate', () => {
  // Assuming it went from 1 to 2
  cartPage.assertQuantity(0, 2);
});

Then('Total harga terupdate secara akurat', () => {
  cy.get(cartPage.selectors.cartTotal).should('be.visible');
});

When('User mengklik tombol hapus pada produk', () => {
  cartPage.removeItem(0);
  cy.wait(2000);
});

Then('Produk dihapus dari cart', () => {
  cartPage.assertCartEmpty();
});

Then('Total cart terupdate', () => {
  // Empty cart usually hides total or puts it at $0
  cy.get('body').should('not.contain.text', 'Grand Total');
});
