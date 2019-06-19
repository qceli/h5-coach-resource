<template>
  <div class="choose-container">
    <!-- <div class="choose-bg">
      <img src="../assets/images/page_bg@2x.jpg" />
    </div> -->
    <div class="logo-img"><img src="../assets/images/logo@2x.png" /></div>
    <div class="camera-img"><img src="../assets/images/take_photo@2x.png" /></div>
    <div class="choose-button">
      <div @click="openAlbum(1)" class="btn-div">上传照片</div>
      <div @click="openAlbum(2)" class="btn-div">摄像头</div>
    </div>
  </div>
</template>

<script>
import {openCameraForPic, initWechatJs} from '../common/wechat'
import { _parseJSON } from '../common/utils'
export default {
  name: 'ChoosePhoto',
  data () {
    return {
    }
  },
  mounted () {
    this.initWechatJs()
  },
  methods: {
    initWechatJs () {
      this.axios.post('http://coach.realmshow.com/api/webchat-api/pub/signature').then((res) => {
        if (res.data.code === 200) {
          var wechatSign = _parseJSON(res.data.data)
          console.log(wechatSign)
          initWechatJs(wechatSign.appId, wechatSign.nonce, wechatSign.timestamp, wechatSign.signature)
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    openAlbum (type) {
      var that = this
      console.log('openAlbum')
      openCameraForPic(type, function (localIds) {
        console.log(localIds[0])
        window.localStorage.setItem('localIds', (localIds[0]))
        that.$router.push('/choosealbum')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.choose-container {
  position: fixed;
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/page_bg@2x.png");
  background-repeat: no-repeat;
  background-position: center;
  left: 50%;
  transform: translateX(-50%);
  background-size: cover;
//   .choose-bg {
//     position: relative;
//     width: 100%;
//     height: 100%;
//     z-index: -999;
//     img {
//       width: 100%;
//       height: 100%;
//     }
//   }
  .logo-img {
    position: absolute;
    top: 3rem;
    text-align: center;
    width: 100%;
    img {
      width: 150px;
    }
  }
  .camera-img {
    position: absolute;
    top: 180px;
    text-align: center;
    width: 100%;
    img {
      width: 150px;
    }
  }
  .choose-button {
    position: absolute;
    bottom: 100px;
    text-align: center;
    width: 100%;
    .btn-div {
      width: 160px;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      text-align: center;
      background: #000;
      color: #fff;
      padding: 0 15px;
      box-sizing: border-box;
      margin: 0 auto;
      border-radius: 50px;
    }
    :first-child {
      margin-bottom: 20px;
    }
  }
}
</style>
