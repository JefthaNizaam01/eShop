<template>
  <div class="wrapper">
    <NavBar />
    <main>
      <router-view />
    </main>
    <Footer/>
  </div>

</template>
<script>
import NavBar from './components/NavBar.vue'
import Footer from '@/components/Footer.vue'
export default {
  components: {
    NavBar,
    Footer
  }
}
</script>
<style src="@/assets/css/style.css">
</style>
