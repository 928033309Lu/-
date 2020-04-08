import MapManager from './managers/map-manager'
import dataManager from './managers/data-manager'
import mapStatusBar from './components/map-statusbar'
import store from '../store/index'

const gwmap = {}
gwmap.dataManager = dataManager
gwmap.mapManager = null

gwmap.init = function (elementId, options = {}) {
  if (!elementId) {
    return
  }

  gwmap.mapManager = new MapManager(elementId)
  gwmap.viewer = gwmap.mapManager.viewer
}

gwmap.loadMapComponents = function (elementId) {
  if (!elementId) {
    return
  }

  // 加载地图状态栏
  document.getElementById(elementId).appendChild(mapStatusBar.element)
  mapStatusBar.init(gwmap.mapManager.viewer)
}

gwmap.dataManager.featureClicked = (type, id) => {
  // switch (type) {
  // case 'turbine':
  // store.dispatch('project/setDialog', {
  //   componentName: 'fan-view-panel',
  //   id
  // })
  // break
  // }
}

export default gwmap
