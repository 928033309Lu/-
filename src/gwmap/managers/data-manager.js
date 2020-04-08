import fieldLayer from '../layers/field-layer'
import turbineLayer from '../layers/turbine-layer'
import craneLayer from '../layers/crane-layer'
import projectLayer from '../layers/project-layer'
import stationLayer from '../layers/station-layer'
import roadLayerPoint from '../layers/road-layer-point'
import roadLayerOver from '../layers/road-layer-over'
import roadLayerEdit from '../layers/road-layer-edit'
import shipmentLayer from '../layers/shipment-layer'
import turbineEditLayer from '../layers/turbine-edit-layer'
import store from '../../store'

const dataManager = {}
dataManager.fieldLayer = fieldLayer // 场区范围图层
dataManager.turbineLayer = turbineLayer // 风机图层
dataManager.craneLayer = craneLayer // 塔吊图层
dataManager.roadLayerPoint = roadLayerPoint // 机位道路图层
dataManager.roadLayerOver = roadLayerOver // 场外道路图层
dataManager.roadLayerEdit = roadLayerEdit // 场内道路图层
dataManager.projectLayer = projectLayer // 项目点位图层
dataManager.stationLayer = stationLayer // 升压站图层
dataManager.shipmentLayer = shipmentLayer // 发货图层
dataManager.turbineEditLayer = turbineEditLayer // 发货图层

// 缩放到指定图层
dataManager.locat2Layer = function (type, postion) {
  switch (type) {
    case 'turbine':
      dataManager.turbineLayer.zoomToLayer()
      break
    case 'field':
      dataManager.fieldLayer.zoomToLayer()
      break
    case 'road':
    default:
      dataManager.roadLayerEdit.zoomToLayer()
      break
    case 'project':
      dataManager.projectLayer.zoomToLayer()
      break
    case 'station':
      dataManager.stationLayer.zoomToLayer()
      break
    case 'shipment':
      dataManager.shipmentLayer.zoomToLayer()
      break
  }
}
dataManager.locat2LayerNew = function () {
  let postion = store.state.screen.pit_road_postion
  if (postion && postion.pit_road_min && postion.pit_road_max) {
    dataManager.roadLayerEdit.zoomToLayer(null, null, postion.pit_road_min, postion.pit_road_max)
  } else {
    dataManager.roadLayerEdit.zoomToLayer()
  }
}

// 缩放到指定要素
dataManager.locat2FeatureById = function (type, id) {
  switch (type) {
    case 'crane':
      dataManager.craneLayer.zoomToFeautre(id)
      break
  }
}

export default dataManager
