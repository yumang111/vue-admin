/* eslint-disable */
export function BMP() {
  return new Promise(function (resolve, reject) {
    window.onload = function () {
      resolve(BMapLib)
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
