// import html2canvas from 'html2canvas'
const shipmentLayer = {}

// 发货图线颜色
// const LINE_COLOR = {
//   0: '#FF61FD', // 基础
//   1: '#01D538', // 塔筒
//   2: '#D1E1EA', // 机舱
//   3: '#00B8C8', // 发电机
//   4: '#B2D607', // 叶轮
//   5: '#E69D00' // 叶片
// }

// 发货图线颜色
const LINE_COLOR = '#D1E1EA'
let featureEntityLayer = null
// let currentTaskFlag = 0
shipmentLayer.load = function (factoryDist, destPoint) {
  shipmentLayer.remove()
  if (!factoryDist || !destPoint) {
    return
  }

  if (!featureEntityLayer) {
    featureEntityLayer = new WindEarth.FeatureEntityLayer(gwmap.viewer, {
      id: 'shipmentLayer'
    })
  }
  // currentTaskFlag = Math.random()
  for (const factoryName in factoryDist) {
    const lineEntity = createLineEntity(factoryDist[factoryName], destPoint)
    featureEntityLayer.addFeatureEntity(lineEntity)

    factoryDist[factoryName].distance = getSurfaceDistance(factoryDist[factoryName].lon, factoryDist[factoryName].lat, destPoint.lon, destPoint.lat)
    // createPopupEntity(currentTaskFlag, factoryDist[factoryName], (popupEntity, taskFlag) => {
    //   if (taskFlag !== currentTaskFlag) return
    //   featureEntityLayer.addFeatureEntity(popupEntity)
    // })
    const popupEntity = createPopupEntity(factoryDist[factoryName])
    featureEntityLayer.addFeatureEntity(popupEntity)
  }
}
shipmentLayer.zoomToLayer = function () {
  if (!featureEntityLayer) {
    return
  }
  gwmap.viewer.flyTo(featureEntityLayer.entities, {
    duration: 0,
    offset: new WindEarth.HeadingPitchRange(0, -0.4, 1800000) // default: 注释这行
  })
}
shipmentLayer.remove = function () {
  if (!featureEntityLayer) {
    return
  }
  featureEntityLayer.removeAll()
  featureEntityLayer.removeFromViewer()
  featureEntityLayer = null
}
export default shipmentLayer

function getSurfaceDistance (lon1, lat1, lon2, lat2) {
  const distance = new WindEarth.EllipsoidGeodesic(WindEarth.Cartographic.fromDegrees(lon1, lat1, 0), WindEarth.Cartographic.fromDegrees(lon2, lat2, 0)).surfaceDistance
  if (isNaN(distance)) return 'NaN'
  return (distance / 1000).toFixed()
}

function createLineEntity (factoryInfo, destPoint) {
  const featureEntity = new WindEarth.ParabolaLineEntity({
    positions: [
      [factoryInfo.lon, factoryInfo.lat, 0],
      [destPoint.lon, destPoint.lat, 0]
    ],
    clampToGround: false,
    width: 8.0,
    maxHeight: 100000,
    type: WindEarth.PolylineMaterialType.FLOW,
    material: {
      color: LINE_COLOR,
      duration: 3000
    }
  })
  // featureEntity.position = WindEarth.Cartesian3.fromDegrees(factoryInfo.lon, factoryInfo.lat, 0)
  // featureEntity.point = {
  //   pixelSize: 8,
  //   color: WindEarth.Color.fromCssColorString(LINE_COLOR),
  //   outlineColor: WindEarth.Color.fromCssColorString('rgba(255,255,255,0.24)'),
  //   outlineWidth: 6,
  //   disableDepthTestDistance: Number.POSITIVE_INFINITY
  //   // heightReference:WindEarth.HeightReference.CLAMP_TO_GROUND
  // }

  return featureEntity
}

