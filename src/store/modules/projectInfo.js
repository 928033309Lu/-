/**
 * Created by supervisor on 2019/11/18
 */
export default {
  namespaced: true,
  state: {
    showTable: false,
    projectInfo: null,
    contract_number: null,
    authority: null,
    authorityMode: 'get' // edit
  },
  mutations: {
    showTable (state, showTable) {
      state.showTable = showTable
    },
    projectInfo (state, data) {
      state.projectInfo = data
    },
    contract_number (state, data) {
      state.contract_number = data
    },
    authority (state, data) {
      state.authority = data
    },
    authorityMode (state, data) {
      if (data) {
        state.authorityMode = data
      } else {
        state.authorityMode = 'get'
      }
    }
  },
  actions: {
    getProjectInfo ({
      commit,
      state,
      rootState
    }, {
      callback
    }) {
      if (state.projectInfo) {
        callback(state.projectInfo)
        return
      }

      apiServices.getProject(rootState.projectInfo.contract_number)
        .then(res => {
          if (!res || !res.data) {
            callback(null)
            return
          }

          commit('projectInfo', res.data)
          callback(res.data)
        })
        .catch(() => {
          callback(null)
        })
    }
  }
}
