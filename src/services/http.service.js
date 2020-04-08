import axios from 'axios'
import {
  jsonToParams
} from '../config/network.config'

function get (url, data, auth = false, options = {}) {
  const token = localStorage.getItem('token') || ''
  let config = {}
  url = url + jsonToParams(data)
  if (auth) {
    config = Object.assign({}, options)
    config.headers = (config.headers) ? config.headers : {}
    config.headers['token'] = token
  }
  return axios.get(url, config)
    .then((res) => responseHandler(res))
    .catch((err) => responseError(err))
}

function post (url, data, auth = false, options = {}) {
  const token = localStorage.getItem('token')
  let config = options
  if (auth) {
    if (!config.headers) {
      config.headers = {}
    }
    config.headers.token = token
  } else {
    config = options
  }

  return axios.post(url, data, config)
    .then((res) => responseHandler(res))
    .catch((err) => responseError(err))
}

function deleteOut (url, data, auth = false, options = {}) {
  url = url + jsonToParams(data)
  const token = localStorage.getItem('token')
  let config = {}
  if (auth) {
    config = Object.assign(options, {
      headers: {
        'token': token
      }
    })
  }
  return axios.delete(url, config)
    .then((res) => responseHandler(res))
    .catch((err) => responseError(err))
}

function deleteput (url, data, auth = false) {
  const token = localStorage.getItem('token')
  let config = {}
  if (auth) {
    config = Object.assign({
      data: data
    }, {
      headers: {
        'token': token
      }
    })
  }
  return axios.delete(url, config)
    .then((res) => responseHandler(res))
    .catch((err) => responseError(err))
}

function put (url, data, auth = false, options = {}) {
  const token = localStorage.getItem('token')
  let config = {}
  if (auth) {
    config = Object.assign(options, {
      headers: {
        'token': token
      }
    })
  }
  return axios.put(url, data, config)
    .then((res) => responseHandler(res))
    .catch((err) => responseError(err))
}

function responseHandler (res) {
  if (res.data.code === 401) {
    localStorage.clear()
    location.href = `/login`
    return
  }
  if (res.status === 200) {
    return Promise.resolve(res.data)
  } else {
    return Promise.reject(res.data)
  }
}

function responseError (err) {
  return Promise.reject(err)
}

export default {
  get,
  post,
  deleteOut,
  deleteput,
  put
}
