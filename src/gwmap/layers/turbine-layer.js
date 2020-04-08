import {
  getLabelIcon
} from './turbine-layer-util'

const turbineLayer = {}

turbineLayer.lonRange = 0
turbineLayer.centerLonLat = [0, 0]
let featureEntityLayer = null
let featureIdSuffix = null
let turbines = null
turbineLayer.load = function (data) {
  turbineLayer.remove()
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

      const turbineId = getTurbineIdByFeatureId(e.feature.id)
      if (e.feature.id.indexOf('_label_') >= 0) {
        // includeLabel=false 定位风机时不包括label标签，加上lable不好定位
        turbineLayer.zoomToFeature(turbineId)
      }
    })
  }

  let maxLon = 0
  let minLon = 180
  let sumLon = 0
  let sumLat = 0
  turbines.forEach(item => {
    sumLon += item.lon
    sumLat += item.lat
    maxLon = item.lon > maxLon ? item.lon : maxLon
    minLon = item.lon < minLon ? item.lon : minLon
    createTurbineModel(item)
  })
  turbineLayer.lonRange = maxLon - minLon
  turbineLayer.centerLonLat = [sumLon / turbines.length, sumLat / turbines.length]
}

// ids为空时显示所有
turbineLayer.filter = function (ids) {
  if (!featureEntityLayer || !turbines) {
    return
  }
  turbineLayer.remove()

  if (!ids) {
    turbineLayer.load(turbines)
    return
  }
  const perTime = ids.length >= 10 ? (5000 / ids.length) : 300 // 间隔一定时间依顺序加载风机
  ids.forEach((id, index) => {
    const item = turbines.find(temp => {
      return temp.id === id
    })
    if (!item) {
      return
    }
    setTimeout(() => {
      createTurbineModel(item)
    }, index * perTime)
  })
}

turbineLayer.zoomToLayer = function () {
  if (!featureEntityLayer) {
    return
  }
  // todo:改善定位
  gwmap.viewer.flyTo(featureEntityLayer.entities, {
    duration: 0,
    offset: new WindEarth.HeadingPitchRange(0, -0.8, turbineLayer.lonRange * 110000 * 1.2)
  })
}

turbineLayer.zoomToFeature = function (turbineId, t, y) {
  const entities = turbineLayer.getTurbineEntities(turbineId, false)
  gwmap.viewer.flyTo(entities, {
    duration: 0,
    offset: new WindEarth.HeadingPitchRange(0, t || -0.4, y || 7300) // default: 300
  })
}

turbineLayer.showHideLabel = function (show = true) {
  if (!featureEntityLayer || !turbines) {
    return
  }
  turbines.forEach(item => {
    featureEntityLayer.removeFeatureEntityById(`${item.id}_label_1`)
  })

  if (show) {
    turbines.forEach(item => {
      const labelEntity = createLabelEntity(item)
      featureEntityLayer.addFeatureEntity(labelEntity)
    })
  }
}

turbineLayer.getTurbineEntities = function (id, includeLabel = true) {
  if (!featureEntityLayer) {
    return null
  }
  if (!featureIdSuffix) {
    featureIdSuffix = getFeatureIdSuffix(includeLabel)
  }
  const entities = []
  featureIdSuffix.forEach(item => {
    const entity = featureEntityLayer.getFeatureEntityById(id + item)
    if (!entity) return
    entities.push(entity)
  })
  return entities
}
turbineLayer.remove = function () {
  if (!featureEntityLayer) {
    return
  }
  featureEntityLayer.removeAll()
  // featureEntityLayer.removeFromViewer()
  // featureEntityLayer = null
}

export default turbineLayer

function createTurbineModel (item) {
  const labelEntity = createLabelEntity(item)
  featureEntityLayer.addFeatureEntity(labelEntity)

  const modelEntities = createTurbineModelEntities(item)
  modelEntities.forEach(entity => {
    featureEntityLayer.addFeatureEntity(entity)
  })
  const bottomEntities = createTurbineBottomEntities(item)
  bottomEntities.forEach(entity => {
    featureEntityLayer.addFeatureEntity(entity)
  })

  const rightEntities = createTurbineRightEntities(item)
  rightEntities.forEach(entity => {
    featureEntityLayer.addFeatureEntity(entity)
  })
}

function getFeatureIdSuffix (includeLabel = true) {
  // const ids = ['_bottom_1', '_bottom_2']
  const ids = ['_bottom_2']
  for (const item in ModelConfig) {
    ids.push(`_model_${item}`)
  }
  if (includeLabel) {
    ids.push('_label_1')

    for (const item in ComponentLabelConfig) {
      ids.push(`_right_${item}`)
    }
  }
  return ids
}

