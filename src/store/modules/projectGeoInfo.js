export default {
  namespaced: true,
  state: {
    turbineStatus: null, // 风机状态信息
    craneData: null, // 塔吊信息
    craneDataHaveLonlat: false, // 塔吊信息是否已经附加了经纬度
    craneLocations: null, // 塔吊位置信息
    fieldAreaKmlUrl: null, // 场区范围geojson
    roadGeoInfo: null, // 道路geojson
    roadAllInfo: null, // 编辑道路三条数据
    projectLocation: null, // 项目部位置
    stationLocation: null, // 升压站位置
    shipmentData: null, // 发货点位信息
    turbineFilterConfig: {} // 风机过滤条件
  },
  actions: {
    getShipmentData ({
      commit,
      state,
      rootState
    }, {
      turbineTypes,
      callback
    }) {
      if (state.shipmentData) {
        const filterInfo = filterShipmentData(state.shipmentData, turbineTypes)
        callback(filterInfo)
        return
      }
      apiServices.getTurbineShipment(rootState.projectInfo.contract_number)
        .then(res => {
          if (!res || !res.data) {
            callback(null)
            return
          }

          commit('shipmentData', res.data)
          const filterInfo = filterShipmentData(res.data, turbineTypes)
          callback(filterInfo)
        })
        .catch(() => {
          callback(null)
        })
    },
    getTurbineStatus ({
      commit,
      state,
      rootState
    }, {
      callback
    }) {
      // if (state.turbineStatus) {
      //   callback(state.turbineStatus)
      //   return
      // }

      apiServices.getTurbineStatus(rootState.projectInfo.contract_number)
        .then(res => {
          if (!res || !res.data) {
            callback(null)
            return
          }
          const turbines = res.data
          // // todo:测试
          // const turbines = [{
          //   id: 'C00',
          //   lon: 120.000,
          //   lat: 32,
          //   crane: '1',
          //   statues: 0,
          //   sub_status: 0
          // },
          // {
          //   id: 'C01',
          //   lon: 120.002,
          //   lat: 32,
          //   statues: 0,
          //   sub_status: 1
          // },
          // {
          //   id: 'C10',
          //   lon: 120.000,
          //   lat: 32.002,
          //   statues: 1,
          //   sub_status: 10,
          //   components: [{
          //     type: 'tower',
          //     statues: 1
          //   }, {
          //     type: 'cabin',
          //     statues: 0
          //   }, {
          //     type: 'dynamo',
          //     statues: 0
          //   }, {
          //     type: 'impeller',
          //     statues: 1
          //   }, {
          //     type: 'blade',
          //     statues: 1
          //   }]
          // },
          // {
          //   id: 'C11',
          //   lon: 120.002,
          //   lat: 32.002,
          //   statues: 1,
          //   sub_status: 11,
          //   components: [{
          //     type: 'tower',
          //     statues: 0
          //   }, {
          //     type: 'cabin',
          //     statues: 0
          //   }, {
          //     type: 'dynamo',
          //     statues: 1
          //   }, {
          //     type: 'impeller',
          //     statues: 1
          //   }, {
          //     type: 'blade',
          //     statues: 3
          //   }]
          // },
          // {
          //   id: 'C20',
          //   lon: 120.000,
          //   lat: 32.004,
          //   statues: 2,
          //   sub_status: 20,
          //   components: [{
          //     type: 'tower',
          //     statues: 1
          //   }, {
          //     type: 'cabin',
          //     statues: 1
          //   }, {
          //     type: 'dynamo',
          //     statues: 1
          //   }, {
          //     type: 'impeller',
          //     statues: 1
          //   }, {
          //     type: 'blade',
          //     statues: 3
          //   }]
          // }, {
          //   id: 'C21',
          //   lon: 120.002,
          //   lat: 32.004,
          //   statues: 2,
          //   sub_status: 21,
          //   components: [{
          //     type: 'tower',
          //     statues: 1
          //   }, {
          //     type: 'cabin',
          //     statues: 1
          //   }, {
          //     type: 'dynamo',
          //     statues: 1
          //   }, {
          //     type: 'impeller',
          //     statues: 1
          //   }, {
          //     type: 'blade',
          //     statues: 3
          //   }]
          // }, {
          //   id: 'C22',
          //   lon: 120.004,
          //   lat: 32.004,
          //   statues: 2,
          //   sub_status: 22,
          //   components: [{
          //     type: 'tower',
          //     statues: 1
          //   }, {
          //     type: 'cabin',
          //     statues: 1
          //   }, {
          //     type: 'dynamo',
          //     statues: 1
          //   }, {
          //     type: 'impeller',
          //     statues: 1
          //   }, {
          //     type: 'blade',
          //     statues: 3
          //   }]
          // }, {
          //   id: 'C23',
          //   lon: 120.006,
          //   lat: 32.004,
          //   statues: 2,
          //   sub_status: 23,
          //   components: [{
          //     type: 'tower',
          //     statues: 1
          //   }, {
          //     type: 'cabin',
          //     statues: 1
          //   }, {
          //     type: 'dynamo',
          //     statues: 1
          //   }, {
          //     type: 'impeller',
          //     statues: 1
          //   }, {
          //     type: 'blade',
          //     statues: 3
          //   }]
          // }, {
          //   id: 'C24',
          //   lon: 120.008,
          //   lat: 32.004,
          //   statues: 2,
          //   sub_status: 24,
          //   components: [{
          //     type: 'tower',
          //     statues: 1
          //   }, {
          //     type: 'cabin',
          //     statues: 1
          //   }, {
          //     type: 'dynamo',
          //     statues: 1
          //   }, {
          //     type: 'impeller',
          //     statues: 1
          //   }, {
          //     type: 'blade',
          //     statues: 3
          //   }]
          // },
          // {
          //   id: 'C30',
          //   lon: 120.000,
          //   lat: 32.006,
          //   statues: 3,
          //   sub_status: 30
          // }, {
          //   id: 'C31',
          //   lon: 120.002,
          //   lat: 32.006,
          //   statues: 3,
          //   sub_status: 31
          // }, ,
          //   {
          //     id: 'C40',
          //     lon: 120.000,
          //     lat: 32.008,
          //     statues: 4,
          //     sub_status: 40
          //   }, {
          //     id: 'C41',
          //     lon: 120.002,
          //     lat: 32.008,
          //     statues: 4,
          //     sub_status: 41
          //   }, ,
          //   {
          //     id: 'C50',
          //     lon: 120.000,
          //     lat: 32.010,
          //     statues: 5,
          //     sub_status: 50
          //   }, {
          //     id: 'C60',
          //     lon: 120.000,
          //     lat: 32.012,
          //     statues: 6,
          //     sub_status: 60,
          //     crane: 'db97c4e99ae94ca5a8da46644331b5e5'
          //   }, {
          //     id: 'C61',
          //     lon: 120.002,
          //     lat: 32.012,
          //     statues: 6,
          //     crane: '8390c98d60134100a1699d00babc01eb',
          //     sub_status: 61
          //   }, {
          //     id: 'C62',
          //     lon: 120.004,
          //     lat: 32.012,
          //     statues: 6,
          //     sub_status: 62
          //   }, {
          //     id: 'C63',
          //     lon: 120.006,
          //     lat: 32.012,
          //     statues: 6,
          //     sub_status: 63
          //   }
          // ]

          const craneLocations = []
          turbines.forEach(turbine => {
            if (turbine.hasOwnProperty('crane') && turbine.crane) {
              const locat = {
                id: turbine.crane,
                lon: turbine.lon - 0.001, // todo: 吊车位置与风机偏离一个固定值
                lat: turbine.lat
              }
              craneLocations.push(locat)
            }
          })
          commit('turbineStatus', turbines)
          state.craneLocations = craneLocations
          callback(turbines)
        })
        .catch((err) => {
          console.log(err)
          callback(null)
        })
    },
    filterTurbines ({
      commit,
      state,
      rootState
    }, {
      filterField,
      fieldValues,
      callback
    }) {
      if (!state.turbineStatus) {
        callback(false)
        return
      }

      if (filterField) {
        if (!fieldValues) {
          delete state.turbineFilterConfig[filterField]
        } else {
          state.turbineFilterConfig[filterField] = fieldValues
        }
      }

      const turbines = []
      state.turbineStatus.forEach(turbine => {
        for (const field in state.turbineFilterConfig) {
          if (!state.turbineFilterConfig[field] || state.turbineFilterConfig[field].indexOf(turbine[field]) < 0) {
            return
          }
        }
        turbines.push(turbine)
      })
      gwmap.dataManager.turbineLayer.load(turbines)
      // gwmap.dataManager.turbineLayer.zoomToLayer()
      callback(true)
    },
    getFieldAreaGeoInfo ({
      commit,
      state,
      rootState
    }, {
      callback
    }) {
      if (state.fieldAreaKmlUrl) {
        callback(state.fieldAreaKmlUrl)
        return
      }

      apiServices.getFieldAreaGeoInfo(rootState.projectInfo.contract_number)
        .then(res => {
          if (!res || !res.data) {
            callback(null)
            return
          }

          const temp = res.data
          commit('fieldAreaKmlUrl', temp)
          callback(temp)
        })
        .catch(() => {
          callback(null)
        })
    },
    updateFieldAreaGeoInfo ({
      commit,
      state,
      rootState
    }, {
      url,
      callback
    }) {
      if (!url) {
        callback(false)
        return
      }
      const params = {
        contract_number: rootState.projectInfo.contract_number,
        kmz_result: url
      }
      apiServices.updateFieldAreaGeoInfo(params)
        .then(res => {
          if (!res) {
            callback(false)
            return
          }
          commit('fieldAreaKmlUrl', url)
          callback(true)
        })
        .catch(() => {
          callback(false)
        })
    },
    getRoadGeoInfo ({
      commit,
      state,
      rootState
    }, {
      callback
    }) {
      if (state.roadGeoInfo) {
        callback(state.roadGeoInfo)
        return
      }

      apiServices.getRoadGeoInfo(rootState.projectInfo.contract_number)
        .then(res => {
          if (!res || !res.data || !res.data.features) {
            callback(null)
            return
          }
          const temp = res.data

          temp.features.forEach((item, index) => {
            item.id = item.id + index
          })
          commit('roadGeoInfo', temp)
          callback(temp)
        })
        .catch(() => {
          callback(null)
        })
    },
    getRoadGeoInfo2 ({
      commit,
      state,
      rootState
    }, {
      callback
    }) {
      apiServices.getRoadGeoInfo(rootState.projectInfo.contract_number)
        .then(res => {
          if (!res || !res.data || !res.data.features) {
            callback(null)
            return
          }
          const temp = res.data

          temp.features.forEach((item, index) => {
            item.id = item.id + index
          })
          commit('roadGeoInfo', temp)
          callback(temp)
        })
        .catch(() => {
          callback(null)
        })
    },
    getPitRoad ({
      commit,
      state,
      rootState
    }, {
      callback
    }) {
      apiServices.getPitRoad(rootState.projectInfo.contract_number)
        .then(res => {
          if (!res || !res) {
            callback(null)
            return
          }
          callback(res)
        })
        .catch(() => {
          callback(null)
        })
    },
    getAllRoadInfo ({
      commit,
      state,
      rootState
    }, {
      callback
    }) {
      apiServices.getAllRoadInfo(rootState.projectInfo.contract_number)
        .then(res => {
          if (!res || !res.data) {
            callback(null)
            return
          }
          // todo 三个道路对象数据存储pit_road, flight_path, off_road

          res.data.pit_road.features.length > 0 && res.data.pit_road.features.forEach((item, index) => {
            item.id = index + 1
          })
          res.data.flight_path.features.length > 0 && res.data.flight_path.features.forEach((item, index) => {
            item.id = index + 1
          })
          res.data.off_road.features.length > 0 && res.data.off_road.features.forEach((item, index) => {
            item.id = index + 1
          })
          commit('roadAllInfo', res.data)
          callback(res.data)
        })
        .catch((err) => {
          console.log(err)
          callback(null)
        })
    },
    getCraneData ({
      commit,
      state,
      rootState
    }, {
      callback
    }) {
      // if (state.craneData) {
      //   if (!state.craneDataHaveLonlat && state.craneLocations) {
      //     // 根据craneLocations填充吊车的经纬度字段
      //     state.craneLocations.forEach(location => {
      //       const crane = state.craneData.find((item) => {
      //         return item.crane_id.indexOf(location.id) >= 0 || location.id.indexOf(item.crane_id) >= 0
      //       })
      //       if (!crane) return
      //       crane.lon = location.lon
      //       crane.lat = location.lat
      //     })
      //     state.craneDataHaveLonlat = true
      //   }
      //   callback(state.craneData)
      //   return
      // }

      apiServices.getHoistingSequence({
        contract_number: rootState.projectInfo.contract_number
      }).then(res => {
        if (!res || !res.data) {
          callback(null)
          return
        }

        const craneData = res.data
        if (state.craneLocations) {
          // 根据craneLocations填充吊车的经纬度字段
          state.craneLocations.forEach(location => {
            const crane = craneData.find((item) => {
              return item.crane_id.indexOf(location.id) >= 0 || location.id.indexOf(item.crane_id) >= 0
            })
            if (!crane) return
            crane.lon = location.lon
            crane.lat = location.lat
          })
          state.craneDataHaveLonlat = true
        }
        commit('craneData', craneData)
        callback(craneData)
      }).catch(() => {
        callback(null)
      })
    },
    getProjectLocation ({
      commit,
      state,
      rootState
    }, {
      callback
    }) {
      apiServices.getProjectLocation(rootState.projectInfo.contract_number)
        .then(res => {
          if (!res || !res.data) {
            callback(null)
            return
          }
          const temp = {
            lon: Number(res.data.logitude),
            lat: Number(res.data.latitude)
          }
          commit('projectLocation', temp)
          callback(temp)
        })
        .catch(() => {
          callback(null)
        })
    },
    updateProjectLocation ({
      commit,
      state,
      rootState
    }, {
      data,
      callback
    }) {
      if (!data) {
        callback(false)
        return
      }
      const params = `contract_number=${rootState.projectInfo.contract_number}&logitude=${data.lon}&latitude=${data.lat}`
      apiServices.updateProjectLocation(params)
        .then(res => {
          if (!res) {
            callback(false)
            return
          }
          commit('projectLocation', data)
          callback(true)
        })
        .catch(() => {
          callback(false)
        })
    },
    postAllRoadInfo ({
      commit,
      state,
      rootState
    }, {
      data,
      callback
    }) {
      if (!data) {
        callback(null)
        return
      }

      // road_type =>场内1， 机位2，场外3
      apiServices.postAllRoadInfo({
        contract_number: rootState.projectInfo.contract_number,
        road_type: data.type,
        road_info: data.road_info
      })
        .then(res => {
          callback(res)
        })
        .catch((err) => {
          console.log(err)
          callback(null)
        })
    },
    getStationLocation ({
      commit,
      state,
      rootState
    }, {
      callback
    }) {
      // if (state.stationLocation) {
      //   callback(state.stationLocation)
      //   return
      // }

      apiServices.getStationLocation(rootState.projectInfo.contract_number)
        .then(res => {
          if (!res || !res.data) {
            callback(null)
            return
          }
          const temp = {
            lon: Number(res.data.logitude),
            lat: Number(res.data.latitude),
            angle: Number(res.data.angle)
          }
          commit('stationLocation', temp)
          callback(temp)
        })
        .catch(() => {
          callback(null)
        })
    },
    updateStationLocation ({
      commit,
      state,
      rootState
    }, {
      data,
      callback
    }) {
      if (!data) {
        callback(false)
        return
      }
      // const formData = new FormData()
      // formData.append('contract_number', rootState.projectInfo.contract_number)
      // formData.append('logitude ', Number(data.lon))
      // formData.append('latitude ', Number(data.lat))
      // formData.append('angle ', Number(data.angle))
      const params = `contract_number=${rootState.projectInfo.contract_number}&logitude=${data.lon}&latitude=${data.lat}&angle=${data.angle}`
      apiServices.updateStationLocation(params)
        .then(res => {
          if (!res) {
            callback(false)
            return
          }
          commit('stationLocation', data)
          callback(true)
        })
        .catch(() => {
          callback(false)
        })
    }
  },
  mutations: {
    turbineStatus (state, data) {
      state.turbineStatus = data
    },
    fieldAreaKmlUrl (state, data) {
      state.fieldAreaKmlUrl = data
    },
    craneData (state, data) {
      state.craneData = data
    },
    roadGeoInfo (state, data) {
      state.roadGeoInfo = data
    },
    roadAllInfo (state, data) {
      state.roadAllInfo = data
    },
    projectLocation (state, data) {
      state.projectLocation = data
    },
    stationLocation (state, data) {
      state.stationLocation = data
    },
    shipmentData (state, data) {
      state.shipmentData = data
    }
  }
}

function filterShipmentData (shipmentData, turbineTypes) {
  if (!shipmentData || shipmentData.length === 0 || !turbineTypes || turbineTypes.length === 0) return null

  const result = {}

  shipmentData.forEach(item => {
    if (!item || turbineTypes.indexOf(item.turbine_type) < 0) return

    if (!result.hasOwnProperty(item.assembly_plant)) {
      const temp = {}
      temp.name = item.assembly_plant
      temp.lon = item.logitude
      temp.lat = item.latitude
      temp.data = []
      result[item.assembly_plant] = temp
    }

    result[item.assembly_plant].data.push(item)
  })

  return result
}
