Pertama user berada pada   
: [https://demo.evershop.io/](https://demo.evershop.io/) 

# Alur login 

When user in [https://demo.evershop.io/](https://demo.evershop.io/)  
And then user click on cy.get('div.self-center \> a \> svg')   
Then Assert :   
1\. web link [https://demo.evershop.io/account/login](https://demo.evershop.io/account/login)   
2\. cy.contains('Please sign in to your account') \-\> appear  
And then fill field :   
1\.   email on cy.get('\#field-email')  
2\.  password cy.get('\#field-password')  
And then user signin click on  cy.contains('Sign In')  
Then Assert : 

1. user is on [https://demo.evershop.io/](https://demo.evershop.io/)   
2. And then user click on cy.get('div.self-center \> a \> svg') Then Assert :   
   1. cy.get('h1:has-text("My Account")') \-\> appear   
   2. user is on [https://demo.evershop.io/account](https://demo.evershop.io/account) 

Login Error handling : 

1. password : cy.xpath('//div\[@data-slot='field-error'\]')   
2. toast muncul : cy.get('.Toastify\_\_toast-body').should('have.text', 'Invalid email or password') 

# Alur register 

When user in [https://demo.evershop.io/](https://demo.evershop.io/)  
And then user click on cy.get('div.self-center \> a \> svg')   
Then Assert :   
1\. web link [https://demo.evershop.io/account/login](https://demo.evershop.io/account/login)   
And then user click on cy.xpath("//a\[normalize-space()='Create an account'\]")   
Then Assert : 

1. web link [https://demo.evershop.io/account/register](https://demo.evershop.io/account/register)   
2. cy.get('h1:has-text("Create an account")')  \-\> appear

And then user fill field  : 

1. Full name : cy.get('\#field-full\_name')   
2. email : cy.get('\#field-email')   
3. password : cy.get('\#field-password') 

And then user signup click on cy.xpath('//button\[@data-slot='button'\]')   
Then Assert : 

3. user is on [https://demo.evershop.io/](https://demo.evershop.io/)   
4. And then user click on cy.get('div.self-center \> a \> svg') Then Assert :   
   1. cy.get('h1:has-text("My Account")') \-\> appear   
   2. user is on [https://demo.evershop.io/account](https://demo.evershop.io/account) 

Register Error handling   : 

1. email tidak sesuai  \-\> cy.xpath('//div\[normalize-space()='Please enter a valid email address'\]')  
2. password tidak sesuai \-\>  cy.xpath('//div\[normalize-space()='Password must be at least 6 characters long'\]') 

# Alur logout 

1. user is on [https://demo.evershop.io/](https://demo.evershop.io/)   
2. And then user click on cy.get('div.self-center \> a \> svg') Then Assert :   
   3. cy.get('h1:has-text("My Account")') \-\> appear   
   4. user is on [https://demo.evershop.io/account](https://demo.evershop.io/account) 

3\. And then user click on cy.xpath('//a\[normalize-space()='Logout'\]')   
4.Then Assert on : 

1. user is on the [https://demo.evershop.io/](https://demo.evershop.io/)   
2. when user click on cy.get('div.self-center \> a \> svg')   
   1. Then Assert :   
      1\. web link [https://demo.evershop.io/account/login](https://demo.evershop.io/account/login)   
      2\. cy.contains('Please sign in to your account') \-\> appear

Alur Forgot Password 

1. user is on the [https://demo.evershop.io/](https://demo.evershop.io/)   
2. when user click on cy.get('div.self-center \> a \> svg')   
   1. Then Assert :   
      1\. web link [https://demo.evershop.io/account/login](https://demo.evershop.io/account/login)   
      2\.cy.contains('Please sign in to your account') \-\> appear  
3. And then user click on cy.get('a\[href\*="/account/reset-password"\]')   
4. Then Assert :   
   1. User is on the [https://demo.evershop.io/account/reset-password](https://demo.evershop.io/account/reset-password)   
5. And then user fill email on field cy.get('\[name="email"\]')   
6. And then user click on cy.get('button\[type="submit"\]')   
7. Pasti error , assert cy.get('.Toastify\_\_toast-body') 

fff

[andrew.martin86@test.com](mailto:andrew.martin86@test.com)  
1DeXaUSHdgiI 

# Flow Add to cart tanpa login 

## Satu produk dari dashboard

user ke [https://demo.evershop.io/](https://demo.evershop.io/)  
scroll sampai ketemu element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')  
click element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')   
Assert berpindah ke page [https://demo.evershop.io/accessories/stainless-steel-thermos-yellow](https://demo.evershop.io/accessories/stainless-steel-thermos-yellow)   
pilih variant click cy.get('button:has-text("White")')   
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
assert side bar terbuka cy.get('\#mui-5')   
klik co cy.xpath('//button\[normalize-space()='Checkout'\]')   
assert user berpindah ke co page  [https://demo.evershop.io/checkout](https://demo.evershop.io/checkout)   
isi filed email cy.get('\[name="contact.email"\]')   
scroll dan isi field cy.get('\[id="field-shippingAddress.full\_name"\]')   
isi field cy.xpath('//input\[@id='field-shippingAddress.telephone'\]')  
isi field cy.get('\[id="field-shippingAddress.address\_1"\]')  
scroll page  
isi field cy.get('\[name="shippingAddress.address\_1"\]')  
isi field cy.get('\[id="field-shippingAddress.city"\]')  
isi dropdown field klik cy.xpath('//button\[@id='field-shippingAddress.country'\]') , pilih cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click();  
isi dropdown field click cy.xpath('//button\[@id='field-shippingAddress.province'\]'), pilih dropdown cy.xpath('//div\[position()=2\]/div\[position()=1\]/div\[position()=1\]/div\[position()=3\]/div\[position()=1\]')   
isi filed cy.get('\[name="shippingAddress.postcode"\]')   
scroll page  
klik radio button cy.get('\#base-ui-26')   
scroll page pilih radio buttoin cy.get('\#base-ui-10')   
scroll page keatas klik radio button cy.get('\#base-ui-29')   
scroll ke bawah klik cy.xpath('//div/div\[4\]/button')   
assert berpindah halaman dengan terdapat cy.get('span:has-text("Checkout success")')  
scroll page klik cy.get('button\[type="button"\]\[title="CONTINUE SHOPPING"\]') 

## checkout multiple variant dari dashboard

user ke [https://demo.evershop.io/](https://demo.evershop.io/)  
scroll sampai ketemu element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')  
click element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')   
Assert berpindah ke page [https://demo.evershop.io/accessories/stainless-steel-thermos-yellow](https://demo.evershop.io/accessories/stainless-steel-thermos-yellow)   
pilih variant click cy.get('button:has-text("White")')   
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
klik layar kembali cy.xpath('//div\[@data-slot='sheet-overlay'\]')   
pilih variant click cy.get('button:has-text("Yellow")')  
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
assert side bar terbuka cy.get('\#mui-5')   
klik co cy.xpath('//button\[normalize-space()='Checkout'\]')   
assert user berpindah ke co page  [https://demo.evershop.io/checkout](https://demo.evershop.io/checkout)   
isi filed email cy.get('\[name="contact.email"\]')   
scroll dan isi field cy.get('\[id="field-shippingAddress.full\_name"\]')   
isi field cy.xpath('//input\[@id='field-shippingAddress.telephone'\]')  
isi field cy.get('\[id="field-shippingAddress.address\_1"\]')  
scroll page  
isi field cy.get('\[name="shippingAddress.address\_1"\]')  
isi field cy.get('\[id="field-shippingAddress.city"\]')  
isi dropdown field klik cy.xpath('//button\[@id='field-shippingAddress.country'\]') , pilih cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click();  
isi dropdown field click cy.xpath('//button\[@id='field-shippingAddress.province'\]'), pilih dropdown cy.xpath('//div\[position()=2\]/div\[position()=1\]/div\[position()=1\]/div\[position()=3\]/div\[position()=1\]')   
isi filed cy.get('\[name="shippingAddress.postcode"\]')   
scroll page  
klik radio button cy.get('\#base-ui-26')   
scroll page pilih radio buttoin cy.get('\#base-ui-10')   
scroll page keatas klik radio button cy.get('\#base-ui-29')   
scroll ke bawah klik cy.xpath('//div/div\[4\]/button')   
assert berpindah halaman dengan terdapat cy.get('span:has-text("Checkout success")')

## checkout multiple variant multiple produk  dari dashboard

user ke [https://demo.evershop.io/](https://demo.evershop.io/)  
scroll sampai ketemu element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')  
click element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')   
Assert berpindah ke page [https://demo.evershop.io/accessories/stainless-steel-thermos-yellow](https://demo.evershop.io/accessories/stainless-steel-thermos-yellow)   
pilih variant click cy.get('button:has-text("White")')   
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
klik layar kembali cy.xpath('//div\[@data-slot='sheet-overlay'\]')   
pilih variant click cy.get('button:has-text("Yellow")')  
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
user kembali ke dashboard klik pada cy.contains('a', 'Home');  
assert link web [https://demo.evershop.io/](https://demo.evershop.io/)  
scroll sampai ketemu element cy.get('h3:has-text("Modern Ceramic Vase \- Green")')  
klik cy.get('h3:has-text("Modern Ceramic Vase \- Green")')   
assert berpindah page ke pdp [https://demo.evershop.io/accessories/modern-ceramic-vase-green](https://demo.evershop.io/accessories/modern-ceramic-vase-green)  
pilih variant click cy.get('button:has-text("White")')  
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
klik layar kembali cy.xpath('//div\[@data-slot='sheet-overlay'\]')   
pilih variant click cy.get('button:has-text("Yellow")')  
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
assert side bar terbuka cy.get('\#mui-5')   
klik co cy.xpath('//button\[normalize-space()='Checkout'\]')   
assert user berpindah ke co page  [https://demo.evershop.io/checkout](https://demo.evershop.io/checkout)   
isi filed email cy.get('\[name="contact.email"\]')   
scroll dan isi field cy.get('\[id="field-shippingAddress.full\_name"\]')   
isi field cy.xpath('//input\[@id='field-shippingAddress.telephone'\]')  
isi field cy.get('\[id="field-shippingAddress.address\_1"\]')  
scroll page  
isi field cy.get('\[name="shippingAddress.address\_1"\]')  
isi field cy.get('\[id="field-shippingAddress.city"\]')  
isi dropdown field klik cy.xpath('//button\[@id='field-shippingAddress.country'\]') , pilih cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click();  
isi dropdown field click cy.xpath('//button\[@id='field-shippingAddress.province'\]'), pilih dropdown cy.xpath('//div\[position()=2\]/div\[position()=1\]/div\[position()=1\]/div\[position()=3\]/div\[position()=1\]')   
isi filed cy.get('\[name="shippingAddress.postcode"\]')   
scroll page  
klik radio button cy.get('\#base-ui-26')   
scroll page pilih radio buttoin cy.get('\#base-ui-10')   
scroll page keatas klik radio button cy.get('\#base-ui-29')   
scroll ke bawah klik cy.xpath('//div/div\[4\]/button')   
assert berpindah halaman dengan terdapat cy.get('span:has-text("Checkout success")')

## User checkout tanpa login barang dari Category page

user ke [https://demo.evershop.io/](https://demo.evershop.io/)  
assert ketemu cy.get('a\[href="/accessories"\]').contains('View Collection');  
click untuk ke category page cy.get('a\[href="/accessories"\]').contains('View Collection');   
assert link [https://demo.evershop.io/accessories](https://demo.evershop.io/accessories)  
scroll page sampai ketemu cy.get('h3:has-text("Modern Ceramic Vase \- White")')  
click cy.get('h3:has-text("Modern Ceramic Vase \- White")')  
pilih variant click cy.get('button:has-text("White")')   
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
klik layar kembali cy.xpath('//div\[@data-slot='sheet-overlay'\]')   
pilih variant click cy.get('button:has-text("Black")')  
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
klik layar kembali cy.xpath('//div\[@data-slot='sheet-overlay'\]')   
klik untuk kembali ke category page cy.contains('a', 'Accessories');  
assert page [https://demo.evershop.io/accessories](https://demo.evershop.io/accessories)  
scroll page sampai ketemu cy.get('h3:has-text("Ceramic Coffee Cup \- Yellow")')  
klik pada cy.get('h3:has-text("Ceramic Coffee Cup \- Yellow")')  
assert link pdp [https://demo.evershop.io/accessories/ceramic-coffee-cup-yellow](https://demo.evershop.io/accessories/ceramic-coffee-cup-yellow)  
pilih variant click cy.get('button:has-text("White")')   
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
klik layar kembali cy.xpath('//div\[@data-slot='sheet-overlay'\]')   
pilih variant click cy.get('button:has-text("Black")')  
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
klik cy.xpath('//button\[normalize-space()='View Cart (4)'\]')   
Assert masing masing produk terdapat di cart page misal cy.contains('td', 'Ceramic Coffee Cup \- White').parent('tr'); – buat untuk yang lainnya  
klik tambah barang cy.contains('button', '+').eq(0).click(); dan klik tambah barang cy.contains('button', '+').eq(1).click();  sebanyak 5 kali  
klik kurangi barang cy.contains('button', '−').eq(0).click(); dan klik kurangi barang cy.contains('button', '−').eq(1).click(); sebanyak 2 kali   
hapus item paling bawah cy.contains('tr').find('a.text-destructive').eq(3).contains('Remove');.click();  
click cy.get('button\[type="button"\]\[title="CHECKOUT"\]')   
assert checkout page [https://demo.evershop.io/checkout](https://demo.evershop.io/checkout)  
assert semua barang yang tadi di checkout dan belum di hapus ( misal cy.xpath('//div\[normalize-space()='Ceramic Coffee Cup \- White'\]') )   
isi filed email cy.get('\[name="contact.email"\]')   
scroll dan isi field cy.get('\[id="field-shippingAddress.full\_name"\]')   
isi field cy.xpath('//input\[@id='field-shippingAddress.telephone'\]')  
isi field cy.get('\[id="field-shippingAddress.address\_1"\]')  
scroll page  
isi field cy.get('\[name="shippingAddress.address\_1"\]')  
isi field cy.get('\[id="field-shippingAddress.city"\]')  
isi dropdown field klik cy.xpath('//button\[@id='field-shippingAddress.country'\]') , pilih cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click();  
isi dropdown field click cy.xpath('//button\[@id='field-shippingAddress.province'\]'), pilih dropdown cy.xpath('//div\[position()=2\]/div\[position()=1\]/div\[position()=1\]/div\[position()=3\]/div\[position()=1\]')   
isi filed cy.get('\[name="shippingAddress.postcode"\]')   
scroll page  
klik radio button cy.get('\#base-ui-26')   
scroll page pilih radio buttoin cy.get('\#base-ui-10')   
scroll page keatas klik radio button cy.get('\#base-ui-29')   
scroll ke bawah klik cy.xpath('//div/div\[4\]/button')   
assert berpindah halaman dengan terdapat cy.get('span:has-text("Checkout success")')

# Flow Add to cart dengan login 

## User (Login) checkout menggunakan email yang pre-filled di form

When user in [https://demo.evershop.io/](https://demo.evershop.io/)  
And then user click on cy.get('div.self-center \> a \> svg')   
Then Assert :   
1\. web link [https://demo.evershop.io/account/login](https://demo.evershop.io/account/login)   
2\. cy.contains('Please sign in to your account') \-\> appear  
And then fill field :   
1\.   email on cy.get('\#field-email')  
2\.  password cy.get('\#field-password')  
And then user signin click on  cy.contains('Sign In')  
Then Assert : 

5. user is on [https://demo.evershop.io/](https://demo.evershop.io/)   
6. And then user click on cy.get('div.self-center \> a \> svg') Then Assert :   
   1. cy.get('h1:has-text("My Account")') \-\> appear   
   2. user is on [https://demo.evershop.io/account](https://demo.evershop.io/account) 

scroll sampai ketemu element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')  
click element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')   
Assert berpindah ke page [https://demo.evershop.io/accessories/stainless-steel-thermos-yellow](https://demo.evershop.io/accessories/stainless-steel-thermos-yellow)   
pilih variant click cy.get('button:has-text("White")')   
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
assert side bar terbuka cy.get('\#mui-5')   
klik co cy.xpath('//button\[normalize-space()='Checkout'\]')   
assert user berpindah ke co page  [https://demo.evershop.io/checkout](https://demo.evershop.io/checkout)   
assert pada Contact Information , terdapat email user cy.get('span:has-text("Logged in as ValidName")') dan terdapat elemen cy.get('p:has-text("newuser@gmail.com")')  
scroll dan isi field cy.get('\[id="field-shippingAddress.full\_name"\]')   
isi field cy.xpath('//input\[@id='field-shippingAddress.telephone'\]')  
isi field cy.get('\[id="field-shippingAddress.address\_1"\]')  
scroll page  
isi field cy.get('\[name="shippingAddress.address\_1"\]')  
isi field cy.get('\[id="field-shippingAddress.city"\]')  
isi dropdown field klik cy.xpath('//button\[@id='field-shippingAddress.country'\]') , pilih cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click();  
isi dropdown field click cy.xpath('//button\[@id='field-shippingAddress.province'\]'), pilih dropdown cy.xpath('//div\[position()=2\]/div\[position()=1\]/div\[position()=1\]/div\[position()=3\]/div\[position()=1\]')   
isi filed cy.get('\[name="shippingAddress.postcode"\]')   
scroll page  
klik radio button cy.get('\#base-ui-26')   
scroll page pilih radio buttoin cy.get('\#base-ui-10')   
scroll page keatas klik radio button cy.get('\#base-ui-29')   
scroll ke bawah klik cy.xpath('//div/div\[4\]/button')   
assert berpindah halaman dengan terdapat cy.get('span:has-text("Checkout success")')  
scroll page klik cy.get('button\[type="button"\]\[title="CONTINUE SHOPPING"\]') 

## User memverifikasi bahwa order tervalidasi terekam ke database profile

When user in [https://demo.evershop.io/](https://demo.evershop.io/)  
And then user click on cy.get('div.self-center \> a \> svg')   
Then Assert :   
1\. web link [https://demo.evershop.io/account/login](https://demo.evershop.io/account/login)   
2\. cy.contains('Please sign in to your account') \-\> appear  
And then fill field :   
1\.   email on cy.get('\#field-email')  
2\.  password cy.get('\#field-password')  
And then user signin click on  cy.contains('Sign In')  
Then Assert : 

7. user is on [https://demo.evershop.io/](https://demo.evershop.io/)   
8. And then user click on cy.get('div.self-center \> a \> svg') Then Assert :   
   1. cy.get('h1:has-text("My Account")') \-\> appear   
   2. user is on [https://demo.evershop.io/account](https://demo.evershop.io/account) 

scroll sampai ketemu element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')  
click element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')   
Assert berpindah ke page [https://demo.evershop.io/accessories/stainless-steel-thermos-yellow](https://demo.evershop.io/accessories/stainless-steel-thermos-yellow)   
pilih variant click cy.get('button:has-text("White")')   
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
assert side bar terbuka cy.get('\#mui-5')   
klik co cy.xpath('//button\[normalize-space()='Checkout'\]')   
assert user berpindah ke co page  [https://demo.evershop.io/checkout](https://demo.evershop.io/checkout)   
assert pada Contact Information , terdapat email user cy.get('span:has-text("Logged in as ValidName")') dan terdapat elemen cy.get('p:has-text("newuser@gmail.com")')  
scroll dan isi field cy.get('\[id="field-shippingAddress.full\_name"\]')   
isi field cy.xpath('//input\[@id='field-shippingAddress.telephone'\]')  
isi field cy.get('\[id="field-shippingAddress.address\_1"\]')  
scroll page  
isi field cy.get('\[name="shippingAddress.address\_1"\]')  
isi field cy.get('\[id="field-shippingAddress.city"\]')  
isi dropdown field klik cy.xpath('//button\[@id='field-shippingAddress.country'\]') , pilih cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click();  
isi dropdown field click cy.xpath('//button\[@id='field-shippingAddress.province'\]'), pilih dropdown cy.xpath('//div\[position()=2\]/div\[position()=1\]/div\[position()=1\]/div\[position()=3\]/div\[position()=1\]')   
isi filed cy.get('\[name="shippingAddress.postcode"\]')   
scroll page  
klik radio button cy.get('\#base-ui-26')   
scroll page pilih radio buttoin cy.get('\#base-ui-10')   
scroll page keatas klik radio button cy.get('\#base-ui-29')   
scroll ke bawah klik cy.xpath('//div/div\[4\]/button')   
assert berpindah halaman dengan terdapat cy.get('span:has-text("Checkout success")')  
assert order id misal cy.get('span:has-text("Order \#10893")')   
scroll page klik cy.get('button\[type="button"\]\[title="CONTINUE SHOPPING"\]')   
klik profile icon cy.xpath('//\*\[local-name()='circle' and @cy='10'\]')   
assert profile page [https://demo.evershop.io/account](https://demo.evershop.io/account)   
assert terdapat cy.xpath('//h2\[normalize-space()='Recent Orders'\]')  
assert terdapat order sebelumnya cy.xpath('//div\[normalize-space()='Stainless Steel Thermos \- White'\]')   
assert order id di profile page misal cy.xpath('//span\[normalize-space()='Order: \#10893'\]').

# Flow search product

 When user in [https://demo.evershop.io/](https://demo.evershop.io/)  
lalu klik pada cy.get('a.search\_\_icon \> svg \> circle')  
klik pada field cy.get('\[placeholder="Search"\]')  
lalu cari Stainless Steel Thermos  
klik enter keyboard  
assert terdapat cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")') 

# Flow Checkout menggunakan credit card

## User checkout menggunakan credit card dengan data valid

user ke [https://demo.evershop.io/](https://demo.evershop.io/)  
scroll sampai ketemu element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')  
click element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')   
Assert berpindah ke page [https://demo.evershop.io/accessories/stainless-steel-thermos-yellow](https://demo.evershop.io/accessories/stainless-steel-thermos-yellow)   
pilih variant click cy.get('button:has-text("White")')   
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
assert side bar terbuka cy.get('\#mui-5')   
klik co cy.xpath('//button\[normalize-space()='Checkout'\]')   
assert user berpindah ke co page  [https://demo.evershop.io/checkout](https://demo.evershop.io/checkout)   
isi filed email cy.get('\[name="contact.email"\]')   
scroll dan isi field cy.get('\[id="field-shippingAddress.full\_name"\]')   
isi field cy.xpath('//input\[@id='field-shippingAddress.telephone'\]')  
isi field cy.get('\[id="field-shippingAddress.address\_1"\]')  
scroll page  
isi field cy.get('\[name="shippingAddress.address\_1"\]')  
isi field cy.get('\[id="field-shippingAddress.city"\]')  
isi dropdown field klik cy.xpath('//button\[@id='field-shippingAddress.country'\]') , pilih cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click();  
isi dropdown field click cy.xpath('//button\[@id='field-shippingAddress.province'\]'), pilih dropdown cy.xpath('//div\[position()=2\]/div\[position()=1\]/div\[position()=1\]/div\[position()=3\]/div\[position()=1\]')   
isi filed cy.get('\[name="shippingAddress.postcode"\]')   
pilih shipping radio button cy.xpath('//span\[@id='base-ui-8'\]')  
pilih add payment address radio button cy.xpath('//span\[@id='base-ui-10'\]')  
pilih payment method radio button cy.xpath('//span\[@id='base-ui-15'\]')  
klik pada credit card   
// Memastikan iframe sudah ter-load sepenuhnya  
cy.frameLoaded('iframe\[title="Secure payment input frame"\]');

// Mencari elemen dan mengkliknya  
cy.iframe('iframe\[title="Secure payment input frame"\]')  
  .find('\[data-testid="card"\]')  
  .click();

isi nomor kartu pada field   
// Memastikan iframe sudah siap  
cy.frameLoaded('iframe\[title="Secure payment input frame"\]');

// Mencari field input nomor kartu dan mengetik angka  
cy.iframe('iframe\[title="Secure payment input frame"\]')  
  .find('\#payment-numberInput')  
  .type('4242424242424242'); // 4242... adalah standar nomor kartu testing (berhasil) dari Stripe

isi expiration date 

// Mengetik Expiry Date (Format biasanya MM/YY) cy.iframe('iframe\[title="Secure payment input frame"\]') .find('\#payment-expiryInput') .type('04/26');

isi field cvc 

const cvcNode \= $iframeBody\[0\].ownerDocument.evaluate( "//input\[@id='payment-cvcInput'\]", $iframeBody\[0\], null, XPathResult.FIRST\_ORDERED\_NODE\_TYPE, null ).singleNodeValue; cy.wrap(cvcNode).type('242');

pilih dropdown united states

cy.get('iframe\[title="Secure payment input frame"\]')  
  .its('0.contentDocument.body')  
  .should('not.be.empty')  
  .then(($iframeBody) \=\> {  
      
    // 1\. Definisikan locator XPath untuk Country  
    const countryXPath \= "//select\[@id='payment-countryInput'\]";  
      
    // 2\. Cari elemen menggunakan document.evaluate di dalam iframe  
    const countryNode \= $iframeBody\[0\].ownerDocument.evaluate(  
      countryXPath,   
      $iframeBody\[0\],   
      null,   
      XPathResult.FIRST\_ORDERED\_NODE\_TYPE,   
      null  
    ).singleNodeValue;

    // 3\. Bungkus elemennya dan pilih negara (Contoh: memilih 'Indonesia' menggunakan value 'ID')  
    cy.wrap(countryNode).select('ID');   
      
    // Opsional: Jika ingin memilih menggunakan nama negaranya langsung:  
    // cy.wrap(countryNode).select('United States');  
  });

isi field zip code 12345 

cy.get('iframe\[title="Secure payment input frame"\]')  
  .its('0.contentDocument.body')  
  .should('not.be.empty')  
  .then(($iframeBody) \=\> {  
      
    // 1\. Definisikan locator XPath untuk ZIP Code  
    const zipCodeXPath \= "//input\[@id='payment-postalCodeInput'\]";  
      
    // 2\. Cari elemen menggunakan document.evaluate di dalam iframe  
    const zipCodeNode \= $iframeBody\[0\].ownerDocument.evaluate(  
      zipCodeXPath,   
      $iframeBody\[0\],   
      null,   
      XPathResult.FIRST\_ORDERED\_NODE\_TYPE,   
      null  
    ).singleNodeValue;

    // 3\. Bungkus elemennya dan ketik ZIP code / Kode Pos  
    cy.wrap(zipCodeNode).type('12345');   
  });

klik button bayar dengan stripe cy.xpath('//div/div\[4\]/button')   
assert berpindah halaman dengan terdapat cy.get('span:has-text("Checkout success")')  
scroll page klik cy.get('button\[type="button"\]\[title="CONTINUE SHOPPING"\]') 

## User checkout menggunakan credit card dengan dataTIDAK valid

user ke [https://demo.evershop.io/](https://demo.evershop.io/)  
scroll sampai ketemu element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')  
click element cy.get('h3:has-text("Stainless Steel Thermos \- Yellow")')   
Assert berpindah ke page [https://demo.evershop.io/accessories/stainless-steel-thermos-yellow](https://demo.evershop.io/accessories/stainless-steel-thermos-yellow)   
pilih variant click cy.get('button:has-text("White")')   
nambah quantity isi cy.get('\[name="qty"\]') dengan 1  
klik cy.get('button:has-text("ADD TO CART")')   
assert side bar terbuka cy.get('\#mui-5')   
klik co cy.xpath('//button\[normalize-space()='Checkout'\]')   
assert user berpindah ke co page  [https://demo.evershop.io/checkout](https://demo.evershop.io/checkout)   
isi filed email cy.get('\[name="contact.email"\]')   
scroll dan isi field cy.get('\[id="field-shippingAddress.full\_name"\]')   
isi field cy.xpath('//input\[@id='field-shippingAddress.telephone'\]')  
isi field cy.get('\[id="field-shippingAddress.address\_1"\]')  
scroll page  
isi field cy.get('\[name="shippingAddress.address\_1"\]')  
isi field cy.get('\[id="field-shippingAddress.city"\]')  
isi dropdown field klik cy.xpath('//button\[@id='field-shippingAddress.country'\]') , pilih cy.get('div.flex.flex-1.whitespace-nowrap').contains('United States').click();  
isi dropdown field click cy.xpath('//button\[@id='field-shippingAddress.province'\]'), pilih dropdown cy.xpath('//div\[position()=2\]/div\[position()=1\]/div\[position()=1\]/div\[position()=3\]/div\[position()=1\]')   
isi filed cy.get('\[name="shippingAddress.postcode"\]')   
pilih shipping radio button cy.xpath('//span\[@id='base-ui-8'\]')  
pilih add payment address radio button cy.xpath('//span\[@id='base-ui-10'\]')  
pilih payment method radio button cy.xpath('//span\[@id='base-ui-15'\]')  
klik pada credit card   
// Memastikan iframe sudah ter-load sepenuhnya  
cy.frameLoaded('iframe\[title="Secure payment input frame"\]');

// Mencari elemen dan mengkliknya  
cy.iframe('iframe\[title="Secure payment input frame"\]')  
  .find('\[data-testid="card"\]')  
  .click();

isi nomor kartu pada field   
// Memastikan iframe sudah siap  
cy.frameLoaded('iframe\[title="Secure payment input frame"\]');

// Mencari field input nomor kartu dan mengetik angka  
cy.iframe('iframe\[title="Secure payment input frame"\]')  
  .find('\#payment-numberInput')  
  .type('4000000000009995');

isi expiration date 

// Mengetik Expiry Date (Format biasanya MM/YY) cy.iframe('iframe\[title="Secure payment input frame"\]') .find('\#payment-expiryInput') .type('04/26');

isi field cvc 

const cvcNode \= $iframeBody\[0\].ownerDocument.evaluate( "//input\[@id='payment-cvcInput'\]", $iframeBody\[0\], null, XPathResult.FIRST\_ORDERED\_NODE\_TYPE, null ).singleNodeValue; cy.wrap(cvcNode).type('242');

pilih dropdown united states

cy.get('iframe\[title="Secure payment input frame"\]')  
  .its('0.contentDocument.body')  
  .should('not.be.empty')  
  .then(($iframeBody) \=\> {  
      
    // 1\. Definisikan locator XPath untuk Country  
    const countryXPath \= "//select\[@id='payment-countryInput'\]";  
      
    // 2\. Cari elemen menggunakan document.evaluate di dalam iframe  
    const countryNode \= $iframeBody\[0\].ownerDocument.evaluate(  
      countryXPath,   
      $iframeBody\[0\],   
      null,   
      XPathResult.FIRST\_ORDERED\_NODE\_TYPE,   
      null  
    ).singleNodeValue;

    // 3\. Bungkus elemennya dan pilih negara (Contoh: memilih 'Indonesia' menggunakan value 'ID')  
    cy.wrap(countryNode).select('ID');   
      
    // Opsional: Jika ingin memilih menggunakan nama negaranya langsung:  
    // cy.wrap(countryNode).select('United States');  
  });

isi field zip code 12345 

cy.get('iframe\[title="Secure payment input frame"\]')  
  .its('0.contentDocument.body')  
  .should('not.be.empty')  
  .then(($iframeBody) \=\> {  
      
    // 1\. Definisikan locator XPath untuk ZIP Code  
    const zipCodeXPath \= "//input\[@id='payment-postalCodeInput'\]";  
      
    // 2\. Cari elemen menggunakan document.evaluate di dalam iframe  
    const zipCodeNode \= $iframeBody\[0\].ownerDocument.evaluate(  
      zipCodeXPath,   
      $iframeBody\[0\],   
      null,   
      XPathResult.FIRST\_ORDERED\_NODE\_TYPE,   
      null  
    ).singleNodeValue;

    // 3\. Bungkus elemennya dan ketik ZIP code / Kode Pos  
    cy.wrap(zipCodeNode).type('12345');   
  });

klik button bayar dengan stripe cy.xpath('//div/div[4]/button') 
assert berpindah halaman https://demo.evershop.io/cart
assert error toast cy.xpath("//div[@role='alert' and text()='Payment failed']") .should('be.visible');


Untuk cod radio button checkout \= cy.get('\#base-ui-13')   
Untuk credit card checkout \= cy.get('\#base-ui-15')