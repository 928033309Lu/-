let NETWORK_STATUS = {
  STATUS_OK: 200,
  TOKEN_INVALID: 401
};

function jsonToParams(obj) {
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    if (JSON.stringify(obj) == "{}") {
      return ""
    } else {
      let result = [];
      for (let key in obj) {
        result.push(key + "=" + obj[key])
      }
      return '?' + result.join('&')
    }
  }
}

function pacFormData(json) {
  let oFormData = new FormData();
  for (let [key, value] of Object.entries(json)) {
    oFormData.append(key, value);
  }
  return oFormData;
}

export {
  NETWORK_STATUS,
  jsonToParams,
  pacFormData
};
