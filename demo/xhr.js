function getResponse (xhr) {
  let data = xhr.responseText
  let headers = {}
  xhr.getAllResponseHeaders().split('\r\n').forEach(item => {
    let temp = item.trim().split(':')
    if (!temp[0]) {
      return
    }
    headers[temp[0].trim()] = (temp[1] || '').trim()
  })
  return {data, headers}
}

function request (method, url, {param, headers, callback}) {
  let xhr = new XMLHttpRequest()
  if (callback) {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(getResponse(xhr))
      }
    }
  }
  if (param && /^(get|delete)$/i.test(method)) {
    let temp = []
    for (let name in param) {
      if (!param.hasOwnProperty(name)) {
        continue
      }
      temp.push(`${name}=${param[name]}`)
    }
    param = temp.join('&')
    if (url.indexOf('?') === -1) {
      url += `?${param}`
    } else {
      url += `&${param}`
    }
  }
  xhr.open(method.toUpperCase(), url, !!callback)
  if (headers) {
    for (let name in headers) {
      if (!headers.hasOwnProperty(name)) {
        continue
      }
      xhr.setRequestHeader(name, headers[name])
    }
  }
  xhr.send(null)
  if (!callback) {
    return getResponse(xhr)
  }
}

const xhr = {
  getSync (url, param, headers) {
    return request('get', url, {param, headers})
  }
}

module.exports = xhr
