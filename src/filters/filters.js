import tool from '@/tools/tool.js'
let timeFormat = value => {
  if (value) {
    return tool.dateFormat(new Date(value), 'yyyy-MM-dd hh:mm:ss')
  } else {
    return value
  }
}
let dateFormat = value => {
  return tool.dateFormat(new Date(value), 'yyyy-MM-dd')
}
export {
  timeFormat,
  dateFormat
}
