import {
  convertCartesian2Lonlat
} from '@/core/cesium/cesium.util'
import store from '@/store'

const projectLayer = {}
let featureEntityLayer = null
let editFeatureEntityHelper = null
let entity = null
let featureEntity = null
let height = 0
projectLayer.load = function (data, type) {
  projectLayer.remove()
  if (!data && !data.lon && !data.lat) {
    return
  }
  if (!featureEntityLayer) {
    featureEntityLayer = new WindEarth.FeatureEntityLayer(gwmap.viewer, {
      id: 'projectLayer'
    })
  }
  let p1 = new Promise((resolve, reject) => {
    let obj = { ...data }
    const samplePromise = new WindEarth.TerrainSampleTool(gwmap.mapManager.viewer.terrainProvider).getMostDetailHeights([[obj.lon, obj.lat, 0]])
    samplePromise.then((positions) => {
      if (!positions) {
        reject('err')
        return
      }
      height = positions[0][2]
      resolve('ok')
    })
  })
  Promise.all([p1]).then(() => {

    featureEntity = new WindEarth.BillBoardFeatureEntity({
      id: 'project_department',
      name: '项目部',
      positions: [data.lon, data.lat, height],
      styleOptions: {
        url: '/images/markers/project_marker.png',
        heightReference: 1,
        scale: 1,
        color: '#EBF2E4',
        labelStyle: {
          heightReference: 0,
          pixelOffset: new WindEarth.Cartesian2(0, -45),
          // translucencyByDistance: new WindEarth.NearFarScalar(3000000, 1.0, 5000000, 1.0)
        }
      }
    })
    featureEntityLayer.addFeatureEntity(featureEntity)
    if (type == 'startEdit') {
      projectLayer.startEdit()
    }
  }).catch((err)=>{
    console.log(err)
  })
}

projectLayer.zoomToLayer = function () {
  if (!featureEntityLayer) {
    return
  }
  gwmap.viewer.flyTo(featureEntityLayer.entities, {
    duration: 0,
    offset: new WindEarth.HeadingPitchRange(0, -0.4, 8000)
  })
}

// 开启编辑模式 // 取得entity当前图标要素
projectLayer.startEdit = function () {
  if (!editFeatureEntityHelper) {
    editFeatureEntityHelper = new WindEarth.EditFeatureEntityHelper(gwmap.viewer)
    editFeatureEntityHelper.setFeatureEntityEditMode(featureEntityLayer.getFeatureEntityById('project_department'), true)
    setTimeout(() => {
      projectLayer.moveEdit()
    }, 200)
  }
}
// 编辑节点
projectLayer.moveEdit = function () {
  editFeatureEntityHelper && editFeatureEntityHelper.setEditMode(1)
  editFeatureEntityHelper.moveEndEvent.addEventListener(function (event) {
    // console.log(event.entity.coord)
    if (!event) return
    store.commit('projectGeoInfo/projectLocation', { lat: event.entity.coord[1], lon: event.entity.coord[0] })
  })
}
// 停止编辑
projectLayer.stopEdit = function () {
  editFeatureEntityHelper && editFeatureEntityHelper.setEditMode(0)
}
// 修改图标
projectLayer.changeEdit = function (data) {
  if (!data.lon) return
  featureEntity && featureEntity.changeFeatureProperty({
    id: 'project_department',
    name: '项目部',
    positions: [data.lon, data.lat, height],
    styleOptions: {
      url: '/images/markers/project_marker.png',
      heightReference: 1,
      scale: 1,
      color: '#EBF2E4',
      labelStyle: {
        heightReference: 0,
        pixelOffset: new WindEarth.Cartesian2(0, -45)
      }
    }
  })
}

projectLayer.remove = function () {
  if (!featureEntityLayer) {
    return
  }
  featureEntityLayer.removeAll()
  featureEntityLayer.removeFromViewer()
  featureEntityLayer = null
  editFeatureEntityHelper = null
  entity = null
  featureEntity = null

}
export default projectLayer