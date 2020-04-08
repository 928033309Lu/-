import fileService from './file.service'

class caculateHttps {
  constructor (vueThis) {
    this.vm = vueThis // vue中的this  也可以不用en
  }
  // 上传地图文件
  uploadMapFile (fileUrl, file, param, onProgress) {
    return fileService.uploadFile(fileUrl + 'upload', file, param, onProgress)
  }
}

export {
  caculateHttps
}

// this.caculateHttps.uploadMapFile(this.fileData, params, this.progress).then(res => {
//
// })
// progress(event) {
//     let percent = event.total > 0 ? Math.floor(event.loaded * 100 / event.total) : 0;
//     this.percent = percent;
// }
