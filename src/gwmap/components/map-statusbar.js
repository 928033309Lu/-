// 地图状态栏组件
const mapStatusBar = {}
mapStatusBar.element = document.createElement('div')
mapStatusBar.element.id = 'map-status-bar'
mapStatusBar.element.classList.add('map-status-bar')

let cesiumWidgetsFunc = null
let getElevationTimer = null
/**
 * 组件入口
 */
mapStatusBar.init = function (viewer) {
  if (!viewer) return
  // 三维地图
  if (!cesiumWidgetsFunc) {
    cesiumWidgetsFunc = new WindEarth.WidgetsFunc(viewer)
    cesiumWidgetsFunc.bindStatusInfoFunc(infos => {
      if (infos) {
        updateStatus(infos.longitude, infos.latitude, infos.cameraHeight)
      } else {
        updateStatus()
      }
    })
  }
}

/**
 * 更新地图状态栏信息
 * @param {*} lon
 * @param {*} lat
 * @param {*} cameraHeight
 */
const updateStatus = function (lon, lat, cameraHeight) {
  if (getElevationTimer) {
    clearTimeout(getElevationTimer)
  }
  if (!lon && !lat && !cameraHeight) {
    mapStatusBar.element.innerHTML = ''
    return
  }
  mapStatusBar.element.innerHTML = `<span>经度：</span>${formatNumber(lon)}° <span>纬度：</span>${formatNumber(lat)}° ${cameraHeight ? `<span>视角高度：</span>${cameraHeight}m` : ''}`

  // 延迟获取高程和投影坐标，减少不必要的请求或转换次数
  getElevationTimer = setTimeout(() => {
    apiServices.getElevation(lon, lat).then((res) => {
      const height = res && res.elevation
      if (height < 0) return
      mapStatusBar.element.innerHTML += `<span>海拔：</span>${height}m`
    })
  }, 500)
}

export default mapStatusBar

function formatNumber (number, fixed = 4) {
  if (!number || isNaN(number)) return number

  return Number(Number(number).toFixed(fixed)) // toFixed返回字符串
}
