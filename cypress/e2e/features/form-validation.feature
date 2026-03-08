@regression @p1
Feature: Form Validation
  Sebagai sistem
  Saya ingin memvalidasi input form
  Sehingga data yang tidak valid ditolak dengan pesan error yang jelas

  Scenario: Submit form dengan required field kosong
    Given User berada di halaman checkout
    When User tidak mengisi required field
    And User mencoba submit form
    Then Error message ditampilkan untuk setiap required field kosong

  Scenario: Submit dengan format email tidak valid
    Given User berada di halaman form registrasi
    When User register menggunakan email "bukan-email-valid"
    And User mencoba submit form
    Then Validasi email error ditampilkan

  Scenario: Password tidak cocok saat registrasi
    Given User berada di halaman registrasi
    When User register menggunakan password "Test123!"
    And User memasukkan confirm password "BedaPassword!"
    And User mencoba submit form
    Then Error password mismatch ditampilkan
