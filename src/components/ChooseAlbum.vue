<template>
  <div class="choose-container">
    <!--<div class="choose-bg">-->
    <!--<img src="../assets/images/page_bg@2x.png" />-->
    <!--</div>-->
    <div class="choose-contant">
      <div class="logo-img">
        <img src="../assets/images/logo@2x.png">
      </div>
<!-- 
v-hammer:pan="onPan"
          v-hammer:panend="onPanend"
          v-hammer:pinch="pinchMove"
          v-hammer:pinchstart="pinchStart"
          v-hammer:rotate="rotateFun" -->
      <!-- localIds <div class="test-img" ref="testImg"><img :src="localIds" alt="" @load="loadImg"></div> -->
      <div class="photo-img" ref="pageDiv">
        <div
          class="people-img"
          ref="box"
          
        >
          <div class="album-img-bg">
            <img :src="albumImg">
          </div>
          <div class="upload-photo">
            <img crossorigin="anonymous" :src="localIds" ref="photo">
          </div>
          <div class="model-img">
            <img src="../assets/images/star.png">
          </div>
        </div>
      </div>
    </div>

    <div class="album-text">选择您喜欢的相框</div>
    <div class="ablum-list">
      <ul>
        <li v-for="(album, index) in albumArray" :key="index">
          <img :src="album" @click="changeAlbum(album)">
        </li>
      </ul>
    </div>
    <div class="choose-button">
      <!-- <button @click="movePhoto">{{movePhotoFlg? '确定' : '取消'}}</button> -->
      <div @click="goBack" class="btn-div">上一步</div>
      <div @click="dealPhoto" class="btn-div last">下一步</div>
    </div>
    <!-- <img class="sss" :src="testImg"> -->
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { _parseJSON, imgLoad } from "../common/utils";
import wx from "weixin-js-sdk";
import $ from "jquery";
import "jquery.panzoom";
// import { setTimeout } from 'timers'
// import { Indicator } from 'mint-ui'
// import { initWechatJs } from '@/common/wechat'

