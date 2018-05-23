export default {
  getCookie(cNname) {
    if (document.cookie.length > 0) {
      var cStart = document.cookie.indexOf(cNname + '=')
      if (cStart !== -1) {
        cStart = cStart + cNname.length + 1
        var cEnd = document.cookie.indexOf(';', cStart)
        if (cEnd === -1) { cEnd = document.cookie.length }
        return unescape(document.cookie.substring(cStart, cEnd))
      }
    }
    return ''
  },
  // expireHours以小时为单位
  setCookie(cNname, value, expireHours) {
    var exdate = new Date()
    exdate.setHours(exdate.getHours() + expireHours)
    document.cookie = cNname + '=' + escape(value) +
    ((expireHours == null) ? '' : ';expires=' + exdate.toGMTString())
  }
}
