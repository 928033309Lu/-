/**
 * Created by supervisor on 2019/11/18
 */
export default {
  namespaced: true,
  state: {
    isEditName: false, // 是否开启编辑编号
    turbineRefresh: false, // 机位点数据是否变化了
    showTable: false,
    showImport: false,
    refreshTable: false,
    saveTable: false,
    delTable: false,
    showAdd: false,
    showRemove: false,
    showSkewing: false,
    showMove: false,
    totalNum: 0,
    getLayerPlan: null,
    tableData: null,
    deleteEndData: [], // 存储已删除的数据
    skewingData: {
      x: '',
      y: ''
    }
  },
  mutations: {
    isEditName (state, data) {
      state.isEditName = data
    },
    turbineRefresh (state, data) {
      state.turbineRefresh = ''
      setTimeout(() => {
        state.turbineRefresh = data
      }, 100)
    },
    skewingData (state, data) {
      state.skewingData.x = data.x
      state.skewingData.y = data.y
    },
    showTable (state, showTable) {
      state.showTable = showTable
    },
    showImport (state, showImport) {
      state.showImport = showImport
    },
    refreshTable (state, refreshTable) {
      state.refreshTable = refreshTable
    },
    saveTable (state, saveTable) {
      state.saveTable = saveTable
    },
    delTable (state, delTable) {
      state.delTable = delTable
    },
    totalNum (state, totalNum) {
      state.totalNum = totalNum
    },
    showAdd (state, showAdd) {
      state.showAdd = showAdd
    },
    showRemove (state, showRemove) {
      state.showRemove = showRemove
    },
    showMove (state, showMove) {
      state.showMove = showMove
    },
    showSkewing (state, showSkewing) {
      state.showSkewing = showSkewing
    },
    getLayerPlan (state, data) {
      state.getLayerPlan = ''
      setTimeout(() => {
        state.getLayerPlan = data
      }, 100)
    },
    tableData (state, data) {
      state.tableData = data
      state.totalNum = data.length
    },
    addTableData (state, data) {
      state.tableData.unshift(data)
      state.totalNum = state.tableData.length
    },
    deleteEndDataRefresh (state, data) {
      state.deleteEndData = data
    },
    delTableData (state, data) {
      var arr = data.split(',')
      for (let i = 0; i <= arr.length; i++) {
        state.tableData.forEach((item, index) => {
          if (item.id == arr[i]) {
            state.deleteEndData.push(item)

            state.tableData.splice(index, 1)
            // 删除地球上的
            gwmap.dataManager.turbineEditLayer.deleteTurbines([item.engineer_number])
          }
        })
      }
      state.totalNum = state.tableData.length
    },
    delTableData_Name (state, name) {
      state.tableData.forEach((item, index) => {
        if (item.engineer_number == name) {
          state.deleteEndData.push(item)
          
          state.tableData.splice(index, 1)
          // 删除地球上的
          gwmap.dataManager.turbineEditLayer.deleteTurbines([item.engineer_number])
        }
      })
      state.totalNum = state.tableData.length
    },
    moveTableData (state, data) {
      state.tableData = state.tableData.map((item, index) => {
        if (item.engineer_number == data.id) {
          item.logitude = data.coord[0]
          item.latitude = data.coord[1]
          item.moveEdit = true
        }
        return item
      })
    }
  },
  actions: {
   
  }
}