export default {
  name: "ChooseAlbum",
  data() {
    return {
      localIds: "",
      imgUrl: "",
      // mousedownState: false, // 鼠标默认抬起
      // iX: 0, // 鼠标坐标 与 拖拽按钮 间距 x
      // iY: 0, // 鼠标坐标 与 拖拽按钮 间距 y
      albumArray: [
        require("../assets/images/album_11@2x.png"),
        require("../assets/images/album_22@2x.png"),
        require("../assets/images/album_33@2x.png")
      ],
      albumImg: require("../assets/images/album_11@2x.png"),

      // ggwp: "http://img5.imgtn.bdimg.com/it/u=3300305952,1328708913&fm=26&gp=0.jpg",
       ggwp: "http://192.168.1.6:9999/abc.jpeg",
      // photoIndex: 1000,
      // photoLeft: 0,
      // photoTop: 0,
      // movePhotoFlg: true
      photoWidth: "",
      photoHeight: "",
      testImg: "",
      imgw: 420,
      imgH: 620,
      deltaX: "",
      deltaY: "",
      dataZoom: "",
      scaleIndex: ""
    };
  },
  mounted() {
    if ($(".upload-photo img").width() > 0) this.setupPanzoom();
    $(".upload-photo img").on("load", () => this.setupPanzoom());
  },
  beforeMount() {
    var that = this;
    var localIds = window.localStorage.getItem("localIds");
    if (!localIds) return;
    // var u = navigator.userAgent
    // var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //安卓端
    // var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    // if (isIos) {
    //   window.wx.getLocalImgData({
    //     localId: localIds,
    //     success: function (res) {
    //       var localData = res.localData
    //       that.localIds = localData
    //     }
    //   })
    // } else {
    //
    // }
    wx.uploadImage({
      localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: function(respons) {
        // 返回图片的服务器端ID
        that.axios
          .get(
            `http://coach.realmshow.com/api/webchat-api/file/upload?media_id=${
              respons.serverId
            }`
          )
          .then(res => {
            if (res.data.code === 200) {
              console.log("res", res);
              var content = _parseJSON(res.data.data);
              var ourImg = content.url;
              that.localIds = ourImg;
              // that.getImageSize();
            }
          })
          .catch(response => {
            console.log(response);
          });
      }
    });
  },
  methods: {
    onPan(event) {
      this.deltaX = event.deltaX;
      this.deltaY = event.deltaY;
      this.$refs.photo.style.transform = `translate(${this.deltaX}px,${
        this.deltaY
      }px) scale(${this.dataZoom})`;
    },
    onPanend(event) {
      const photoLeft = Number(this.$refs.photo.style.left.slice(0, -2));
      const photoTop = Number(this.$refs.photo.style.top.slice(0, -2));
      this.$refs.photo.style.left = this.deltaX + photoLeft + "px";
      this.$refs.photo.style.top = this.deltaY + photoTop + "px";
      this.$refs.photo.style.transform = `translate(0px,0px) scale(${
        this.dataZoom
      })`;
    },
    pinchMove(event) {
      this.dataZoom = this.scaleIndex * event.scale;
      this.$refs.photo.style.transform = "scale(" + this.dataZoom + ")";
    },
    pinchStart(event) {
      this.scaleIndex = this.dataZoom || 1;
    },
    rotateFun(e) {
      console.log(e, "旋转");
    },
    getImageSize() {
      imgLoad(this.imgUrl, (w, h) => {
        this.imgw = w;
        this.imgH = h;
        this.setupPanzoom();
      });
    },
    setupPanzoom() {
        const img = $('.upload-photo img');
        const container = img.parent();
        const sx = container.width() / img.width();
        const sy = container.height() / img.height();
        const scale = Math.max(sx, sy);
        console.log("s:", sx, sy);
        img.panzoom("destroy");
        img.panzoom({
          contain: false,//"invert",
          startTransform: scale < 1 ? `scale(${Math.max(scale, 1)}) translate(-50%, 0)` : `scale(${scale})`,
          minScale: scale,
          maxScale: scale * 5
        });
    },
    loadImg() {
      // var img = new Image()
      // img.src = this.localIds
      // var imgWidth = img.width
      // var imgHeight = img.height
      // alert('imgWidth:' + imgWidth)
      // alert('imgHeight:' + imgHeight)
      // if (imgHeight > imgWidth) {
      //   alert(111)
      //   this.photoWidth = '200px'
      //   this.photoHeight = 'auto'
      // } else {
      //   alert(222)
      //   this.photoHeight = this.$refs.box.clientHeight + 'px'
      //   this.photoWidth = 'auto'
      // }
    },
    goBack() {
      this.$router.go(-1);
    },
    changeAlbum(album) {
      this.albumImg = album;
    },
    // movePhoto () {
    //   console.log(111)
    //   var movePhotos = !this.movePhotoFlg
    //   this.movePhotoFlg = movePhotos
    //   if (!movePhotos) {
    //     this.photoIndex = 0
    //   } else {
    //     this.photoIndex = 1000
    //   }
    // },
    dealPhoto() {
      var that = this;
      // that.photoIndex = 0
      // Indicator.open({
      //   text: '图片上传中，请稍后...',
      //   spinnerType: 'fading-circle'
      // })
      // setTimeout(html2canvas(that.$refs.box, {
      //   async: true,
      //   allowTaint: true,
      //   taintTest: true,
      //   useCORS: true
      // }).then(function (canvas) {
      //   console.log(canvas)
      //   console.log(canvas.toDataURL())
      //   that.imgUrl = URL.createObjectURL(that.base64ToBlob(canvas.toDataURL()))
      //   window.localStorage.setItem('firstImg', canvas.toDataURL())
      //   Indicator.close()
      //   that.$router.push('/dealphoto')
      // }), 3000)
      html2canvas(this.$refs.box, {
        async: true,
        allowTaint: true,
        taintTest: true,
        useCORS: true
        //dpi: window.devicePixelRatio
      }).then(canvas => {
        console.log(canvas);
        console.log(canvas.toDataURL());
        this.imgUrl = URL.createObjectURL(
          this.base64ToBlob(canvas.toDataURL())
        );
        window.localStorage.setItem("firstImg", canvas.toDataURL());
        this.testImg = canvas.toDataURL();
        this.$router.replace("/dealphoto");
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
    }
    /* 鼠标按下事件 */
    // onmousedown (event) {
    //   console.log(event)
    //   // this.photoIndex = 1000
    //   /* 此处判断  pc 或 移动端 得到 event 事件 */
    //   var touch
    //   if (event.touches) {
    //     touch = event.touches[0]
    //   } else {
    //     touch = event
    //   }
    //   // 鼠标点击 面向页面 的 x坐标 y坐标
    //   let { clientX, clientY } = touch
    //   // 鼠标x坐标 - 拖拽按钮x坐标  得到鼠标 距离 拖拽按钮 的间距
    //   this.iX = clientX - this.$refs.actionMgr.offsetLeft
    //   // 鼠标y坐标 - 拖拽按钮y坐标  得到鼠标 距离 拖拽按钮 的间距
    //   this.iY = clientY - this.$refs.actionMgr.offsetTop
    //   // 设置当前 状态为 鼠标按下
    //   this.mousedownState = true
    // },
    // /* 鼠标移动事件 */
    // onmousemove (event) {
    //   // console.log(event)
    //   // this.photoIndex = 1000
    //   // 鼠标按下 切移动中
    //   if (this.mousedownState) {
    //     /* 此处判断  pc 或 移动端 得到 event 事件 */
    //     var touch
    //     if (event.touches) {
    //       touch = event.touches[0]
    //     } else {
    //       touch = event
    //     }
    //     // 鼠标移动时 面向页面 的 x坐标 y坐标
    //     let { clientX, clientY } = touch
    //     // 当前页面全局容器 dom 元素  获取容器 宽高
    //     let {
    //       clientHeight: pageDivY,
    //       clientWidth: pageDivX
    //     } = this.$refs.pageDiv
    //     /* 鼠标坐标 - 鼠标与拖拽按钮的 间距坐标  得到 拖拽按钮的 左上角 x轴y轴坐标 */
    //     let [x, y] = [clientX - this.iX, clientY - this.iY]

    //     // 拖拽按钮 dom 元素  获取 宽高 style 对象
    //     let {
    //       clientHeight: actionMgrY,
    //       clientWidth: actionMgrX,
    //       style: actionMgrStyle
    //     } = this.$refs.actionMgr
    //     // 此处判断 拖拽按钮 如果超出 屏幕宽高 或者 小于
    //     // 设置 屏幕最大 x=全局容器x y=全局容器y 否则 设置 为 x=0 y=0
    //     if (x > pageDivX - actionMgrX) x = pageDivX - actionMgrX
    //     else if (x < 0) x = 0
    //     if (y > pageDivY - actionMgrY) y = pageDivY - actionMgrY
    //     else if (y < 0) y = 0
    //     // 计算后坐标  设置 按钮位置
    //     actionMgrStyle.left = `${x}px`
    //     actionMgrStyle.top = `${y}px`
    //     actionMgrStyle.bottom = 'auto'
    //     actionMgrStyle.right = 'auto'
    //     console.log(x, y)
    //     this.photoLeft = x + 'px'
    //     this.photoTop = y + 'px'
    //     // 当按下键滑动时阻止屏幕滑动事件
    //     //event.preventDefault()
    //   }
    // },
    // /* 鼠标抬起事件 */
    // onmouseup (event) {
    //   console.log(event)
    //   // 设置当前状态为鼠标抬起
    //   this.mousedownState = false
    //   // this.photoIndex = 0
    // }
  }
};
</script>

<style scoped lang='scss'>
.choose-container {
  width: 100%;
  height: 100%;
  background-image: url(../assets/images/page_bg@2x.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  overflow-x: hidden;

  .sss {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 50px;
    height: 80px;
  }
  .choose-bg {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: -999;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .choose-contant {
    padding-top: 2rem;
    /*position: absolute;*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*top: 0;*/
    box-sizing: border-box;
    .logo-img {
      margin: 0 auto 1.5rem 0;
      text-align: center;
      width: 100%;
      img {
        width: 120px;
      }
    }
    .test-img {
      height: 100%;
      width: 100%;
      display: none;
    }
    .photo-img {
      .people-img {
        margin: 0 auto;
        width: 200px;
        height: 297.4px;
        position: relative;
        overflow: hidden;
        .album-img-bg {
          position: relative;
          z-index: 999;
          line-height: 0;
          pointer-events: none;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .upload-photo {
          position: absolute;
          overflow: hidden;
          top: 0;
          bottom: 0;
          z-index: 0;
          background-size: cover;
          background-position: center;
          width: 100%;
          height: 100%;
        //   img {
        //     position: absolute;
        //     left: 0;
        //     top: 0;
        //   }
          //   img {
          //     width: 100%;
          //     height: 100%;
          //   }
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        .model-img {
          position: absolute;
          right: 0.5rem;
          top: 4rem;
          z-index: 99;
          background: transparent;
          pointer-events: none;
          img {
            width: 7.5rem;
            background: transparent;
          }
        }
      }
      .share-img {
        display: none;
        width: 100%;
        line-height: 0;
        img {
          width: 100%;
        }
      }
    }
  }
  .album-text {
    margin: 17px auto 13px auto;
    text-align: center;
  }
  .ablum-list {
    ul {
      padding: 0;
      width: 100%;
      li {
        display: inline-block;
        img {
          background-color: #d3d3d4;
          width: 60px;
          margin: 0 5px;
        }
      }
    }
  }
  .choose-button {
    // margin: 0 3rem 2rem 3rem;
    /*margin: 0 1rem 2rem 1rem;*/
    text-align: center;
    // width: calc(100% - 6rem);
    width: 100%;
    display: flex;
    justify-content: center;
    .btn-div {
      width: 120px;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      text-align: center;
      background: #000;
      color: #fff;
      padding: 0 15px;
      box-sizing: border-box;
      border-radius: 50px;
      margin-right: 20px;
    }
    .last {
      margin-right: 0;
    }
  }
}
</style>
