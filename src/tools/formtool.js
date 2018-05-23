export default {
  /* 检查是否两位小数
   *value [string] 验证的值
   *min   [number] 验证范围的最小值
   *max   [number] 验证范围的最大值
   *name  [string] 提示内容的关键字
   *required [boolean] 是否必填，1非必填
   */
  checkNumFloat (value, min, max, required) {
    if (value) {
      var numReg = /^[0-9](\.\d{1,2})?$|^[1-9]\d+(\.\d{1,2})?$/
      if (!numReg.test(value)) {
        return '请输入整数或两位小数'
      } else if (value < min) {
        return '请输入大于' + min + '的整数或两位小数'
      } else if (value > max) {
        return '请输入小于' + max + '的整数或两位小数'
      }
    } else {
      if (required === '1') {
        return ''
      } else {
        return '不能为空'
      }
    }
  },
  /* 检查是否整数
   *value [string] 验证的值
   *min   [number] 验证范围的最小值
   *max   [number] 验证范围的最大值
   *name  [string] 提示内容的关键字
   *required [boolean] 是否必填，true必填
   */
  checkNumInt (value, min, max, name, required) {
    var names = name ? (name + ',') : ''
    var target = value
    if (target.toString().length) {
      var numReg = /^[1-9]\d*|0$/
      if (!numReg.test(value)) {
        return names + '请输入整数'
      } else if (value < min) {
        return names + '请输入大于或等于' + min + '的整数'
      } else if (value > max) {
        return names + '请输入小于或等于' + max + '的整数'
      }
    } else if (required) {
      return names + '不能为空'
    } else {
      return ''
    }
  },
  checkNumInt2 (value, min, max, name, required) {
    var names = name ? (name + ',') : ''
    var target = value
    if (target.toString().length) {
      var numReg = /^[1-9]\d*|0$/
      if (!numReg.test(value) || value.toString().indexOf('.') > -1) {
        return names + '请输入整数'
      } else if (value < min) {
        return names + '请输入大于或等于' + min + '的整数'
      } else if (value > max) {
        return names + '请输入小于或等于' + max + '的整数'
      }
    } else if (required) {
      return names + '不能为空'
    } else {
      return ''
    }
  }
}
