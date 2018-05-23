export default {
  dateFormat: function(date, fmt) {
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    return fmt
  },
  getDate: function(d, type) {
    type = type || 'yyyy-MM-dd hh:mm'
    if (typeof d !== 'number') {
      d = parseInt(d) * 1000
    }
    return d ? this.dateFormat(new Date(d), type) : type.replace(/[yMdhms]/g, '0')
  },
  formatDate: function(dateStr) {
    var year = dateStr.substring(0, 4)
    var month = dateStr.substring(4, 6)
    var day = dateStr.substring(6, 8)
    var hour = dateStr.substring(8, 10)
    var mins = dateStr.substring(10, 12)
    var second = dateStr.substring(12, 14)
    return year + '-' + month + '-' + day + ' ' + hour + ':' + mins + ':' + second
  },
  getSuccessMethod: function(method) {
    var strTempmethod = method.substring(method.indexOf('.') + 1)
    strTempmethod = strTempmethod.replace(/\./g, '_')
    strTempmethod += '_response'
    return strTempmethod
  },
  // 获取对象数组某一个key值组成的数组
  getKeyArr: function(arr, key) {
    var len = arr.length
    var newarr = []
    for (var i = 0; i < len; i++) {
      if (arr[i] instanceof Object) {
        newarr.push(arr[i][key])
      }
    }
    return newarr
  }
}
