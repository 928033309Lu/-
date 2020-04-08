/**
 * Created by supervisor on 2019/11/22
 */
import httpService from './http.service'
import envConfig from '@/config/env-config'
import fileService from './file.service'

class hoistServices {
  constructor (vueThis) {
    this.vm = vueThis
  }
  // 调取frams接口数据
  getFramsProjectData (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/update_farms_info`, data || {}, false)
  }

  // 获取是否编辑的权限
  getAuthority (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/get_action`, data || {}, false)
  }

  // 参考坐标系
  getCoordinateSystem (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/epsg_zone`, data || {}, false)
  }

  // 项目信息
  getProject (id) {
    return httpService.get(`${envConfig.apiBaseUrl}/project?contract_number=${id}`, {}, false)
  }

  // 获取机位点 table表格数据
  getHoistTableData (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/turbine`, data || {}, false)
  }
  // 获取添加风机，返回从FARMS获取的信息
  getFarmsName (data) {
    return httpService.post(`${envConfig.apiBaseUrl}/add_turbine`, data, false, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  // 机位点表格，名字下拉框数据
  engineerNumberList (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/getall_turbine_engineer_number`, data || {}, false)
  }

  // 上传机位点txt
  uploadHoistData (file, param, onProgress) {
    // return fileService.uploadFile(`${envConfig.apiBaseUrl}/upload_turbine`, file, param, onProgress)
    return fileService.uploadFile(`${envConfig.apiBaseUrl}/upload_turbine_file`, file, param, onProgress)
  }
  // 上传点位
  postAllTurbine (data) {
    return httpService.post(`${envConfig.apiBaseUrl}/upload_all_turbine`, data, false, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  // 上传点位后调用
  getAfterturbine (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/after_upload_turbine`, data || {}, false)
  }

  // 上传点位，验证farms名字
  postValidateName (data) {
    return httpService.post(`${envConfig.apiBaseUrl}/confirm_turbine`, data, false, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  // post导入机位点
  postUploadTurbine (data) {
    return httpService.post(`${envConfig.apiBaseUrl}/upload_turbine`, data, false, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  // put机位点
  putUploadTurbine (data) {
    return httpService.put(`${envConfig.apiBaseUrl}/save_update_turbine`, data, false, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  // 导入提交前，删除所有之前机位点
  delAllTurbine (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/delete_all_turbine`, data, false)
  }

  // 机位点删除
  deleteTurbine (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/delete_turbine`, data || {}, false)
  }

  // 获取道路geojson
  getRoadGeoInfo (id) {
    return httpService.get(envConfig.apiBaseUrl + `/road?contract_number=${id}`, {}, true)
  }

  // 获取编辑道路数据
  getAllRoadInfo (id) {
    return httpService.get(envConfig.apiBaseUrl + `/get_all_road?contract_number=${id}`, {}, true)
  }

  postAllRoadInfo (data) {
    return httpService.post(envConfig.apiBaseUrl + `/save_road`, data, false, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  // 重新生成场内道路
  getPitRoad (id) {
    return httpService.get(envConfig.apiBaseUrl + `/create_pit_road?contract_number=${id}`, {}, true)
  }

  // 获取项目部位置
  getProjectLocation (id) {
    return httpService.get(envConfig.apiBaseUrl + `/project_location?contract_number=${id}`, {}, true)
  }

  // 更新项目部位置
  updateProjectLocation (data) {
    return httpService.post(envConfig.apiBaseUrl + `/upload_project_location`, data, false, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 获取升压站位置
  getStationLocation (id) {
    return httpService.get(envConfig.apiBaseUrl + `/booster_location?contract_number=${id}`, {}, true)
  }

  // 更新升压站位置
  updateStationLocation (data) {
    return httpService.post(envConfig.apiBaseUrl + `/upload_booster_location`, data, false)
  }

  // 整体进度
  getOverallProgress (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/overall_progress`, data || {}, false)
  }

  // 基础进度
  getBasicStructure (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/basic_structure`, data || {}, false)
  }

  // 吊装顺序
  getHoistingSequence (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/crane`, data || {}, false)
  }

  // 大部件接货
  getBigPart (data) {
    return httpService.get(`${envConfig.apiBaseUrl}/large_parts`, data || {}, false)
  }

  // 获取风机状态数据
  getTurbineStatus (id) {
    return httpService.get(`${envConfig.apiBaseUrl}/turbine_status?contract_number=${id}`, {}, false)
  }
  // post风机偏移
  postSave_x_y (data) {
    return httpService.post(`${envConfig.apiBaseUrl}/save_x_y`, data, false, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  // 上传场区范围kml文件
  uploadFieldKml (data) {
    return httpService.post(`${envConfig.apiBaseUrl}/upload_kml`, data, false)
  }

  // 获取场区范围信息
  getFieldAreaGeoInfo (id) {
    return httpService.get(`${envConfig.apiBaseUrl}/get_kmz?contract_number=${id}`, {}, false)
  }

  // 保存场区范围信息
  updateFieldAreaGeoInfo (data) {
    return httpService.post(envConfig.apiBaseUrl + `/kmz_result`, data, false)
  }

  // // 获取吊车对应的道路信息
  // getCraneRoad (id, craneId) {
  //   return httpService.get(`${envConfig.apiBaseUrl}/turbine_road?contract_number=${id}&crane_id=${craneId}`, {}, false)
  // }

  // 获取轮播图
  getCarousel (data) {
    return httpService.get(envConfig.apiBaseUrl + `/get_carousel`, data || {}, false)
  }

  // 大部件发货
  getTurbineShipment (id) {
    return httpService.get(envConfig.apiBaseUrl + `/get_bulk_shipment?contract_number=${id}`, {}, false)
  }
  // 获取高程
  getElevation (lon, lat) {
    return httpService.get(envConfig.apiElevationUrl + `/elevation?x=${lon}&y=${lat}`, {}, false)
  }
}

export default hoistServices
