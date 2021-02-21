<template>
  <div id="app">
    <router-view></router-view>
  </div>

</template>

<script>


export default {
  name: 'App',
  components: {
    
  },
  created(){
    this.$http.get(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`).then((response) => {
      // console.log(response.data);
    })  
  }
}
</script>

<style lang='scss'>
  @import "@/assets/all.scss";
</style>