function getTurbineIdByFeatureId (id) {
  if (!id || id.indexOf('_') < 0) return null
  return id.substring(0, id.indexOf('_'))
}

const WHITE_COLOR = '#ffffff'
const GREY_COLOR = '#808080'
const BLUE_COLOR = '#2CD0B9'
const GREEN_COLOR = '#40e052'
const RED_COLOR = '#F20404'

const ModelConfig = {
  1: {
    type: 1,
    url: '/models/205-3.gltf'
  },
  // 2: {
  //   type: 2,
  //   url: '/models/2.5静态.gltf' // 带基础 静态风机整机
  // },
  3: {
    type: 1,
    url: '/models/205-3.gltf', // 不带基础 静态风机整机
    runAnimations: false
  },
  10: {
    type: 10,
    url: '/models/基础.gltf',
    height: 4
  },
  11: {
    type: 11,
    url: '/models/塔筒.gltf'
  },
  // 12: {
  //   type: 12,
  //   url: '/models/机舱.gltf'
  // },
  // 13: {
  //   type: 13,
  //   url: '/models/发动机.gltf'
  // },
  // 14: {
  //   type: 14,
  //   url: '/models/叶片静态.gltf'
  // },
  20: {
    type: 20,
    url: '/models/塔筒机舱.gltf'
  },
  21: {
    type: 21,
    url: '/models/塔筒机舱发电机.gltf'
  }
}

function createTurbineModelEntities (turbineData) {
  const turbineColor = getTurbineColor(turbineData.statues, turbineData.sub_status)
  const models = getTurbineModels(turbineData.sub_status)
  const featureEntities = []
  models.forEach(model => {
    const entity = createTurbineEntity(turbineData, model, turbineColor)
    if (!entity) return
    featureEntities.push(entity)
  })
  return featureEntities
}

function createTurbineEntity (turbineData, model, color) {
  const styleOptions = {
    url: model.url,
    heightReference: 2,
    color: color,
    colorBlendAmount: 0.9,
    colorBlendMode: WindEarth.ColorBlendMode.HIGHLIGHT,
    scale: 1,
    minimumPixelSize: 20, // mytodo
    maximumScale: 5,
    distanceDisplayCondition: {
      near: 0,
      far: 30000
    }
  }
  if (model.hasOwnProperty('runAnimations')) {
    styleOptions.runAnimations = model.runAnimations
  }
  const featureEntity = new WindEarth.ModelFeatureEntity({
    id: turbineData.id + '_model_' + model.type,
    positions: [turbineData.lon, turbineData.lat, model.height || 0],
    orientation: {
      head: 0,
      tilt: 0,
      roll: 0
    },
    styleOptions: styleOptions
  })
  return featureEntity
}

function getTurbineModels (subStatus) {
  const models = []
  switch (subStatus) {
    default:
    case 0:
    case 10:
      break
    case 1:
    case 11:
      models.push(ModelConfig['10'])
      break
    case 20:
      // models.push(ModelConfig['10'])
      models.push(ModelConfig['11'])
      break
    case 21:
      // models.push(ModelConfig['10'])
      // models.push(ModelConfig['11'])
      // models.push(ModelConfig['12'])
      models.push(ModelConfig['20'])
      break
    case 22:
      // models.push(ModelConfig['10'])
      // models.push(ModelConfig['11'])
      // models.push(ModelConfig['12'])
      // models.push(ModelConfig['13'])
      models.push(ModelConfig['21'])
      break
    case 23:
    case 24:
      // models.push(ModelConfig['2'])
      models.push(ModelConfig['3'])
      break
    case 30:
    case 31:
    case 40:
    case 41:
    case 50:
    case 51:
    case 60:
      models.push(ModelConfig['1'])
      break
    case 61:
    case 62:
    case 63:
      models.push(ModelConfig['3'])
      break
  }
  return models
}

function getTurbineColor (status, subStatus) {
  if (subStatus === 63) {
    // 故障
    return RED_COLOR
  }
  switch (status) {
    case 0:
    case 1:
    case 2:
      return GREY_COLOR
    case 3:
      return BLUE_COLOR
    case 4:
      return GREEN_COLOR
    case 5:
    default:
      return WHITE_COLOR
    case 6:
      return WHITE_COLOR
  }
}

