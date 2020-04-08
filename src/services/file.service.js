import httpService from './http.service'
import { pacFormData } from '../config/network.config'

export default {
  uploadFile (url, file, data = {}, onProgress) {
    return httpService.post(url,
      pacFormData(Object.assign(file, data)), true, {
        onUploadProgress (progressEvent) {
          if (progressEvent.lengthComputable && onProgress) {
            onProgress(progressEvent)
          }
        }
      })
  },
  downloadFile (url, data = {}, onProgress) {
    return httpService.post(url,
      data, true, {
        headers: { 'Content-Type': 'application/octet-stream' },
        onDownloadProgress (progressEvent) {
          if (onProgress) {
            onProgress(progressEvent)
          }
        }
      })
  }
}
