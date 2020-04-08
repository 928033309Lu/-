import store from '@/store'
const stationLayer = {}
let featureEntityLayer = null
let editFeatureEntityHelper = null
let editFeatureEntityHelperCircle = null
let featureEntityCircle = null
let featureEntity = null
stationLayer.load = function (data, type) {
  stationLayer.remove()
  if (!data || !data.lon || !data.lat) {
    return
  }
  featureEntityLayer = new WindEarth.FeatureEntityLayer(gwmap.viewer, {
    id: 'stationLayer'
  })
  // ---圆点模式
  if (type === 'circle') {
    featureEntityCircle = new WindEarth.BillBoardFeatureEntity({
      id: 'station_Circle',
      // name: '升压站',
      positions: [data.lon, data.lat, 0],
      styleOptions: {
        url: '/images/circle2.png',
        heightReference: 1,
        scale: 1,
        color: '#EBF2E4'
      }
    })
    featureEntityLayer.addFeatureEntity(featureEntityCircle)
    return
  }
  // ---

  featureEntity = new WindEarth.ModelFeatureEntity({
    id: 'station01',
    // name: '升压站',
    positions: [data.lon, data.lat, 0],
    orientation: {
      head: data.angle || 0,
      tilt: 0,
      roll: 0
    },
    styleOptions: {
      url: '/models/station.glb',
      heightReference: 1,
      color: '#bfdec7',
      colorBlendAmount: 0.9,
      colorBlendMode: WindEarth.ColorBlendMode.HIGHLIGHT
    }
  })
  featureEntityLayer.addFeatureEntity(featureEntity)
}
stationLayer.zoomToLayer = function () {
  if (!featureEntityLayer) {
    return
  }
  gwmap.viewer.flyTo(featureEntityLayer.entities, {
    duration: 0,
    offset: new WindEarth.HeadingPitchRange(0, -0.4, 6000)
  })
}
// -------圆点模式-------三维编辑移动模型没返回值，对策，编辑模式，显示圆点来操作
stationLayer.startCircle = function () {
  if (!editFeatureEntityHelperCircle) {
    editFeatureEntityHelperCircle = new WindEarth.EditFeatureEntityHelper(gwmap.viewer)
    editFeatureEntityHelperCircle.setFeatureEntityEditMode(featureEntityLayer.getFeatureEntityById('station_Circle'), true)
    setTimeout(() => {
      stationLayer.moveCircle()
    }, 200)
  }
}
// 编辑圆点
stationLayer.moveCircle = function () {
  editFeatureEntityHelperCircle && editFeatureEntityHelperCircle.setEditMode(1)
  editFeatureEntityHelperCircle && editFeatureEntityHelperCircle.moveEndEvent.addEventListener(function (event) {
    if (!event) return
    store.commit('projectGeoInfo/stationLocation', { lat: event.entity.coord[1], lon: event.entity.coord[0], angle: 100 })
  })
}
// 停止编辑
stationLayer.stopCircle = function () {

}
// 修改图标
stationLayer.changeCircle = function (data) {
  if (!data.lon) return
  featureEntityCircle && featureEntityCircle.changeFeatureProperty({
    id: 'station_Circle',
    // name: '升压站',
    positions: [Number(data.lon), Number(data.lat), 0],
    styleOptions: {
      url: '/images/circle2.png',
      heightReference: 1,
      scale: 1,
      color: '#EBF2E4'
    }
  })
}
stationLayer.removeStation = function () {
  featureEntityLayer && featureEntityLayer.removeFeatureEntityById('station01')
}

// --------模型模式----------
// 开启编辑模式 // 取得entity当前图标要素
stationLayer.startEdit = function () {
  if (!editFeatureEntityHelper) {
    editFeatureEntityHelper = new WindEarth.EditFeatureEntityHelper(gwmap.viewer)
    editFeatureEntityHelper.setFeatureEntityEditMode(featureEntityLayer.getFeatureEntityById('station01'), true)
    setTimeout(() => {
      stationLayer.moveEdit()
    }, 200)
  }
}
// 编辑节点
stationLayer.moveEdit = function () {
  editFeatureEntityHelper && editFeatureEntityHelper.setEditMode(1)
  editFeatureEntityHelper && editFeatureEntityHelper.moveEndEvent.addEventListener(function (event) {
    console.log(event)
    // store.commit('', {  })  //没返回值
  })
}
// 停止编辑
stationLayer.stopEdit = function () {
  editFeatureEntityHelper && editFeatureEntityHelper.setEditMode(0)
}
// 修改图标, 修改模型角度
stationLayer.changeEdit = function (data) {
  featureEntity && featureEntity.changeFeatureProperty({
    id: 'station01',
    // name: '升压站',
    positions: [data.lon, data.lat, 0],
    orientation: {
      head: data.angle || 0,
      tilt: 0,
      roll: 0
    },
    styleOptions: {
      url: '/models/station.glb',
      heightReference: 1
    }
  })
}

stationLayer.remove = function () {
  if (!featureEntityLayer) {
    return
  }
  featureEntityLayer.removeAll()
  featureEntityLayer.removeFromViewer()
  featureEntityLayer = null
  editFeatureEntityHelper = null
  featureEntity = null
  editFeatureEntityHelperCircle = null
  featureEntityCircle = null
}
export default stationLayer
