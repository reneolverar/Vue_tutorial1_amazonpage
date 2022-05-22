var eventBus = new Vue ()

Vue.component('info-tabs', {
    props: {
        details: {
            type: Array,
            required: true
        },
        shipping: {
            required: true
        }
    },
    template: `
        <div>
            <h2> Product information </h2>
            <span class="tab" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab" :class="{ activeTab: selectedTab === tab }"> {{ tab }} </span>
            <div v-show="selectedTab === 'Details'">
                <p>Item description:</p>
                <ul>
                    <li v-for="detail in details"> {{ detail }} </li>
                </ul>
            </div>
            <div v-show="selectedTab === 'Shipping'">
                <p> Shipping: {{ shipping }} <p/>
            </div>
        </div>
    `,
    data () {
        return {
            tabs: ['Details', 'Shipping'],
            selectedTab: 'Details'
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>

            <div>
                <h2>Reviews:</h2>

                <span class="tab" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab" :class="{ activeTab: selectedTab === tab }"> {{ tab }} </span>

                <div v-show="selectedTab === 'Reviews'">
                    <p v-show="!reviews.length">There are no reviews yet.</p>
                    <ul>
                        <li v-for="review in reviews">
                            <p> Reviewer name: {{ review.name }} </p>
                            <p> Review: {{ review.review }} </p>
                            <p> Rating: {{ review.rating }} </p>
                            <p> Recommend: {{ review.recommend }} </p>
                        </li>
                    </ul>
                </div>
            </div>

            <product-review v-show="selectedTab === 'Make a review'"></product-review>

        </div>
    `,
    data () {
        return {
            tabs: ['Reviews', 'Make a review'],
            selectedTab: 'Reviews'
        }
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">

            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors"> {{ error }} </li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name">
            </p>

            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>

            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>


            <p>Would you recommend this product?</p>
            <label>
            Yes
            <input name="recommend" type="radio" value="Yes" v-model="recommend"/>
            </label>
            <label>
            No
            <input name="recommend" type="radio" value="No" v-model="recommend"/>
            </label>

            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                // Send product review values to parent component (product) using custom event
                eventBus.$emit('review-submitted', productReview)
                // To reset values after pressing submit change all values to null
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            }
            else {
                this.errors = []
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.recommend) this.errors.push("Recommendation input required.")
            }
        }
    }
})

Vue.component('product',{
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        cart: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" :alt="altText"/>
            </div>
            <div class="product-info">
                <h1> {{ title }} </h1>
                <p> {{ description }} </p>
                <p v-show="onSale"> On sale! </p>
                <p v-if="inStock > 10">In stock</p>
                <p v-else-if="inStock <= 10 && inStock > 0">Almost out of stock</p>
                <p v-else>Out of stock</p>
                <info-tabs :details="details" :shipping="shipping"></info-tabs>
                <p>Item variants:</p>
                <div class="flex-box">
                    <div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId"
                            :style="{backgroundColor: variant.variantColor}" @mouseover="updateProduct(index)">
                    </div>
                </div>
                <p>Sizes:</p>
                <ul>
                    <li v-for="size in sizes"> {{ size }} </li>
                </ul>
            </div>
            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
            <button v-on:click="removeFromCart" :disabled="!variantInCart" :class="{ disabledButton: !variantInCart }">Reduce cart</button>
            <a :href="link" target="_blank">More products like this</a>

            <product-tabs :reviews="reviews"></product-tabs>

        </div>
    `,
    data() {
        return {
            product: 'Socks',
            brand: 'Vue Mastery',
            description: 'A pair of warm, fuzzy socks',
            selectedVariant: 0,
            altText: 'A pair of socks',
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            onSale: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [{variantId: 2234, variantColor: "green", variantQuantity: 15, variantImage: './images/vmSocks-green-onWhite.jpg'},
                       {variantId: 2235, variantColor: "blue",  variantQuantity: 10, variantImage: './images/vmSocks-blue-onWhite.jpg'},
                       {variantId: 2236, variantColor: "red",  variantQuantity:  0, variantImage: './images/vmSocks-red-onWhite.jpg'}],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: []
        }
    },
    methods: {
        addToCart(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart(){
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
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
        },
        shipping ()  {
            if(this.premium) {
                return "Free"
            }
            return 2.99
        },
        variantInCart () {
            if(this.cart.indexOf(this.variants[this.selectedVariant].variantId) > -1 ) {
                return true
            }
            return false
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
  })

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        increaseCart(id) {
            this.cart.push(id)
        },
        reduceCart(id){

            if (this.cart.indexOf(id) > -1) {
                this.cart.splice(this.cart.indexOf(id), 1)
            }
        }
    }
})