function createTurbineBottomEntities (turbineData) {
  const bottomEntities = []
  // // 添加风机底部内外两个椭圆体
  // const bottomEntity1 = new WindEarth.Entity({
  //   id: turbineData.id + '_bottom_1',
  //   position: WindEarth.Cartesian3.fromDegrees(turbineData.lon, turbineData.lat, -2.5),
  //   ellipsoid: {
  //     heightReference: WindEarth.HeightReference.CLAMP_TO_GROUND,
  //     radii: new WindEarth.Cartesian3(30.0, 30.0, 5.0),
  //     //  innerRadii: new WindEarth.Cartesian3(30.0, 30.0, 10.0),
  //     minimumCone: WindEarth.Math.toRadians(20.0),
  //     maximumCone: WindEarth.Math.PI_OVER_TWO,
  //     material: WindEarth.Color.fromCssColorString('rgba(44, 208, 185, 0.5)'),
  //     outline: false
  //   }
  // })
  // bottomEntities.push(bottomEntity1)
  const bottomEntity2 = new WindEarth.Entity({
    id: turbineData.id + '_bottom_2',
    position: WindEarth.Cartesian3.fromDegrees(turbineData.lon, turbineData.lat, -5),
    ellipsoid: {
      heightReference: WindEarth.HeightReference.CLAMP_TO_GROUND,
      radii: new WindEarth.Cartesian3(63.0, 63.0, 3.0),
      // innerRadii: new WindEarth.Cartesian3(30.0, 30.0, 10.0),
      minimumCone: WindEarth.Math.toRadians(20.0),
      maximumCone: WindEarth.Math.PI_OVER_TWO,
      material: WindEarth.Color.fromCssColorString('rgba(44, 208, 185, 0.2)'),
      outline: false
    }
  })
  bottomEntities.push(bottomEntity2)
  // // 添加底部绿色小图标
  // const bottomMarkerEntity = new WindEarth.BillBoardFeatureEntity({
  //   positions: [turbineData.lon, turbineData.lat, 0],
  //   styleOptions: {
  //     url: '/images/markers/turbine_marker.png',
  //     heightReference: 1,
  //     // scale: 1,
  //     width: 24,
  //     height: 24,
  //     distanceDisplayCondition: {
  //       far: 2000
  //     }
  //   }
  // })
  // bottomEntities.push(bottomMarkerEntity)

  return bottomEntities
}

function createLabelEntity (turbineData) {
  if (!turbineData) return null
  const labelIcon = getLabelIcon(turbineData)
  const labelEntity = new WindEarth.BillBoardFeatureEntity({
    id: turbineData.id + '_label_1',
    positions: [turbineData.lon, turbineData.lat, 110],
    styleOptions: {
      url: labelIcon.url,
      heightReference: 1,
      // scale: 1.5,
      width: labelIcon.width,
      height: labelIcon.height,
      eyeOffset: new WindEarth.Cartesian3(0, 0, -200),
      pixelOffset: new WindEarth.Cartesian2(20, 0),
      // pixelOffsetScaleByDistance: new WindEarth.NearFarScalar(0, 100, 5000000, 1000)
      scaleByDistance: new WindEarth.NearFarScalar(2000, 1.2, 7500, 0.5),
      distanceDisplayCondition: {
        far: 50000
      },
      disableDepthTestDistance: 0
    }
  })
  return labelEntity
}

function createTurbineRightEntities (turbineData) {
  // 只有处于接货或吊装状态才有返回值
  if (!turbineData || (turbineData.statues !== 1 && turbineData.statues !== 2)) return []
  const featureEntities = []

  for (const type in ComponentLabelConfig) {
    featureEntities.push(createComponentLabelEntity(turbineData, type, getComponentStatus(turbineData, type), getComponentCount(turbineData, type)))
  }

  return featureEntities
}

// 大部件状态
// 未到货 0
// 到货 1
// 已吊装 2
const ComponentLabelColorConfig = {
  0: 'rgba(235, 242, 228,0)',
  1: 'rgba(44,208,185,1)',
  2: 'rgba(235,242,228,0.4)'
}
// 大部件类型
// 基础 0
// 塔筒 1
// 机舱 2
// 发电机 3
// 叶轮 4
// 叶片 5

const ComponentLabelConfig = {
  1: {
    name: '塔筒',
    enname: 'tower',
    height: 30
  },
  2: {
    name: '机舱',
    enname: 'cabin',
    height: 50
  },
  3: {
    name: '发电机',
    enname: 'dynamo',
    textLeft: 43,
    height: 70
  },
  4: {
    name: '叶轮',
    enname: 'impeller',
    height: 90
  },
  5: {
    name: '叶片',
    enname: 'blade',
    height: 110,
    showNum: true
  }
}

