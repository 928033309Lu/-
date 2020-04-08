import {
  getLabelIcon
} from './turbine-layer-util'
import store from '@/store/index'
const turbineEditLayer = {}

let featureEntityLayer = null
let drawFeatureEntityHelper = null
let editFeatureEntityHelper = null
let turbines = null
let currentEditMode = -1
turbineEditLayer.dispatch = (type, data) => {
  // console.log(`${type}:${JSON.stringify(data)}`)
  store.commit('hoist/getLayerPlan', data)
}

turbineEditLayer.load = function (data) {
  turbineEditLayer.remove()
  turbines = data
  if (!data) {
    return
  }
  if (!featureEntityLayer) {
    featureEntityLayer = new WindEarth.FeatureEntityLayer(gwmap.viewer, {
      id: 'turbineLayer'
    })
    featureEntityLayer.bindMouseEventFunc(WindEarth.MouseEventType.LEFT_CLICK, function (e) {
      if (!e || !e.feature) return

      // 如果处于移动和删除状态，则禁止zoomTo
      if (currentEditMode !== -1) {
        return
      }
      turbineEditLayer.zoomToFeature(e.feature.id)
    })
  }

  turbines.forEach(item => {
    const labelEntity = createLabelEntity(item)
    featureEntityLayer.addFeatureEntity(labelEntity)
  })
}

turbineEditLayer.zoomToFeature = function (turbineId, t, y) {
  const entities = featureEntityLayer.getFeatureEntityById(turbineId)
  gwmap.viewer.flyTo(entities, {
    duration: 0,
    offset: new WindEarth.HeadingPitchRange(0, t || -1, y || 4000)
  })
}

turbineEditLayer.remove = function () {
  if (!featureEntityLayer) {
    return
  }

  turbineEditLayer.switchEditMode(-1)
  featureEntityLayer.removeAll()
  featureEntityLayer.removeFromViewer()
  featureEntityLayer = null

  drawFeatureEntityHelper = null
  editFeatureEntityHelper = null
  turbines = null
  currentEditMode = -1
}

turbineEditLayer.addTurbines = function (turbineDatas) {
  if (!turbineDatas || !turbineDatas.hasOwnProperty(length)) return
  if (!turbines) {
    turbineEditLayer.load(turbineDatas)
    return
  }
  turbineDatas.forEach(item => {
    const labelEntity = createLabelEntity(item)
    featureEntityLayer.addFeatureEntity(labelEntity)
  })
  turbines = turbines.concat(turbineDatas)
  // const item = {
  //   components: [],
  //   crane: '',
  //   lon: turbineData.coord[0],
  //   lat: turbineData.coord[1],
  //   statues: 0,
  //   sub_status: 0
  //   // id: "15#",
  //   // turbine_id: 521,
  //   // turbine_type: "121/2000"
  // }
}

turbineEditLayer.deleteTurbines = function (turbineIds) {
  if (!turbineIds || !turbineIds.hasOwnProperty(length)) return
  turbineIds.forEach(id => {
    const index = turbines.findIndex(item => {
      return item.id === id
    })
    if (index >= 0) {
      turbines.splice(index, 1)
    }
    const entity = featureEntityLayer.getFeatureEntityById(id)
    featureEntityLayer.removeFeatureEntity(entity)
  })
}

