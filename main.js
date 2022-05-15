var app = new Vue({
    el: '#app',
    data: {
      product: 'Socks',
      brand: 'Vue Mastery',
      description: 'A pair of warm, fuzzy socks',
      selectedVariant: 0,
      altText: 'A pair of socks',
      link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
      onSale: true,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [{variantId: 2234, variantColor: "green", variantQuantity: 11, variantImage: './images/vmSocks-green-onWhite.jpg'},
                 {variantId: 2235, variantColor: "blue",  variantQuantity:  0, variantImage: './images/vmSocks-blue-onWhite.jpg'}],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      cart: 0
    },
    methods: {
        addToCart(){
            this.cart += 1
        },
        removeFromCart(){
            if (this.cart > 0) {
                this.cart -= 1
            }
        },
        updateProduct(index){
            this.selectedVariant = index
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image () {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock () {
            return this.variants[this.selectedVariant].variantQuantity
        }
    }
  })