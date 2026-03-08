@smoke @p0
Feature: User Authentication
  Sebagai pengguna terdaftar
  Saya ingin dapat login ke akun saya
  Sehingga saya bisa mengakses fitur member

  Background:
    Given User sudah terdaftar di sistem

  @happy-path
  Scenario: Login dengan kredensial valid
    Given User berada di halaman login
    When User memasukkan email "test@evershop.io"
    And User memasukkan password yang valid
    And User mengklik tombol Login
    Then User diarahkan ke halaman dashboard
    And Nama user tampil di header

  @negative
  Scenario: Login dengan password salah
    Given User berada di halaman login
    When User memasukkan email "test@evershop.io"
    And User memasukkan password yang salah
    And User mengklik tombol Login
    Then Pesan error ditampilkan
    And User tetap berada di halaman login

  @negative
  Scenario Outline: Login dengan data tidak valid
    Given User berada di halaman login
    When User memasukkan email "<email>"
    And User memasukkan password "<password>"
    And User mengklik tombol Login
    Then Pesan error ditampilkan

    Examples:
      | email               | password    |
      | invalid-email       | Test123!    |
      | test@evershop.io    | wrongpass   |
      |                     | Test123!    |
