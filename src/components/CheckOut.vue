<template>
  <div class="row justify-content-center">
    <div class="col-lg-3 col-md-6 p-3" v-for="(lesson, index) in cart" :key="index">
      <div class="row">
        <div class="col-3 p-0"> <img class="img-fluid d-block" :src="getImage(lesson.image)"> </div>
        <div class="col-9">
          <p class="lead mb-1"> <b>{{lesson.subject}}</b></p>
          <p class="mb-0">{{lesson.location}}</p>
          <p class="mb-0">{{lesson.price}} AED</p>
          <p class="mb-0">{{lesson.cart_quantity}} in cart</p>
          <button class="btn btn-light text-dark" v-on:click="$emit('remove-item-from-cart',lesson)">Delete <i class="fa fa-trash" aria-hidden="true"></i></button>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="mx-auto col-lg-8">
        <h1>Customer Details</h1>
        <form class="form-inline d-flex justify-content-around">
          <div class="form-group"> <input type="text" class="form-control" v-model="order.name" id="form7" placeholder="Your Name"> </div>
          <div class="form-group"> <input type="text" class="form-control" v-model="order.phone" id="form8" placeholder="Number"> </div>
          <button :disabled="!canCheckout" type="submit" v-on:click="submitOrder(order)"  class="btn btn-primary">Place Order</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "check-out",
  data(){
    return {
      order: {
        name: '',
        phone: '',
      },
    }
  },
  props: {
    cart: {type: Array, required: true},
    submitOrder: {type: Function, required: true},
    getImage: {type: Function, required: true},
  },
  computed: {
    canCheckout() {
      return this.cart.length > 0 && this.order.name.length > 0 && this.order.phone.length > 0 ;
    }
  }
}
</script>

<style scoped>

</style>
