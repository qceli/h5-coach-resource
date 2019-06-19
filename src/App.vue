<template>
  <div id="app">
    <transition :name="transitionName"  mode="out-in">
      <!-- <keep-alive> -->
          <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      transitionName: 'fade'
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang='scss'>
.fade-enter-active {
  opacity: 0.78;
  transition: opacity 0.2s
}

.fade-leave-active {
    opacity: 0.78;
    transition: opacity 0.2s
}

.fade-enter {
  opacity: 0.5;
  transition: opacity 0.2s
}

.fade-leave-to {
    opacity: 0.5;
    transition: opacity 0.2s
}
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    // .fade-enter {
    //   opacity:0;
    // }
    // .fade-leave{
    //   opacity:1;
    // }
    // .fade-enter-active{
    //   transition:opacity .5s;
    // }
    // .fade-leave-active{
    //   opacity:0;
    //   transition:opacity .5s;
    // }
  }
}
button {
  border: 0;
  width: 160px;
  height: 50px;
  line-height: 50px;
  background-color: #000000;
  color: #ffffff;
  border-radius: 50px;
}
.mint-indicator {
  .mint-indicator-wrapper {
    z-index: 9999;
    .mint-indicator-text {
      font-size: 10px !important;
    }
  }
}
</style>
