@regression @p1
Feature: Product Search
  Sebagai shopper
  Saya ingin mencari produk berdasarkan keyword
  Sehingga saya bisa menemukan produk yang diinginkan

  Scenario Outline: Search dengan berbagai keyword
    Given User berada di homepage
    When User mengetik "<keyword>" di search box
    And User menekan Enter atau mengklik Search
    Then Halaman search results ditampilkan
    And Results mengandung produk yang relevan dengan "<keyword>"

    Examples:
      | keyword   |
      | shoes     |
      | shirt     |
      | running   |

  Scenario: Search dengan keyword tidak valid
    Given User berada di homepage
    When User mengetik "xyznotexistproduct123" di search box
    And User menekan Enter atau mengklik Search
    Then Pesan "No results found" ditampilkan