function createPopupEntity (factoryInfo) {
  const content = createFactoryContentByCanvas(factoryInfo)
  const popupEntity = new WindEarth.BillBoardFeatureEntity({
    positions: [factoryInfo.lon, factoryInfo.lat, 180],
    styleOptions: {
      url: content.url,
      heightReference: 2,
      width: content.width,
      height: content.height
    }
  })
  return popupEntity
}
// 使用canvas绘制发货地信息框
function createFactoryContentByCanvas (factory) {
  const columnNum = factory.data.length

  let maxRowNum = 0
  factory.data.forEach(item => {
    if (!item.large_parts) return
    maxRowNum = Math.max(maxRowNum, item.large_parts.length)
  })

  const startOffset = 2
  const panelPaddingTopBottom = 15
  const panelPaddingLeftRight = 15
  const titleContentPadding = 15
  const titleFontHeight = 16
  const contentFontHeight = 14
  const conentPadding = 12
  const triHeight = 18
  const triHalfWidth = 10
  const columnWidth = 90

  const contentWidth = columnNum * (columnWidth + panelPaddingLeftRight * 2)
  const contentHeight = panelPaddingTopBottom * 2 + titleFontHeight + titleContentPadding + (maxRowNum + 2) * contentFontHeight + maxRowNum * conentPadding
  const totalWidth = contentWidth + startOffset * 2
  const totalHeight = contentHeight + startOffset * 2 + triHeight

  const titleTextTop = panelPaddingTopBottom + startOffset + titleFontHeight / 2

  var canvas = document.createElement('canvas')
  canvas.width = totalWidth
  canvas.height = totalHeight
  var ctx = canvas.getContext('2d')

  // 绘制背景框和边线
  ctx.beginPath()
  ctx.moveTo(startOffset, startOffset)
  ctx.lineTo(contentWidth + startOffset, startOffset)
  ctx.lineTo(contentWidth + startOffset, contentHeight + startOffset)
  ctx.lineTo((contentWidth / 2 + triHalfWidth) + startOffset, contentHeight + startOffset)
  ctx.lineTo(contentWidth / 2 + startOffset, contentHeight + startOffset + triHeight)
  ctx.lineTo((contentWidth / 2 - triHalfWidth) + startOffset, contentHeight + startOffset)
  ctx.lineTo(startOffset, contentHeight + startOffset)
  ctx.lineTo(startOffset, startOffset)
  ctx.closePath()

  ctx.fillStyle = 'rgba(14,32,53,1)' // mytodo
  ctx.fill()

  ctx.strokeStyle = 'rgba(57,207,184,1)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // 绘制发货厂名称
  ctx.font = '16px Microsoft YaHei'
  ctx.fillStyle = 'rgba(57,207,184,1)'
  let factoryName = factory.name || ''
  if (factoryName.length > 6) {
    factoryName = factoryName.substring(0, 5) + '...'
  }
  ctx.fillText(`${factoryName}`, panelPaddingLeftRight + startOffset, titleTextTop)

  // 绘制机型和部件信息
  ctx.font = '14px Microsoft YaHei'
  ctx.fillStyle = 'rgba(212,239,246,1)'

  let contentTextLeft = 0
  let contentTextTop = 0
  for (let i = 0; i < factory.data.length; i++) {
    contentTextLeft = startOffset + panelPaddingLeftRight + (columnWidth + panelPaddingLeftRight * 2) * i
    contentTextTop = panelPaddingTopBottom + startOffset + titleFontHeight + conentPadding + contentFontHeight / 2

    if (i !== 0) {
      // 绘制间隔线
      ctx.beginPath()
      const lineLeft = contentTextLeft - panelPaddingLeftRight * 1
      const lineHeight = maxRowNum * (contentFontHeight + conentPadding) + conentPadding
      ctx.moveTo(lineLeft, contentTextTop)
      ctx.lineTo(lineLeft, contentTextTop + lineHeight)
      ctx.closePath()
      ctx.strokeStyle = 'rgba(57,207,184,1)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // 绘制机型
    ctx.fillText(`${factory.data[i].turbine_type}`, contentTextLeft, contentTextTop)

    factory.data[i].large_parts.forEach(part => {
      // 绘制部件名称和数量
      contentTextTop = contentTextTop + conentPadding + contentFontHeight
      ctx.fillText(`${part.large_part_name}：${part.large_part_num}件`, contentTextLeft, contentTextTop)
    })
    if (i === 0) {
      // 绘制“距离”一行
      contentTextTop = contentTextTop + conentPadding + contentFontHeight
      ctx.fillText(`距离：${factory.distance}km`, contentTextLeft, contentTextTop)
    }
  }
  return {
    url: canvas.toDataURL('image/png', 1.0),
    width: totalWidth,
    height: totalHeight
  }
}

// function createPopupEntity(taskFlag, factoryInfo, callback) {
//   const content = createFactoryHtml(factoryInfo)
//   document.body.appendChild(content.html)
//   html2canvas(content.html).then(canvas => {
//     document.body.appendChild(canvas)
//     document.body.removeChild(content.html)
//     const url = canvas.toDataURL('image/png', 1.0)
//     const popupEntity = new WindEarth.BillBoardFeatureEntity({
//       positions: [factoryInfo.lon, factoryInfo.lat, 180],
//       styleOptions: {
//         url: url,
//         heightReference: 2,
//         // scale: 1,
//         width: content.width,
//         height: content.height
//         // pixelOffset: new WindEarth.Cartesian2(0, 0),
//         // scaleByDistance: new WindEarth.NearFarScalar(500, 1, 5000, 0.5),
//         // distanceDisplayCondition: {
//         //   far: 50000
//         // }
//       }
//     })
//     callback(popupEntity, taskFlag)
//   })
// }

// 构造HTML再转换为canvas

// function createFactoryHtml (factory) {
//   let partTypeLength = 0
//   factory.data.forEach(item => {
//     partTypeLength = Math.max(partTypeLength, item.large_parts.length)
//   })
//   partTypeLength += 2
//   const contentHeight = 32 * partTypeLength + 46 + 4
//   const contentWidth = 115 * factory.data.length + 10
//   const lineHeight = 32 * partTypeLength - 26
//   const contentHtml = document.createElement('div')
//   contentHtml.style = `position: absolute;
//             top:-10000px;width:${contentWidth}px;height:${contentHeight}px;background:rgba(14,32,53,1);border:1px solid
//             rgba(57,207,184,0.5);opacity:1;border-radius:3px;`
//   let innerHTML = ` <div style="font-size:14px;font-family:Microsoft YaHei;font-weight:bold;color:rgba(57,207,184,1);padding: 12px 15px;">
//                 ${factory.name}</div>`

//   for (let i = 0; i < factory.data.length; i++) {
//     if (i !== 0) {
//       innerHTML += ` <div
//                          style="width: 1px;background: rgba(57,207,184,1);float: left;height: ${lineHeight}px;position:
//                          relative;top: 6px;">
//                      </div>`
//     }

//     innerHTML += `<div style="float: left;padding: 0 15px;">`
//     innerHTML += ` <div
//                          style="font-size:14px;font-family:Microsoft YaHei;font-weight:400;color:rgba(212,239,246,1);padding: 0 0 12px 0;">
//                          ${factory.data[i].turbine_type}</div>`
//     factory.data[i].large_parts.forEach(part => {
//       innerHTML += ` <div
//                     style="font-size:14px;font-family:Microsoft YaHei;font-weight:400;color:rgba(212,239,246,1);padding: 0 0 12px 0;">
//                     ${part.large_part_name}：${part.large_part_num}件</div>`
//     })
//     innerHTML += ` <div
//                    style="font-size:14px;font-family:Microsoft YaHei;font-weight:400;color:rgba(212,239,246,1);padding: 0 0 12px 0;">
//                    距离： <span style="font-size:12px;" >${factory.distance}km</span></div > `
//     innerHTML += ` </div>`
//   }
//   // innerHTML += `<div
//   //                   style="width: 0;position: absolute;top: ${contentHeight + 10}px;left: ${contentWidth / 2 - 10}px;height: 0;border: 20px solid
//   //                   rgba(14,32,53,1);border-bottom: none;border-left-color: transparent;border-right-color:
//   //                   transparent;">
//   //               </div>`
//   contentHtml.innerHTML = innerHTML

//   return {
//     html: contentHtml,
//     width: contentWidth,
//     height: contentHeight
//   }
// }
