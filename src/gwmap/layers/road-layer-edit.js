import Vue from 'vue'
let v = new Vue()
const roadLayerEdit = {}
let roadLineModule = null
roadLayerEdit.load = function (data) {
  roadLayerEdit.remove()
  if (!data) return
  if (!roadLineModule) {
    roadLineModule = new WindEarth.RoadLineModule(gwmap.viewer)
    roadLineModule.defaultStyle.lineStyle.material = WindEarth.Color.fromCssColorString('#FFFCD8')
    roadLineModule && roadLineModule.parseJsonData(data)
  }
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

roadLayerEdit.zoomToLayer = function (t, r, pit_road_min, pit_road_max) {
  let num = null
  if (pit_road_min && pit_road_max) {
    let distance = getVarXY(pit_road_min[0], pit_road_min[1], pit_road_max[0], pit_road_max[1])
    num = Number((distance[0] + 8000))
  }
  roadLineModule && roadLineModule.layerLocation({
    duration: 0,
    offset: new WindEarth.HeadingPitchRange(0, t || -0.4, r || num || 0)
  })
  // roadLineModule && roadLineModule.layerLocation()
}
roadLayerEdit.showHide = function (visible) {
  roadLineModule && roadLineModule.setLineVisible(visible)
}

roadLayerEdit.remove = function () {
  roadLineModule && roadLineModule.removeAll(false)
  if (roadLineModule) roadLineModule = null
}
// 开启编辑模式
roadLayerEdit.startEdit = function () {
  roadLineModule && roadLineModule.startEdit()
}
// 新增加点
roadLayerEdit.addNode = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.createNewLine()
}
// 节点编辑
roadLayerEdit.nodeEdit = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.setEditMode(1)
}
// 打断节点
roadLayerEdit.breakEdit = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.setEditMode(5)
}
// 合并节点
roadLayerEdit.combineNode = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.setEditMode(6)
}
// 删除节点
roadLayerEdit.delEdit = function () {
  if (roadLineModule) {
    roadLineModule.setEditMode(2)
    let deleteEvent = function (event) {
      let res = confirm('是否删除该段道路?')
      return res
    }
    roadLineModule.addListener('onDeleted', deleteEvent)

    // roadLineModule.addListener('onDeleted', function (event) {
    //   v.$alert('这是一段内容', '标题名称', {
    //     confirmButtonText: '确定',
    //     callback: action => {
    //       console.log(action)
    //       if (action === 'confirm') {
    //         return true
    //       } else {
    //         return false
    //       }
    //     }
    //   })
    // })
  }
}

// 回滚
roadLayerEdit.rollBack = function (data = {}) {
  roadLineModule && roadLineModule.rollBack(data)
}
// 查询是否存在编辑
roadLayerEdit.getStatus = function () {
  if (roadLineModule) {
    return roadLineModule.getChangedStatus()
  }
}
// 停止编辑
roadLayerEdit.stopEdit = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.stopEdit()
}

// 保存
roadLayerEdit.saveEdit = function () {
  if (roadLineModule) {
    return roadLineModule.submitChange()
  }
}
// 保存好更新三维
roadLayerEdit.updateEdit = function (newDataJson) {
  if (!newDataJson) return
  roadLineModule.updateScene(newDataJson)
}

export default roadLayerEdit