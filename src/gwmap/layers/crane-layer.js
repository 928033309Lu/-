const craneLayer = {}

let featureEntityLayer = null
let cranes = null
craneLayer.load = function (data) {
  craneLayer.remove()
  cranes = data
  if (!data) {
    return
  }
  if (!featureEntityLayer) {
    featureEntityLayer = new WindEarth.FeatureEntityLayer(gwmap.viewer, {
      id: 'craneLayer'
    })

    featureEntityLayer.bindMouseEventFunc(WindEarth.MouseEventType.LEFT_CLICK, function (e) {
      if (!e || !e.feature) return

      if (e.feature.id.indexOf('_label') >= 0) {
        const craneId = e.feature.id.substring(0, e.feature.id.indexOf('_label'))
        craneLayer.zoomToFeautre(craneId)
      }
    })
  }

  data.forEach(item => {
    if (!item.lon || !item.lat) return
    const modelConfig = getCraneModelConfig(item.crane_type)

    const modelEntity = createCraneModelEntities(item, modelConfig)
    featureEntityLayer.addFeatureEntity(modelEntity)
    const labelEntity = createCraneLabelEntity(item, modelConfig.height)
    featureEntityLayer.addFeatureEntity(labelEntity)
  })
}

craneLayer.zoomToFeautre = function (craneId, r, t) {
  if (!craneId || !featureEntityLayer) {
    return
  }
  const entity = featureEntityLayer.getFeatureEntityById(craneId)

  if (!entity) return
  gwmap.viewer.flyTo(entity, {
    duration: 0,
    offset: new WindEarth.HeadingPitchRange(0, r || -0.4, t || 1100) // -0.6  , default: 400
  })
}

craneLayer.showHideLabel = function (show = true) {
  if (!featureEntityLayer || !cranes) {
    return
  }
  cranes.forEach(item => {
    featureEntityLayer.removeFeatureEntityById(`${item.crane_id}_label`)
  })

  if (show) {
    cranes.forEach(item => {
      const labelEntity = createCraneLabelEntity(item)
      featureEntityLayer.addFeatureEntity(labelEntity)
    })
  }
}

craneLayer.remove = function () {
  if (!featureEntityLayer) {
    return
  }
  cranes = null
  featureEntityLayer.removeAll()
  // featureEntityLayer.removeFromViewer()
  // featureEntityLayer = null
}
export default craneLayer

function createCraneModelEntities(item, modelConfig) {
  const featureEntity = new WindEarth.ModelFeatureEntity({
    id: item.crane_id,
    positions: [item.lon, item.lat, 0],
    orientation: {
      head: modelConfig.head,
      tilt: 0,
      roll: 0
    },
    styleOptions: {
      url: modelConfig.url,
      heightReference: 1,
      scale: modelConfig.scale,
      runAnimations: false,
      colorBlendAmount: 1,
      colorBlendMode: WindEarth.ColorBlendMode.HIGHLIGHT,
      color: '#694b03',
      minimumPixelSize: 250,
      maximumScale: modelConfig.scale * 5,
      distanceDisplayCondition: {
        near: 0,
        far: 30000
      }
    }
  })

  return featureEntity
}

function createCraneLabelEntity(item, height) {
  if (!item) return null
  const url = getLabelIcon(item)
  const labelEntity = new WindEarth.BillBoardFeatureEntity({
    id: item.crane_id + '_label',
    positions: [item.lon, item.lat, height],
    styleOptions: {
      url: url,
      heightReference: 2,
      // scale: 1,
      width: 110,
      height: 47,
      pixelOffset: new WindEarth.Cartesian2(0, 0),
      scaleByDistance: new WindEarth.NearFarScalar(2000, 1.2, 7500, 0.5),
      distanceDisplayCondition: {
        far: 50000
      }
    }
  })
  return labelEntity
}

function getLabelIcon(item) {
  var c = document.createElement('canvas')
  c.width = 220
  c.height = 94
  var ctx = c.getContext('2d')
  ctx.fillStyle = '#FDB509'
  ctx.beginPath()
  ctx.arc(43, 43, 43, Math.PI * 1.5, Math.PI * 0.5, true)
  ctx.arc(177, 43, 43, Math.PI * 0.5, Math.PI * 1.5, true)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(102, 86)
  ctx.lineTo(118, 86)
  ctx.lineTo(110, 94)
  ctx.fill()

  ctx.font = '24px bolder Microsoft YaHei'
  ctx.fillStyle = 'rgba(95,72,46,1)'
  let text = item.main_crane_model
  if (text.length > 9) {
    text = text.substring(0, 7) + '...'
  }
  ctx.fillText(text, 40, 55)
  const url = c.toDataURL('image/png', 1.0)
  return url
}

// todo:吊车模型url配置修改
const ModelConfig = {
  // 0: {
  //   url: '/models/crane.gltf',
  //   head: 180,
  //   scale: 2.5,
  //   height: 180
  // },
  0: {
    url: '/models/履带吊06.gltf',
    head: 180,
    scale: 0.7,
    height: 230
  },
  1: {
    url: '/models/汽车吊.gltf',
    head: 0,
    scale: 1,
    height: 180
  }
}

function getCraneModelConfig(craneType) {
  switch (craneType) {
    case '履带吊':
      return ModelConfig[0]
    case '汽车吊':
      return ModelConfig[1]
    default:
      console.log(`【提示】没有找到“${craneType}”对应的吊车模型。`)
      return ModelConfig[0]
  }
}