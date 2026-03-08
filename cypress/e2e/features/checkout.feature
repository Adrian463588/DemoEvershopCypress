@smoke @p0
Feature: Guest Checkout Flow
  Sebagai guest user
  Saya ingin dapat checkout tanpa registrasi
  Sehingga saya bisa membeli produk dengan cepat

  Background:
    Given User memiliki minimal 1 produk di cart

  Scenario: Guest checkout end-to-end
    Given User navigasi ke halaman cart
    When User mengklik tombol Proceed to Checkout
    And User mengisi informasi pengiriman yang valid
      | field     | value              |
      | firstName | John               |
      | lastName  | Doe                |
      | email     | guest@example.com  |
      | phone     | 08123456789        |
      | address   | Jl. Sudirman No.1  |
      | city      | Jakarta            |
      | zipCode   | 12190              |
    And User memilih metode pengiriman
    And User mengisi informasi pembayaran mock
    And User mengkonfirmasi order
    Then Halaman konfirmasi order ditampilkan
    And Nomor order ter-generate
