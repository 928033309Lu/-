const roadLayerOver = {}

let roadLineModule = null
roadLayerOver.load = function (data) {
  roadLayerOver.remove()
  if (!data) return
  if (!roadLineModule) {
    roadLineModule = new WindEarth.RoadLineModule(gwmap.viewer)
    roadLineModule.defaultStyle.lineStyle.material = WindEarth.Color.fromCssColorString('#CD9F00')
    roadLineModule && roadLineModule.parseJsonData(data)
  }
}

roadLayerOver.zoomToLayer = function (t, r = 1.2) {
  roadLineModule && roadLineModule.layerLocation({
    duration: 0,
    offset: new WindEarth.HeadingPitchRange(0, t || -0.363, gwmap.dataManager.turbineLayer.lonRange * 110000 * r)
  })
  // roadLineModule && roadLineModule.layerLocation()
}
roadLayerOver.showHide = function (visible) {
  roadLineModule && roadLineModule.setLineVisible(visible)
}

roadLayerOver.remove = function () {
  roadLineModule && roadLineModule.removeAll(false)
  if (roadLineModule) roadLineModule = null
}
// 开启编辑模式
roadLayerOver.startEdit = function () {
  roadLineModule && roadLineModule.startEdit()
}
// 新增加点
roadLayerOver.addNode = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.createNewLine()
  // todo新增节点
}
// 节点编辑
roadLayerOver.nodeEdit = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.setEditMode(1)
}
// 打断节点
roadLayerOver.breakEdit = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.setEditMode(5)
}
// 合并节点
roadLayerOver.combineNode = function () {
  roadLineModule && roadLineModule.removeListener('onDeleted')
  roadLineModule && roadLineModule.setEditMode(6)
}
// 删除节点
roadLayerOver.delEdit = function () {
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
roadLayerOver.rollBack = function (data = {}) {
  roadLineModule && roadLineModule.rollBack(data)
}
// 查询是否存在编辑
roadLayerOver.getStatus = function () {
  if (roadLineModule) {
    return roadLineModule.getChangedStatus()
  }
}
// 停止编辑
roadLayerOver.stopEdit = function () {
  roadLineModule && roadLineModule.stopEdit()
}

// 保存
roadLayerOver.saveEdit = function () {
  if (roadLineModule) {
    return roadLineModule.submitChange()
  }
}
// 保存好更新三维
roadLayerOver.updateEdit = function (newDataJson) {
  if (!newDataJson) return
  roadLineModule.updateScene(newDataJson)
}

export default roadLayerOver
