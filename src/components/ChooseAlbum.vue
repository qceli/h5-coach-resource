<template>
  <div class="choose-container">
    <div class="choose-contant">
      <div class="logo-img">
        <img src="../assets/images/logo@2x.png">
      </div>
      <div class="photo-img" ref="pageDiv">
        <div class="people-img" ref="box">
          <div class="album-img-bg">
            <img :src="albumImg">
          </div>
          <div class="upload-photo">
            <img :src="localIds">
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
export default {
  name: "ChooseAlbum",
  data() {
    return {
      localIds: "",
      imgUrl: "",
      albumArray: [
        require("../assets/images/album_1@2x.png"),
        require("../assets/images/album_2@2x.png"),
        require("../assets/images/album_3@2x.png")
      ],
      albumImg: require("../assets/images/album_1@2x.png"),
      photoWidth: "",
      photoHeight: "",
      testImg: "",
      dpi: 1.5
    };
  },
  beforeMount() {
    var that = this;
    var localIds = window.localStorage.getItem("localIds");
    if (!localIds) return;
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
              var content = _parseJSON(res.data.data);
              var ourImg = content.url;
              that.localIds = ourImg;
              that.getImageSize();
            }
          })
          .catch(response => {
            console.log(response);
          });
      }
    });
  },
  methods: {
    getImageSize() {
      // alert(this.localIds);
      imgLoad(this.localIds, (w, h) => {
        this.dpi = h / w;
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    changeAlbum(album) {
      this.albumImg = album;
    },
    dealPhoto() {
      // alert(this.dpi);
      html2canvas(this.$refs.box, {
        async: true,
        allowTaint: true,
        taintTest: true,
        useCORS: true,
        scale: this.dpi,
        width: 800,
        height: 1200,
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
        position: relative;
        overflow: hidden;
        .album-img-bg {
          position: relative;
          z-index: 999;
          line-height: 0;
          img {
            width: 200px;
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
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .model-img {
          position: absolute;
          right: 0.5rem;
          top: 4rem;
          z-index: 99;
          background: transparent;
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
    text-align: center;
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
