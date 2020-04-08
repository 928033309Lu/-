const roadLayerPoint = {}

let roadLineModule = null
roadLayerPoint.load = function (data) {
  roadLayerPoint.remove()
  if (!data) return
  if (!roadLineModule) {
    roadLineModule = new WindEarth.RoadLineModule(gwmap.viewer)
    roadLineModule.defaultStyle.lineStyle.material = WindEarth.Color.fromCssColorString('#FFEC0A')
    roadLineModule && roadLineModule.parseJsonData(data)
  }
}

roadLayerPoint.zoomToLayer = function (t, r = 1.2) {
  roadLineModule && roadLineModule.layerLocation({
    duration: 0,
    offset: new WindEarth.HeadingPitchRange(0, t || -0.363, gwmap.dataManager.turbineLayer.lonRange * 110000 * r)
  })
  // roadLineModule && roadLineModule.layerLocation()
}
roadLayerPoint.showHide = function (visible) {
  roadLineModule && roadLineModule.setLineVisible(visible)
}

roadLayerPoint.remove = function () {
  roadLineModule && roadLineModule.removeAll(false)
  if (roadLineModule) roadLineModule = null
}
// 开启编辑模式
roadLayerPoint.startEdit = function () {
  roadLineModule && roadLineModule.startEdit()
}
// 新增节点
roadLayerPoint.addNode = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.createNewLine()
}
// 节点编辑
roadLayerPoint.nodeEdit = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.setEditMode(1)
}
// 打断节点
roadLayerPoint.breakEdit = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.setEditMode(5)
}
// 合并节点
roadLayerPoint.combineNode = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.setEditMode(6)
}
// 删除节点
roadLayerPoint.delEdit = function () {
  if (roadLineModule) {
    roadLineModule.setEditMode(2)
    let deleteEvent = function (event) {
      let res = confirm('是否删除该段道路?')
      return res
    }
    roadLineModule.addListener('onDeleted', deleteEvent)
    // roadLineModule.addListener('onDeleted', function (event) {
    //   return event
    // })
  }
}
// 回滚
roadLayerPoint.rollBack = function (data = {}) {
  roadLineModule && roadLineModule.rollBack(data)
}
// 查询是否存在编辑
roadLayerPoint.getStatus = function () {
  if (roadLineModule) {
    return roadLineModule.getChangedStatus()
  }
}
// 停止编辑
roadLayerPoint.stopEdit = function () {
  roadLineModule && roadLineModule.stopEdit()
}

// 保存
roadLayerPoint.saveEdit = function () {
  if (roadLineModule) {
    return roadLineModule.submitChange()
  }
}
// 保存好更新三维
roadLayerPoint.updateEdit = function (newDataJson) {
  if (!newDataJson) return
  roadLineModule.updateScene(newDataJson)
}

export default roadLayerPoint
