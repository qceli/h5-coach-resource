<template>
  <div class="deal-container">
    <div class="deal-content">
      <div class="logo-img">
        <img src="../assets/images/logo@2x.png">
      </div>
      <div>
        <div class="people-img" ref="box">
          <img :src="secondImg" alt="分享背景图">
        </div>
      </div>
    </div>
    <div class="choose-button">
      <div @click="goBack" class="btn-div">上一步</div>
      <div @click="dealPhoto" class="btn-div last">下一步</div>
    </div>
    <!-- <div @click="testImg">生成图片</div> -->
  </div>
</template>

<script>
export default {
  name: "DealPhoto",
  data() {
    return {
      secondImg: ""
    };
  },
  watch: {},
  mounted() {
    var firstImg = window.localStorage.getItem("firstImg");
    if (!firstImg) {
      return;
    }
    this.secondImg = firstImg;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    dealPhoto() {
      this.$router.push({
        path: "/sharephoto",
        query: {
          id: 1
        }
      });
    }
  }
};
</script>

<style scoped lang='scss'>
.deal-container {
  width: 100%;
  background-image: url(../assets/images/page_bg@2x.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  overflow-x: hidden;
  box-sizing: border-box;
  height: 100%;
  .deal-content {
    .logo-img {
      text-align: center;
      width: 100%;
      margin: 2rem 0;
      img {
        width: 150px;
      }
    }
    .people-img {
      margin-top: 2rem;
      width: calc(100% - 8rem);
      margin: 0 4rem;
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
  }
  .choose-button {
    margin: 2rem 0;
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
