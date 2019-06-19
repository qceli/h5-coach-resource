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
