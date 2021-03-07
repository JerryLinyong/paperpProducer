export default function() {
  // 通过url获取登录信息
  let href = window.location.href
  let query = href.substring(href.indexOf('?') + 1)
  let vars = query.split('&')
  let urlParams = {}
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    urlParams[pair[0]] = decodeURIComponent(pair[1])
  }
  return urlParams
}
