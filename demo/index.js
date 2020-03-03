const path = require('path')

const xhr = require('./xhr')

__webpack_public_path__ = path.resolve(__dirname, 'demo')

console.info(__webpack_public_path__)

const md0 = require('../src/index').default

const {data} = xhr.getSync('/sample.md')

const html = md0(data, {
  useHljs: window.location.search.indexOf('useHljs') !== -1,
  catalog: window.location.search.indexOf('catalog') !== -1
})

const app = document.querySelector('#app')
app.innerHTML = html
