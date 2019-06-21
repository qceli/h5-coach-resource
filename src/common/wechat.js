// 微信相关的方法
//const wx = window.wx || {};

import wx from "weixin-js-sdk";
//var isLogin = false;
export const initWechatJs = (
  appId,
  nonceStr,
  timestamp,
  signature,
  router,
  link,
  imgUrl
) => {
  wx.config({
    debug: false,
    appId: appId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: [
      "checkJsApi",
      "chooseImage",
      "uploadImage",
      "onMenuShareTimeline",
      "getLocalImgData",
      "onMenuShareAppMessage",
    ]
  });
  wx.ready(function() {
    wx.onMenuShareTimeline({
      title: "COACH和任嘉伦一起表爱意", // 分享时的标题
      link: link, // 分享时的链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享时显示的图标
      success: function() {
        console.log();
      },
      cancel: function() {
        //alert("取消分享");
      }
    });
    wx.onMenuShareAppMessage({
      title: "COACH和任嘉伦一起表爱意", // 分享标题
      desc: "COACH腕表和任嘉伦一起表爱意。", // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图片
      success: function success(res) {
        // alert('已分享');
        // alert(uuu);
      },
      cancel: function cancel(res) {
        //alert('已取消');
      },
      fail: function fail(res) {
        //alert(JSON.stringify(res));
      }
    });
  });
  wx.error(function(res) {
    //alert("微信验证失败");
  });
};

export const openCameraForPic = function(type, uploadCallback) {
  var sourceType = [];
  if (type === 1) {
    sourceType.push("album");
  } else {
    sourceType.push("camera");
  }
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
    success: function(res) {
      var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
      console.log(localIds);
      if (uploadCallback && typeof uploadCallback === "function") {
        uploadCallback(localIds);
      }
    },
    error: function(e) {
      //alert(e);
    }
  });
};
