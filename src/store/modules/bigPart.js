/**
 * Created by supervisor on 2019/11/18
 */
export default {
  namespaced: true,
  state: {
    showTable: false,
    showTable1: false
  },
  mutations: {
    showTable (state, showTable) {
      state.showTable = showTable
    },
    showTable1 (state, showTable) {
      state.showTable1 = showTable
    }
  },
  actions: {

  }
}
