@smoke @p0
Feature: Cart Management
  Sebagai shopper
  Saya ingin mengelola item di cart
  Sehingga saya bisa berbelanja dengan nyaman

  Background:
    Given User berada di halaman product detail

  Scenario: Menambahkan produk ke cart
    When User memilih varian produk jika tersedia
    And User mengatur quantity menjadi 1
    And User mengklik tombol Add to Cart
    Then Notifikasi sukses ditampilkan
    And Icon cart menampilkan jumlah yang updated
    And Product tersimpan di cart dengan detail yang benar

  Scenario: Update quantity di cart
    Given User memiliki minimal 1 produk di cart
    And User navigasi ke halaman cart
    When User menaikkan quantity produk
    Then Quantity terupdate
    And Total harga terupdate secara akurat

  Scenario: Menghapus produk dari cart
    Given User memiliki minimal 1 produk di cart
    And User navigasi ke halaman cart
    When User mengklik tombol hapus pada produk
    Then Produk dihapus dari cart
    And Total cart terupdate
