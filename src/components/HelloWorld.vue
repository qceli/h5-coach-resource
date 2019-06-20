<template>
  <div class="home-page">
    <div class="home-container">
      <!-- <img src="../assets/images/home_bg@2x.png" /> -->
      <!-- <div class="logo-img"><img src="../assets/images/logo@2x.png"></div> -->
      <div class="home-button">
        <div class="start-button" @click="startPhoto">上传照片</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
    }
  },
  mounted () {
    var url = window.location.href
    if (url.indexOf('?') !== -1) {
      var isLast = this.getQueryString('isLast')
      if (isLast === '1') {
        this.$router.push('/sharephoto')
      }
    }
  },
  methods: {
    // 获取url参数
    getQueryString (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return decodeURI(r[2])
      return null
    },
    startPhoto () {
      this.$router.push('/choosephoto')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home-page {
  position: fixed;
  width: 100%;
  height: 100%;
  //overflow: hidden;
  background-image: url("../assets/images/home_bg_1@2x.jpg");
  background-repeat: no-repeat;
  //background-position: center;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  background-size: cover;
  .home-container {
    width: 100%;
    height: 100%;
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .logo-img {
      width: 150px;
      height: 60px;
      position: absolute;
      right: 25px;
      top: 25px;
      z-index: 2;
      img {
        width: 150px;
        height: 60px;
      }
    }
    .home-button {
      position: absolute;
      bottom: 2%;
      text-align: center;
      z-index: 3;
      width: 100%;
      .start-button {
        margin: 0 auto;
        width: 160px;
        height: 50px;
        padding: 0 15px;
        line-height: 50px;
        box-sizing: border-box;
        font-size: 20px;
        background: #000;
        color: #fff;
        border-radius: 50px;
      }
    }
  }
}
</style>
