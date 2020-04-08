const fieldLayer = {}

let kmlLayer = null
fieldLayer.load = function (data) {
  fieldLayer.remove()
  if (!data) {
    return
  }
  if (!kmlLayer) {
    kmlLayer = new WindEarth.KmlLayer(gwmap.viewer)
  }
  kmlLayer.loadData({
    url: '/wrinternal' + data // todo:'/wrinternal'在local和build环境中均设置了代理，指向后端服务
  })
  kmlLayer.layerLocation()

  kmlLayer.addToViewer()
}

fieldLayer.zoomToLayer = function () {
  kmlLayer && kmlLayer.layerLocation()
}

fieldLayer.remove = function () {
  kmlLayer && kmlLayer.removeFromViewer()
}
export default fieldLayer
