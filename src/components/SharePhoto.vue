<template>
  <div class="deal-container">
    <!--<div class="choose-bg">-->
    <!--<img src="../assets/images/page_bg@2x.png" />-->
    <!--</div>-->
    <div class="deal-content">
      <div class="logo-img">
        <img src="../assets/images/logo@2x.png">
      </div>
      <div>
        <div class="people-img" ref="box">
          <img :src="secondImg" alt="分享背景图" @load="loadImg">
          <div class="model-img">
            <img src="../assets/images/sign.png">
          </div>
        </div>
        <div class="share-img" ref="sharebox">
          <img :src="imgUrl" crossorigin="anonymous" alt="分享图">
        </div>
      </div>
    </div>
    <div class="note-text">
      <div>您到专属合影已生成</div>
      <div>点击右上角分享至朋友圈</div>
    </div>
    <!-- <div @click="testImg">生成图片</div> -->
  </div>
</template>

<script>
import { _parseJSON } from '../common/utils'
import html2canvas from 'html2canvas'
import { initWechatJs } from '../common/wechat'

function UrlParameters() {
  let name, value;
  let str = window.location.href
  let num = str.indexOf("?");
  str = str.substr(num + 1); //取得所有参数   stringlet.substr(start [, length ]

  let arr = str.split("&"); //各个参数放到数组里
  for (let i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      this[name] = value;
    }
  }
}

export default {
  name: 'SharePhoto',
  data () {
    return {
      secondImg: '',
      imgUrl: '',
      params: ''
    }
  },
  mounted () {
    var id = this.$route.query.id
    var pageUrl = window.location.href
    alert(pageUrl)
    var index = pageUrl.lastIndexOf('url=')
    //var params = pageUrl.substring(index + 4, pageUrl.length)
    const queries = new UrlParameters() || {};
    const url = queries["url"];
    alert(url)
    // console.log(decodeURIComponent(params))
    if (!id) {
      this.$refs.box.style.display = 'none'
      this.imgUrl = url // decodeURIComponent(params)
      // this.shareInfo(pageUrl, params)
    } else {
      this.$refs.sharebox.style.display = 'none'
      var firstImg = window.localStorage.getItem('firstImg')
      if (!firstImg) {
        return
      }
      this.secondImg = firstImg
    }
    // setTimeout(this.testImg, 3000)
  },
  methods: {
    shareInfo (link, imgUrl) {
      this.axios.post('http://coach.realmshow.com/api/webchat-api/pub/signature').then((res) => {
        if (res.data.code === 200) {
          var wechatSign = _parseJSON(res.data.data)
          console.log(wechatSign)
          // alert(link)
          initWechatJs(wechatSign.appId, wechatSign.nonce, wechatSign.timestamp, wechatSign.signature, '/sharephoto', link, imgUrl)
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    loadImg () {
      console.log('loadImg')
      // 做初始化动作
      // var heightStyle = this.$refs.imgbox.style.height
      // console.log('heightStyle:' + heightStyle)
      // if (this.imgUrl) return
      this.testImg()
      // this.$refs.sharebox.style.height = heightStyle
    },
    base64ToBlob (code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
    },
    testImg () {
      var that = this
      html2canvas(that.$refs.box, {
        async: true,
        allowTaint: true,
        taintTest: true,
        useCORS: true,
        backgroundColor: null,
        foreignObjectRendering: true,
        dpi: window.devicePixelRatio
      }).then(function (canvas) {
        // console.log(canvas)
        console.log(canvas.toDataURL())
        var lastImg = URL.createObjectURL(
          that.base64ToBlob(canvas.toDataURL())
        )
        that.imgUrl = lastImg
        that.$refs.box.style.display = 'none'
        that.$refs.sharebox.style.display = ''
        that.getImgUrl(canvas.toDataURL())
      })
    },
    getImgUrl (baseImg) {
      var that = this
      that.axios.post('http://coach.realmshow.com/api/file/upload', {
        filecontent: baseImg
      }).then(res => {
        if (res.data.code === 200) {
          var content = _parseJSON(res.data.data)
          that.imgUrl = content.url
          // var link = window.location.href

        //   alert(location.origin)
        //   alert(location.search)
        //   alert(link)
        //   alert(content.url)
          var u = navigator.userAgent

          var link = location.origin + '/h5/#sharephoto?'
        //   var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // 安卓端
        //   if (isAndroid) {
        //     link = 'http://coach.realmshow.com/h5/#sharephoto?from=singlemessage' + '&url=' + content.url
        //   } else {
        //     link = link + '&url=' + content.url
        //   }
          link = link + 'url=' + content.url
          // var params = getQueryString('url')
          // alert('shenghai')
          // alert(link)
          that.shareInfo(link, content.url)
        }
      }).catch(response => {
        console.log(response)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.deal-container {
  width: 100%;
  height: 100%;
  background-image: url(../assets/images/page_bg@2x.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  overflow-x: hidden;
  padding-top: 3rem;
  box-sizing: border-box;
  .deal-content {
    .logo-img {
      text-align: center;
      width: 100%;
      margin-bottom: 2rem;
      img {
        width: 150px;
      }
    }
    .people-img {
      margin: 0 4rem;
      width: calc(100% - 8rem);
      line-height: 0;
      img {
        width: 100%;
        height: 100%;
      }
      .model-img {
        width: 100%;
        position: relative;
        top: -10.5rem;
        right: 1.5rem;
        line-height: 0;
        img {
          width: 5rem;
          height: 5rem;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 10;
        }
      }
    }
    .share-img {
      // margin-top: 2rem;
      width: calc(100% - 8rem);
      margin: 0 4rem;
      line-height: 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .note-text {
    margin-top: 2rem;
    text-align: center;
  }
}
</style>