turbineEditLayer.switchEditMode = function (editMode) {
  if (currentEditMode === editMode) return

  if (!drawFeatureEntityHelper) {
    drawFeatureEntityHelper = new WindEarth.DrawFeatureEntityHelper(gwmap.viewer)
  }

  if (!editFeatureEntityHelper) {
    editFeatureEntityHelper = new WindEarth.EditFeatureEntityHelper(gwmap.viewer)
    editFeatureEntityHelper.moveEndEvent.addEventListener(function (event) {
      if (!event || !event.entity) return

      // 修改风机坐标
      const turbineData = turbines.find(item => {
        return item.id === event.entity.id
      })
      if (!turbineData) return

      const dispatchData = {
        id: event.entity.id
      }
      switch (currentEditMode) {
        case 1: // 编辑（ 移动）
          turbineData.lon = event.entity.coord[0]
          turbineData.lat = event.entity.coord[1]
          dispatchData.coord = event.entity.coord
          break
        case 4: // 编辑（纠偏）
          // todo：计算变化量
          dispatchData.varxy = getVarXY(turbineData.lon, turbineData.lat, event.entity.coord[0], event.entity.coord[1])
          break
      }

      if (turbineEditLayer.dispatch) {
        turbineEditLayer.dispatch(currentEditMode, dispatchData)
      }
    })
  }
  // 停止当前操作
  switch (currentEditMode) {
    case 0: // 添加
      drawFeatureEntityHelper.stopDrawFeatureEntity()
      break
    case 1: // 编辑（移动）
    case 4: // 编辑（纠偏）
      editFeatureEntityHelper.setEditMode(0)
      break
    case 2: // 删除
      editFeatureEntityHelper.setEditMode(0)
      editFeatureEntityHelper.removeListener('onDeleted')
      break
  }
  currentEditMode = editMode
  // 开启新的操作
  switch (editMode) {
    case 0: // 添加
      drawFeatureEntityHelper.drawModelFeature({
        styleOptions: {
          url: 'url'
        }
      }, function (model) {
        // todo: 通知外部添加风机
        if (turbineEditLayer.dispatch) {
          turbineEditLayer.dispatch(0, model.coord)
        }
        // 一次只能添加一个风机
        turbineEditLayer.switchEditMode(-1)
      })
      break
    case 1: // 编辑（移动）
    case 4: // 编辑（纠偏）
      // 设置当前的编辑模式为节点编辑
      editFeatureEntityHelper.setEditMode(1)
      featureEntityLayer.entities.values.forEach((entity) => {
        editFeatureEntityHelper.setFeatureEntityEditMode(entity, true)
      })
      break
    case 2: // 删除
      // 设置当前的编辑模式为点选删除
      editFeatureEntityHelper.setEditMode(2)
      featureEntityLayer.entities.values.forEach((entity) => {
        editFeatureEntityHelper.setFeatureEntityEditMode(entity, true)
      })
      // 设置要素Entity点选后的监听事件，在要素选中时触发
      editFeatureEntityHelper.addListener('onDeleted', function (event) {
        if (!event.feature || !event.feature.id) return
        if (turbineEditLayer.dispatch) {
          turbineEditLayer.dispatch(2, event.feature.id)
        }
        return false
        // return confirm('是否删除?')
      })
      break
  }
}
export default turbineEditLayer

function createLabelEntity (turbineData) {
  if (!turbineData) return null
  const labelIcon = getLabelIcon(turbineData)
  const labelEntity = new WindEarth.BillBoardFeatureEntity({
    id: turbineData.id,
    positions: [turbineData.lon, turbineData.lat, 0],
    styleOptions: {
      url: labelIcon.url,
      heightReference: 1,
      // scale: 1,
      width: labelIcon.width,
      height: labelIcon.height,
      pixelOffset: new WindEarth.Cartesian2(0, 0),
      scaleByDistance: new WindEarth.NearFarScalar(1000, 1, 5000, 0.5),
      distanceDisplayCondition: {
        far: 50000
      }
    }
  })
  return labelEntity
}

function getVarXY (lon1, lat1, lon2, lat2) {
  const varx = getSurfaceDistance(lon1, lat1, lon2, lat1) * (lon2 - lon1 >= 0 ? 1 : -1)
  const vary = getSurfaceDistance(lon1, lat1, lon1, lat2) * (lat2 - lat1 >= 0 ? 1 : -1)
  console.log(`${varx}|${vary}`)
  return [varx, vary]
}

function getSurfaceDistance (lon1, lat1, lon2, lat2) {
  const distance = new WindEarth.EllipsoidGeodesic(WindEarth.Cartographic.fromDegrees(lon1, lat1, 0), WindEarth.Cartographic.fromDegrees(lon2, lat2, 0)).surfaceDistance
  if (isNaN(distance)) return 'NaN'
  return distance
}
