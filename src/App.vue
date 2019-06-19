<template>
  <div id="app">
    <transition name="fade" mode="in-out" type="animation" duration="1000">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
// import { initWechatJs } from '@/common/wechat'
// import { _parseJSON } from '@/common/utils'
export default {
  name: 'App',
  data () {
    return {
      transitionName: ''
    }
  },
  mounted () {
    // this.$nextTick(function () {
    // this.initWechatJs()
    // })
  },
  methods: {
    // initWechatJs () {
    //   this.axios.post('http://coach.realmshow.com/api/webchat-api/pub/signature').then((res) => {
    //     if (res.data.code === 200) {
    //       var wechatSign = _parseJSON(res.data.data)
    //       console.log(wechatSign)
    //       initWechatJs(wechatSign.appId, wechatSign.nonce, wechatSign.timestamp, wechatSign.signature)
    //     }
    //   }).catch((response) => {
    //     console.log(response)
    //   })
    // }
  }
}
</script>

<style lang='scss'>
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
    .fade-enter {
      opacity:0;
    }
    .fade-leave{
      opacity:1;
    }
    .fade-enter-active{
      transition:opacity .5s;
    }
    .fade-leave-active{
      opacity:0;
      transition:opacity .5s;
    }
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
