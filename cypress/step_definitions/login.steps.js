import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { LoginPage } from '../pages/LoginPage';
import * as allure from 'allure-js-commons';

const loginPage = new LoginPage();

Given('User sudah terdaftar di sistem', () => {
  cy.fixture('users').as('users');
});

Given('User berada di halaman login', () => {
  allure.step('Navigate ke halaman login', () => {
    loginPage.navigateTo();
    loginPage.assertOnLoginPage();
  });
});

When('User memasukkan email {string}', (email) => {
  loginPage.fillEmail(email);
});

When('User memasukkan password yang valid', function () {
  loginPage.fillPassword(this.users.validUser.password);
});

When('User memasukkan password yang salah', () => {
  loginPage.fillPassword('wrongpassword123');
});

When('User memasukkan password {string}', (password) => {
  loginPage.fillPassword(password);
});

When('User mengklik tombol Login', () => {
  loginPage.submit();
});

Then('User diarahkan ke halaman dashboard', () => {
  loginPage.assertLoginSuccess();
});

Then('Nama user tampil di header', () => {
  loginPage.assertUserNameVisible();
});

Then('Pesan error ditampilkan', () => {
  loginPage.assertLoginFailed();
});

Then('User tetap berada di halaman login', () => {
  loginPage.assertOnLoginPage();
});
