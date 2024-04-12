
<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-3 col-md-6 p-3" v-for="(lesson, index) in lessons" :key="index">
        <div class="row">
          <div class="col-3 p-0"> <img class="img-fluid d-block" :src="getImage(lesson.image)" style="height: 100px; width: "> </div>
          <div class="col-9">
            <p class="lead mb-1"> <b>{{lesson.topic}}</b></p>
            <p class="mb-0">{{lesson.location}}</p>
            <p class="mb-0">{{lesson.price}} AED</p>
            <p class="mb-0">{{lesson.spaces}} spaces left</p>
            <button class="btn btn-light text-dark" :disabled="!canAddToCart(lesson)" v-on:click="$emit('add-to-cart',lesson)">Add to Cart <i class="fa fa-shopping-cart" aria-hidden="true"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "check-out",
  props: {
    lessons: {type: Array, required: true},
    canAddToCart: {type: Function, required: true},
    getImage: {type: Function, required: true},
  }
}
</script>

<style scoped>

</style>
