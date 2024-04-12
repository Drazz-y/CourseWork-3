<template>
  <main>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <div class="container"> <a class="navbar-brand" href="#">
        <i class="fa d-inline fa-lg fa-stop-circle"></i>
      </a> <button v-on:click="showCheckout" class="navbar-toggler navbar-toggler-right border-0" type="button" data-toggle="collapse" data-target="#navbar10">
        <span class="navbar-toggler-icon"></span>
      </button>
        <div class="collapse navbar-collapse" id="navbar10">
          <ul class="navbar-nav ml-auto">
            <li v-if="showCartPage" class="nav-item"> <a class="nav-link" href="#" v-on:click="showCheckout">Home</a> </li>
          </ul>
          <button :disabled="cartItemCount < 1" v-on:click="showCheckout" class="btn navbar-btn ml-md-2 btn-light text-dark">{{cartItemCount}} Cart <i class="fa fa-shopping-cart" aria-hidden="true"></i></button>
        </div>
      </div>
    </nav>
    <div class="py-5" v-if="!showCartPage">
      <div class="">
        <div class="d-flex justify-content-between my-2">
          <div style="margin-top: 5px;" class="me-5">
            <label for="sort_by">Sort By:</label>
            <select v-model="sort_by" id="sort_by" class="input ml-2">
              <option disabled value="">None</option>
              <option value="topic">Subject</option>
              <option value="location">Location</option>
              <option value="price">Price</option>
              <option value="spaces">Spaces</option>
            </select>

            <div style="margin-top: 15px;">
              <label for="sort_order">Sort Order:</label>
              <select v-model="sort_order" id="sort_order" class="input ml-2">
                <option disabled value="">None</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>


          <div style="margin-top: 20px;" class="mb-4">
            <label for="search">Search:</label>
            <input v-model="search" id="search" type="search" name="search" class=" input ml-2" />
          </div>
        </div>
      </div>
      <lessons :get-image="getImage" v-on:add-to-cart="addToCart" :can-add-to-cart="canAddToCart" :lessons="filteredLessons" />
    </div>
    <div class="py-5 text-center" v-else>
      <check-out :get-image="getImage" v-on:remove-item-from-cart="removeFromCart" :cart="cart" :submit-order="submitOrder" :can-checkout="canCheckout"/>
    </div>
  </main>
</template>

<script>
import CheckOut from './components/CheckOut.vue'
import Lessons from './components/Lessons.vue'

export default {
  name: 'App',
  components: {
    Lessons,
    CheckOut,
  },
  data() {
    let base_url = 'https://andrew-ebube-cst3145-cw2.onrender.com';
    return {
      lessons: [],
      showCartPage: false,
      search: '',
      sort_by: 'topic',
      sort_order: 'asc',
      sitename: 'Knowledge Store',
      cart: [],
      base_url,
      image_base_url: `${base_url}/public`,
      isLoading: true

    }
  },
  mounted() {
    this.fetchLessons();
  },
  methods: {
    fetchLessons(search = ''){
      this.isLoading = true;
      let endpoint = search.length > 0 ? 'search?q='+search : 'lessons'
      fetch(`${this.base_url}/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
          .then(response => response.json())
          .then(responseJSON => {
            this.lessons = responseJSON;
          })
          .catch((error) => {
            console.log(error)
          }).finally( () => this.isLoading = false)
    },
    addToCart: function (lesson) {
      let item = this.cart.find(({ id }) => id === lesson.id);
      if (item) {
        item.cart_quantity += 1;
        item.spaces -= 1;
      }
      else {
        lesson.spaces -= 1;
        lesson.cart_quantity = 1;
        this.cart.push(lesson);
      }
    },
    removeFromCart(lesson) {
      this.cart.splice(this.cart.indexOf(lesson), 1);
      let item = this.lessons.find(({ id }) => id === lesson.id);
      item.spaces = 5;
      item.cart_quantity = 0;
      if (this.cartItemCount < 1) {
        this.showCartPage = false;
      }
    },
    getImage(image_path){
      return this.image_base_url+'/'+image_path
    },
    showCheckout() {
      this.showCartPage = !this.showCartPage;
    },

    canAddToCart(lesson) {
      return lesson.spaces > 0;
    },
    submitOrder(orderDetails) {
      this.isLoading = true;
      let lessonsInOrder = this.cart.map(item => ({id: item._id, topic: item.topic,location: item.location, numberOfSpaces: item.cart_quantity}));
      fetch(`${this.base_url}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...orderDetails,lessonsInOrder}),
      })
          .then(response => response.json())
          .then(() => {
            alert("Order Submitted.");
            //location.reload();
          })
          .catch((error) => {
            console.log(error)
          }).finally(() => this.isLoading = false)
    },

  },
  computed: {
    filteredLessons: function() {
      let allLessons = [...this.lessons]
      if (this.sort_by === 'topic')
        allLessons.sort((a, b) => (a.topic > b.topic) ? this.sort_order === 'asc' ? 1 : -1 : this.sort_order === 'asc' ? -1 : 1);
      if (this.sort_by === 'location')
        allLessons.sort((a, b) => (a.location > b.location) ? this.sort_order === 'asc' ? 1 : -1 : this.sort_order === 'asc' ? -1 : 1);
      if (this.sort_by === 'price')
        allLessons.sort((a, b) => (a.price > b.price) ? this.sort_order === 'asc' ? 1 : -1 : this.sort_order === 'asc' ? -1 : 1);
      if (this.sort_by === 'spaces')
        allLessons.sort((a, b) => (a.spaces > b.spaces) ? this.sort_order === 'asc' ? 1 : -1 : this.sort_order === 'asc' ? -1 : 1);

      if (this.search.length > 1) {
        let e = this.search.toLowerCase();
        return allLessons.filter((lesson) => (lesson.topic.toLowerCase().indexOf(e) > -1 || lesson.location.toLowerCase().indexOf(e) > -1))
      }

      return allLessons;
    },
    cartItemCount: function () {
      return this.cart.length;
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
