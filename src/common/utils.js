export const queryString2Param = () => {
  let match
  let pl = /\+/g
  let search = /([^&=]+)=?([^&]*)/g
  let decode = s => decodeURIComponent(s.replace(pl, ' '))
  let urlParams = {}
  let query = window.location.search.substring(1)
  if (query === '') {
    query = window.location.hash.substring(1)
    query = query.split('?')[1]
  }

  if (!query || query === '') return urlParams
  // eslint-disable-next-line
  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2])
  }
  return urlParams
}

export const getQueryString = (name) => {
  let r = queryString2Param()
  if (r) return r[name]
  return ''
}

export const _parseJSON = str => {
  if (typeof str === 'undefined') {
    return {}
  }
  if (typeof str === 'object') {
    return str
  }
  try {
    return JSON.parse(str)
  // eslint-disable-next-line
  } catch (ex) {}
  // 如果是个纯的字符串，走下面
  // try {
  //   let _json = JSON.parse(JSON.stringify({ obj: str }))
  //   return _json.obj
  // } catch (ex) { }
  // eslint-disable-next-line
  return (new Function("", "return " + str))()
}


export const imgReady = (function() {
  var list = [],
    intervalId = null,
    // 用来执行队列
    tick = function() {
      var i = 0;
      for (; i < list.length; i++) {
        list[i].end ? list.splice(i--, 1) : list[i]();
      }
      !list.length && stop();
    },
    // 停止所有定时器队列
    stop = function() {
      clearInterval(intervalId);
      intervalId = null;
    };
  return function(url, ready, load, error) {
    var onready,
      width,
      height,
      newWidth,
      newHeight,
      img = new Image();
    img.src = url;
    // 如果图片被缓存，则直接返回缓存数据
    if (img.complete) {
      ready.call(img);
      load && load.call(img);
      return;
    }
    width = img.width;
    height = img.height;
    // 加载错误后的事件
    img.onerror = function() {
      error && error.call(img);
      onready.end = true;
      img = img.onload = img.onerror = null;
    };
    // 图片尺寸就绪
    onready = function() {
      newWidth = img.width;
      newHeight = img.height;
      if (
        newWidth !== width ||
        newHeight !== height ||
        newWidth * newHeight > 1024
      ) {
        // 如果图片已经在其他地方加载可使用面积检测
        ready.call(img);
        onready.end = true;
      }
    };
    onready();
    // 完全加载完毕的事件
    img.onload = function() {
      // onload在定时器时间差范围内可能比onready快
      // 这里进行检查并保证onready优先执行
      !onready.end && onready();
      load && load.call(img);
      // IE gif动画会循环执行onload，置空onload即可
      img = img.onload = img.onerror = null;
    };
    // 加入队列中定期执行
    if (!onready.end) {
      list.push(onready);
      // 无论何时只允许出现一个定时器，减少浏览器性能损耗
      if (intervalId === null) intervalId = setInterval(tick, 40);
    }
  };
})();


export const imgLoad = function(url, callback) {
  var img = new Image();
  img.src = url;
  if (img.complete) {
    callback(img.width, img.height);
  } else {
    img.onload = function() {
      callback(img.width, img.height);
      img.onload = null;
    };
  }
};
