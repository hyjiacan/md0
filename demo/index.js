const path = require('path')

const xhr = require('./xhr')

__webpack_public_path__ = path.resolve(__dirname, 'demo')

const md0 = require('../src/index').default

const markdown = require('./sample.md')

const html = md0(markdown, {
  useHljs: window.location.search.indexOf('useHljs') !== -1,
  catalog: window.location.search.indexOf('catalog') !== -1
})

const app = document.querySelector('#app')
app.innerHTML = html
