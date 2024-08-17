<template>
  <div class="container-fluid">
    <div class="row">
      <h2 class="display-2">Welcome to our store</h2>
    </div>
    <div class="row">
      <h4 class="display-4">Recent products</h4>
    </div>
    <div class="row gap-2 justify-content-center" v-if="recentProducts">
      <Card v-for="product in recentProducts" :key="product.productID">
        <template #cardHeader>
          {{ product.productURL }}
          <img :src="product.prodURL" loading="lazy" class="img-fluid" :alt="product.prodName">
        </template>
        <template #cardBody>
          <h5 class="card-title">{{ product.prodName }}</h5>
          <p class="lead">{{ product.prodDescription }}</p>
          <p class="lead">Amount: R{{ product.amount }}</p>
        </template>
      </Card>
    </div>
    <div v-else>
      <Spinner/> 
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card.vue'
import Spinner from '@/components/Spinner.vue'
export default {
  name: 'HomeView',
  components: {
    Card,
    Spinner
  },
  computed: {
    recentProducts() {
      return this.$store.state.recentProducts
    }
  },
  mounted() {
    this.$store.dispatch('recentProducts')
  }
}
</script>