function getComponentStatus (turbineData, type) {
  if (!turbineData) return 0
  // 大状态处于调试、试运行、预验收、质保或小状态处于23、24则表示全部吊装完成
  if ([3, 4, 5, 6].indexOf(turbineData.statues) >= 0 || [23, 24].indexOf(turbineData.sub_status) >= 0) return 2
  switch (turbineData.sub_status) {
    case 20:
      // 塔筒已吊装
      if (['1'].indexOf(type) >= 0) return 2
      break
    case 21:
      // 塔筒、机舱已吊装
      if (['1', '2'].indexOf(type) >= 0) return 2
      break
    case 22:
      // 塔筒、机舱、发电机已吊装
      if (['1', '2', '3'].indexOf(type) >= 0) return 2
      break
  }
  if (!turbineData.components || turbineData.components.length === 0) return 0
  const enname = ComponentLabelConfig[type].enname
  const componentItem = turbineData.components.find(item => item.type === enname)
  return componentItem ? (componentItem.statues > 0 ? 1 : 0) : 0 // 叶片的statues表示到货叶片数量，值域为0、1、2、3，其他值域为0、1
}

function getComponentCount (turbineData, type) {
  if (!turbineData || !turbineData.components || !type || !ComponentLabelConfig.hasOwnProperty(type)) return 0
  const enname = ComponentLabelConfig[type].enname
  const componentItem = turbineData.components.find(item => item.type === enname)
  return componentItem ? componentItem.statues : 0 // 只有叶片的statues表示到货叶片数量
}
// let i = 1

function createComponentLabelEntity (turbineData, type, status, count = null) {
  if (!turbineData) return null
  const labelConfig = ComponentLabelConfig[type]
  // if (i > 2) {
  //   i = 0
  // }
  // status = i++
  var c = document.createElement('canvas')
  c.width = 184
  c.height = 76
  var ctx = c.getContext('2d')
  ctx.fillStyle = ComponentLabelColorConfig[status]

  ctx.beginPath()
  ctx.moveTo(60, 0)
  ctx.lineTo(184, 0)
  ctx.lineTo(184, 16)
  ctx.lineTo(124, 76)
  ctx.lineTo(0, 76)
  ctx.lineTo(0, 60)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(0, 60)
  ctx.quadraticCurveTo(0, 0, 60, 0)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(184, 16)
  ctx.quadraticCurveTo(184, 76, 124, 76)
  ctx.fill()

  if (status === 0) {
    // 未到货
    ctx.setLineDash([16, 8])
    ctx.lineWidth = 6
    ctx.strokeStyle = 'rgba(235, 242, 228,1)'
    ctx.beginPath()
    ctx.moveTo(0, 60)
    ctx.quadraticCurveTo(0, 0, 60, 0)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(184, 16)
    ctx.quadraticCurveTo(184, 76, 124, 76)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(60, 0)
    ctx.lineTo(184, 0)
    ctx.lineTo(184, 16)

    ctx.stroke()

    ctx.beginPath()

    ctx.moveTo(124, 76)
    ctx.lineTo(0, 76)
    ctx.lineTo(0, 60)
    ctx.stroke()
    ctx.fillStyle = 'rgba(235, 242, 228,1)'
  } else {
    ctx.fillStyle = 'rgba(14,23,32,1)'
  }
  ctx.font = '30px bolder Microsoft YaHei'

  ctx.fillText(labelConfig.name, labelConfig.textLeft ? labelConfig.textLeft : 58, 50)

  if (labelConfig.showNum && status !== 0) {
    ctx.fillStyle = 'rgba(226,0,127,1)'
    ctx.beginPath()
    ctx.arc(156, 38, 28, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()

    ctx.font = '30px bolder Microsoft YaHei'
    ctx.fillStyle = 'rgba(255,255,255,1)'
    ctx.fillText(count || '0', 146, 50)
  }
  const url = c.toDataURL('image/png', 1.0)

  const labelEntity = new WindEarth.BillBoardFeatureEntity({
    id: turbineData.id + '_right_' + type,
    positions: [turbineData.lon + 0.0005, turbineData.lat, labelConfig.height],
    styleOptions: {
      url: url,
      heightReference: 2,
      // scale: 1,
      width: 92,
      height: 38,
      // pixelOffset: new WindEarth.Cartesian2(100, 0),
      // scaleByDistance: new WindEarth.NearFarScalar(500, 1, 5000, 0.5),
      distanceDisplayCondition: {
        far: 1000
      }
    }
  })
  return labelEntity
}
