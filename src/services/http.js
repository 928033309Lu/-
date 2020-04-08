import httpService from './http.service'

const baseUrl = process.env.NODE_ENV === 'development' ? '/goldlab' : '/api/goldlab'

class https {
  constructor(vueThis) {
    this.vm = vueThis // vue中的this  也可以不用
  }
  // 获取测点枚举类型
  getCedian() {
    return httpService.get(baseUrl + `/configData/cedian`, {}, false)
  }
  // 获取子类型枚举配置
  getSubType() {
    return httpService.get(baseUrl + `/configData/subType`, {}, false)
  }
  // 获取类型枚举配置
  getType() {
    return httpService.get(baseUrl + `/configData/type`, {}, false)
  }
  // 获取文件列表
  getFileList(projectId) {
    return httpService.get(baseUrl + `/userSide/ensures/foamProject/${projectId}`, {}, true)
  }
  // 删除文件
  deleteFile(id) {
    return httpService.deleteOut(baseUrl + `/userSide/ensures/${id}`, {}, true)
  }
  // upload文件获取解析数据
  uploadFile(data, config = {}, projectId) {
    return httpService.post(baseUrl + `/ensure/info?foamProjectId=${projectId}`, data || {}, true, config)
  }
  // 获取文件表头信息
  getInfo(id) {
    return httpService.get(baseUrl + `/ensure/info/${id}`, {}, true)
  }
  // 获取文件表头信息
  putInfo(data, id) {
    return httpService.put(baseUrl + `/ensure/info/${id}`, data || {}, true)
  }
  // 获取高度
  getHeightList(id) {
    return httpService.get(baseUrl + `/proofread/heightList/${id}`, {}, true)
  }
  // 获取信号
  getSingnalList() {
    return httpService.get(baseUrl + `/configData/singnalType`, {}, true)
  }
  // 获取原始数据
  getOriginData(id) {
    return httpService.get(baseUrl + `/proofread/originData/${id}`, {}, true)
  }
  // 以高度和信号枚举 获取该ensureId的最匹配的列号
  getColumnNumber(id, dataSliceDisplayString, singnal) {
    return httpService.get(baseUrl + `/proofread/columnNumber/suitable/${id}?dataSliceDisplayString=${dataSliceDisplayString}&signalTypeVo=${singnal}`, {}, true)
  }
  // 数据确认
  setValid(data, id) {
    return httpService.post(baseUrl + `/proofread/invalidPeriod/${id}`, data || {}, true)
  }
  // 获取最新无效区间
  getLatest(id) {
    return httpService.get(baseUrl + `/proofread/invalidPeriod/tag/latest?ensureId=${id}`, {}, true)
  }
  // 获取无效自动处理区间
  getAutoData(id) {
    return httpService.get(baseUrl + `/proofread/invalidPeriod/tag/auto?ensureId=${id}`, {}, true)
  }
  // 保存
  saveHandle(data) {
    return httpService.post(baseUrl + `/proofread/invalidPeriod/tag`, data || {}, true)
  }
  // 风参展示六图数据
  getPicData(id, startDateTime, endDateTime) {
    return httpService.get(baseUrl + `/show/windParams/data/${id}?endDateTime=${endDateTime}&startDateTime=${startDateTime}`, {}, true)
  }
  // 数据有效率
  getEffectiveData(id, startDateTime, endDateTime) {
    return httpService.get(baseUrl + `/show/dataEffectiveRatio/data/${id}?endDateTime=${endDateTime}&startDateTime=${startDateTime}`, {}, true)
  }
  // 极限风况风速列
  getSpeedColumns(id) {
    return httpService.get(baseUrl + `/show/extremeWindCondition/speedColumns/param/${id}`, {}, true)
  }
  // 极限风况时间周期
  getTimePeriods(data) {
    return httpService.get(baseUrl + `/show/extremeWindCondition/periodicMaxima/param/timePeriods`, data || {}, true)
  }
  // 极限风况数据
  getAllData(id, PMTimePeriodEnum, channelNumber, time) {
    return httpService.get(baseUrl + `/show/extremeWindCondition/all/data/${id}?PMTimePeriodEnum=${PMTimePeriodEnum}&channelNumber=${channelNumber}&startDateTime=${time[0]}&endDateTime=${time[1]}`, {}, true)
  }
  // 独立风暴数据
  getIndependentStorm(id, ISMergeStormsLessHour, ISStormThreshold, channelNumber, time) {
    return httpService.get(baseUrl + `/show/extremeWindCondition/independentStorm/data/${id}?ISMergeStormsLessHour=${ISMergeStormsLessHour}&ISStormThreshold=${ISStormThreshold}&channelNumber=${channelNumber}&startDateTime=${time[0]}&endDateTime=${time[1]}`, {}, true)
  }
  // 独立周期极值数据
  getPeriodMaxima(id, PMExcludeRecoveryRateLessPercent, PMExcludeValidDataPointsLessCount, PMTimePeriodEnum, channelNumber, time) {
    return httpService.get(baseUrl + `/show/extremeWindCondition/periodMaxima/data/${id}?PMExcludeRecoveryRateLessPercent=${PMExcludeRecoveryRateLessPercent}&PMExcludeValidDataPointsLessCount=${PMExcludeValidDataPointsLessCount}&PMTimePeriodEnum=${PMTimePeriodEnum}&channelNumber=${channelNumber}&startDateTime=${time[0]}&endDateTime=${time[1]}`, {}, true)
  }
  // 获取【数据列】页面时所需要的数据
  getColumnData(id) {
    return httpService.get(baseUrl + `/exporters/parameter/init/${id}`, {}, true)
  }
  // 获取【Tim】页面变动后包含的时间点数量，风速平均值，风向，是否有方差列
  getTimData(id, windSpeedColumn, windDirectionColumn, time) {
    return httpService.get(baseUrl + `/exporters/parameter/tim/${id}?windSpeedColumn=${windSpeedColumn}&windDirectionColumn=${windDirectionColumn}&startDateTime=${time[0]}&endDateTime=${time[1]}`, {}, true)
  }
  // 下载【Standard】标准文件
  downloadStandard(id, columns, period, time) {
    return httpService.get(baseUrl + `/exporters/file/standard/download?ensureId=${id}&columns=${columns.join(',')}&period=${period}&startDateTime=${time[0]}&endDateTime=${time[1]}`, {}, true, {
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      responseType: 'blob'
    })
  }
  // 下载【tim】标准文件
  downloadTim(id, windSpeedColumn, windDirectionColumn, time, longTermCorrectionFactor, period, withSD = false) {
    return httpService.get(baseUrl + `/exporters/file/tim/download?ensureId=${id}&windSpeedColumn=${windSpeedColumn}&windDirectionColumn=${windDirectionColumn}&longTermCorrectionFactor=${longTermCorrectionFactor}&startDateTime=${time[0]}&endDateTime=${time[1]}&period=${period}&withSD=${withSD}`, {}, true, {
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      responseType: 'blob'
    })
  }
  // 下载【eWrite】标准文件
  downloadEwt(id, windSpeedColumn, windDirectionColumn, time, longTermCorrectionFactor, r2) {
    return httpService.get(baseUrl + `/exporters/file/eWrite/download?ensureId=${id}&windSpeedColumn=${windSpeedColumn}&windDirectionColumn=${windDirectionColumn}&longTermCorrectionFactor=${longTermCorrectionFactor}&r2=${r2}&startDateTime=${time[0]}&endDateTime=${time[1]}`, {}, true, {
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      responseType: 'blob'
    })
  }
  // 数据库获取数据
  getDataBase(id, invalidTag, columnNumber, Stime, Etime, invalidEnum = 'A') {
    return httpService.get(baseUrl + `/newShow/pageData/${id}?invalidTag=${invalidTag}&columnNumber=${columnNumber}&invalidEnum=${invalidEnum}&startDateTime=${Stime}&endDateTime=${Etime}`, {}, true)
  }
  // 数据库获取数据
  deleteInvalidData(id) {
    return httpService.deleteput(baseUrl + `/newShow/invalidPeriod/${id}`, '', true)
  }
  // 数据新标记
  setValidNew(data, id) {
    return httpService.post(baseUrl + `/newShow/invalidPeriod/${id}`, data || {}, true)
  }
  // 数据库获取全部数据
  getAllNewData(id, columnNumber, invalidTag = 2333, invalidEnum = 'A') {
    return httpService.get(baseUrl + `/newShow/dilusionData/${id}?invalidTag=${invalidTag}&columnNumber=${columnNumber}&invalidEnum=${invalidEnum}`, {}, true)
  }
  // 自动处理是否ok
  getAutoIsOk(id) {
    return httpService.get(baseUrl + `/newShow/invalidPeriod/autoOK/${id}`, {}, true)
  }
  // 自动处理覆盖用户标记数据
  copyAutoToLast(id) {
    return httpService.post(baseUrl + `/newShow/invalidPeriod/copyAutoToLast/${id}`, {}, true)
  }
  // 应用到项目
  sendToFoam(data) {
    return httpService.post(baseUrl + `/exporters/sendToFoam/tim`, data, true)
  }

}

export {
  https
}