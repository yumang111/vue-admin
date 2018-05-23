/**
 * 验证方法及对应验证规则
 * @param {validateBuildName}                  验证楼栋名：4个以内字母或数字 必填
 * @param {validatePoint1}                     日照：0-24 1位小数
 * @param {validateRate}                       公摊：0-100 2位小数
 * @param {validatePoint2}                     2位小数
 * @param {validateRePoint2}                   2位小数 + 必填
 * @param {unEmpty}                            必填
 * @param {validateInt}                        整数 <=99999999
 * @param {validateInt1}                       0 <= 整数 <=99999999
 * @param {validate400}                        400
 * @param {validatePhone}                      电话号码6-12位验证
 * @param {validateCellPhone}                  手机号 必填
 * @param {validateQQ}                         QQ
 * @param {validataID}                         Object.id 必填
 * @param {validateBillionInt}                 10万以内整数
 * @param {validateHundredInt}                 100以内整数
 * @param {validateHundredPoint1}              100以内 1位小数
 * @param {validateThousandPoint1}             1000以内 1位小数
 */

// 10万以内整数
export function validateBillionInt(rule, value, callback) {
  if (!value) {
    callback()
    return
  } else if (value > 0 && value < 100000 && /^[1-9]*[1-9][0-9]*$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入10万以内正整数'))
  }
}
// 100以内整数
export function validateHundredInt(rule, value, callback) {
  if (!value) {
    callback()
    return
  } else if (value > 0 && value <= 100 && /^[1-9]*[1-9][0-9]*$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入100以内正整数'))
  }
}
// 100以内 1位小数
export function validateHundredPoint1(rule, value, callback) {
  if (!value) {
    callback()
  } else if (value > 0 && value < 100 && /^\d+(\.\d{1})?$/.test(value)) {
    callback()
  } else {
    callback(new Error('数值为0-100,可保留一位小数'))
  }
}
// 1000以内 1位小数
export function validateThousandPoint1(rule, value, callback) {
  if (!value) {
    callback()
  } else if (value > 0 && value < 1000 && /^\d+(\.\d{1})?$/.test(value)) {
    callback()
  } else {
    callback(new Error('数值为0-1000,可保留一位小数'))
  }
}
// 验证楼栋名：4个以内字母或数字 必填
export function validateBuildName(rule, value, callback) {
  if (!value) {
    callback(new Error('楼栋名不能为空'))
  } else if (value.toString().length <= 6 && /^[a-zA-Z0-9|-]+$/.test(value)) {
    callback()
  } else {
    callback(new Error('6个以内字母或数字'))
  }
}
// 日照：0-24 1位小数
export function validatePoint1(rule, value, callback) {
  if (!value) {
    callback()
  } else if (value >= 0 && value <= 24 && /^\d+(\.\d{1})?$/.test(value)) {
    callback()
  } else {
    callback(new Error('日照时间为0-24h,最多一位小数'))
  }
}
// 公摊：0-100 2位小数
export function validateRate(rule, value, callback) {
  if (!value) {
    callback()
  } else if (value >= 0 && value <= 100 && /^\d+(\.\d{1,2})?$/.test(value)) {
    callback()
  } else {
    callback(new Error('数值为0-100%,两位以内小数'))
  }
}
// 2位小数
export function validatePoint2(rule, value, callback) {
  if (!value) {
    callback()
    return
  } else if (value > 99999999) {
    callback(new Error('数值超过限定范围'))
  } else if (value >= 0 && /^\d+(\.\d{1,2})?$/.test(value)) {
    callback()
  } else {
    callback(new Error('大于0的两位以内小数'))
  }
}
// 2位小数 + 必填
export function validateRePoint2(rule, value, callback) {
  if (!value) {
    callback(new Error('不得为空'))
  } else if (value > 99999999) {
    callback(new Error('数值超过限定范围'))
  } else if (value >= 0 && /^\d+(\.\d{1,2})?$/.test(value)) {
    callback()
  } else {
    callback(new Error('大于0的两位以内小数'))
  }
}
// 必填
export function unEmpty(rule, value, callback) {
  if (!value) {
    callback(new Error('输入不能为空'))
  } else {
    callback()
  }
}
// 整数
export function validateInt(rule, value, callback) {
  if (value === '' || value === '0' || value === 0) {
    callback()
    return
  } else if (value > 99999999) {
    callback(new Error('数值超过限定范围'))
  } else if (/^[1-9]*[1-9][0-9]*$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入整数'))
  }
}
// 整数 + 0
export function validateInt1(rule, value, callback) {
  if (value > 99999999) {
    callback(new Error('数值超过限定范围'))
  } else if (/^[1-9]*[1-9][0-9]*$/.test(value) || value === 0 || value === '0') {
    callback()
  } else if (!value) {
    callback(new Error('不得为空'))
  } else {
    callback(new Error('请输入整数'))
  }
}
export function validate400(rule, value, callback) {
  if (!value) {
    callback()
    return
  } else if (/^400-[0-9]{3}-[0-9]{4}$/.test(value)) {
    callback()
  } else {
    callback(new Error('格式不正确'))
  }
}
// 电话号码6-12位验证
export function validatePhone(rule, value, callback) {
  if (!value) {
    callback()
    return
  } else if (/^\d{6,12}$/.test(value)) {
    callback()
  } else {
    callback(new Error('格式不正确'))
  }
}
// 手机号验证 必填
export function validateCellPhone(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!(/^1[345789]\d{9}$/.test(value.replace(/\s+/g, '')))) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
export function validateQQ(rule, value, callback) {
  if (!value) {
    callback()
    return
  } else if (/^[1-9][0-9]{4,14}$/gim.test(value)) {
    callback()
  } else {
    callback(new Error('格式不正确'))
  }
}
export function validataID(rule, value, callback) {
  if (!value.name) {
    callback()
    return
  } else if (!value.id) {
    callback(new Error('请选择系统中含有的'))
  } else {
    callback()
  }
}
