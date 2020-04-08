
export default {
  namespaced: true,
  state: {
    loadingObj: {
      loading: false,
      text: '正在重新生成道路，请稍后...'
    },
    loadNumber: 0,
    pit_road_postion: null // 范围定位用
  },
  mutations: {
    setLoadingTip (state, data) {
      state.loadingObj.loading = data.loading
      if (data.text) {
        state.loadingObj.text = data.text
      }
    },
    loadNumber (state, data) {
      state.loadNumber = data
    },
    pit_road_postion (state, data) {
      state.pit_road_postion = data
    }
  },
  actions: {}
}
