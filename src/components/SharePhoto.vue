<template>
  <div class="deal-container" ref="boxz">
    <!--<div class="choose-bg">-->
    <!--<img src="../assets/images/page_bg@2x.png" />-->
    <!--</div>-->
    <div class="deal-content">
      <div class="logo-img">
        <img src="../assets/images/logo@2x.png">
      </div>
      <!-- <div> -->
      <div v-show="!fromshare" class="people-img" ref="box">
        <img crossorigin="anonymous" :src="secondImg" >
        <!-- <img :src="cvsimg" alt="分享背景图" @load=""> @load="" -->
        
      </div>
      <div v-show="fromshare" class="share-img" ref="sharebox">
        <img crossorigin="anonymous" :src="shareUrl" alt="分享图">
      </div>
      <!-- </div> -->
    </div>
    <div class="note-text">
      <div>您到专属合影已生成</div>
      <div>点击右上角分享至朋友圈</div>
    </div>
    <!-- <img class="sss" :src="testImg" @click="test"> -->
  </div>
</template>

<script>
import { _parseJSON } from "../common/utils";
import html2canvas from "html2canvas";
import { initWechatJs } from "../common/wechat";
import $ from "jquery";

function UrlParameters() {
  let name, value;
  let str = location.origin + location.search;
  let num = str.lastIndexOf("?");
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
  name: "SharePhoto",
  data() {
    return {
      secondImg: "",
      params: "",
      fromshare: false,
      shareUrl: "",
      testImg: "",
      cvsimg: require("../assets/images/album_11@2x.png")
    };
  },
  mounted() {
    var id = this.$route.query.id;
    // console.log(decodeURIComponent(params))
    if (!id) {
      this.fromshare = true;
      let url = "";
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // 安卓端
      var sharefromAddroid = window.location.href.indexOf("sourceandroid") > -1;
      var sharefromIos = window.location.href.indexOf("sourceios") > -1;
      if ((isAndroid || sharefromAddroid) && !sharefromIos) {
        var pageUrl = window.location.href;
        // alert(pageUrl)
        var index = pageUrl.lastIndexOf("url=");
        var params = pageUrl.substring(index + 4, pageUrl.length);
        // alert(params)
        url = decodeURIComponent(params);
        //
      } else {
        const queries = new UrlParameters() || {};
        url = queries["url"];
        // alert(url)
      }
      // alert(url)
      this.shareUrl = url;
      // this.shareInfo(pageUrl, params)
    } else {
      var firstImg = window.localStorage.getItem("firstImg");
      if (!firstImg) {
        alert("error");
        return;
      }
      
      this.secondImg = firstImg;
      
      this.loadImg()
      //alert(this.this.secondImg)
    }
  },
  methods: {
    shareInfo(link, imgUrl) {
      this.axios
        .post("http://coach.realmshow.com/api/webchat-api/pub/signature")
        .then(res => {
          if (res.data.code === 200) {
            var wechatSign = _parseJSON(res.data.data);
            console.log(wechatSign);
            initWechatJs(
              wechatSign.appId,
              wechatSign.nonce,
              wechatSign.timestamp,
              wechatSign.signature,
              "/sharephoto",
              link,
              imgUrl
            );
          }
        })
        .catch(response => {
          console.log(response);
        });
    },
    loadImg() {
      // alert("******")
      //alert(this.secondImg) 
      var id = this.$route.query.id;
      // console.log(decodeURIComponent(params))
      if (id != 1) {
        return;
      }

      const loadImage = aSrc => {
        const img = new Image();
        const p = new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
        img.src = aSrc;
        return p;
      };

      Promise.all([
        loadImage(this.secondImg),
        loadImage(require("../assets/images/sign.png"))
      ]).then(([img, sig]) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const sigsize = canvas.width * 0.4;
        const offx = canvas.width * 0.1 + sigsize;
        const offy = canvas.height * 0.1 + sigsize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        ctx.drawImage(sig, canvas.width - offx, canvas.height - offy, sigsize, sigsize);
        return canvas;
      }).then(canvas => {
        var lastImg = URL.createObjectURL(
          this.base64ToBlob(canvas.toDataURL())
        );
        this.secondImg = lastImg;
        this.testImg = lastImg;
        this.getImgUrl(canvas.toDataURL());
      }).catch(e => {
        //   alert("出错了")
        //    alert(e)
        console.log("==========", e);
      });
    },
    base64ToBlob(code) {
      let parts = code.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    },
    getImgUrl(baseImg) {
      var that = this;
      that.axios
        .post("http://coach.realmshow.com/api/file/upload", {
          filecontent: baseImg
        })
        .then(res => {
          if (res.data.code === 200) {
            var content = _parseJSON(res.data.data);
            that.shareUrl = content.url;
            var u = navigator.userAgent;
            var link = location.origin + "/h5";
            var imgurl = location.origin + "/h5/star.png";
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // 安卓端
            if (isAndroid) {
              //alert("android");
              link =
                link + "/#SharePhoto?&" + "&sourceandroid=1&url=" + content.url;
              that.shareInfo(link, imgurl);
            } else {
              link = link + "?&sourceios=1&url=" + content.url + "#SharePhoto";
              that.shareInfo(link, imgurl);
            }
          }
        })
        .catch(response => {
          console.log(response);
          //alert("getImgUrl(baseImg) error");
        });
    }
  }
};
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

  .sss {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 50px;
    height: 80px;
  }
  .deal-content {
    .logo-img {
      text-align: center;
      width: 100%;
      margin-bottom: 2rem;
      img {
        width: 150px;
      }
    }
    .starsigned {
      margin: 0 4rem;
      width: calc(100% - 8rem);
      line-height: 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .people-img {
      margin: 0 4rem;
      width: calc(100% - 8rem);
      img {
        width: 100%;
        height: 100%;
      }
      .model-img {
        width: 100%;
        position: relative;
        top: -10.5rem;
        right: 1.5rem;
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
