const path = require('path')

const xhr = require('./xhr')

__webpack_public_path__ = path.resolve(__dirname, 'demo')

const md0 = require('../src/index').default

require('./img.gif')

const file = require('./sample.md')

const {data: content} = xhr.getSync(file.default)

let emojis = localStorage.getItem('github-emojis')
if (!emojis) {
  emojis = xhr.getSync('https://api.github.com/emojis').data
  localStorage.setItem('github-emojis', emojis)
}

emojis = JSON.parse(emojis)

const html = md0(content, {
  useHljs: window.location.search.indexOf('useHljs') !== -1,
  catalog: window.location.search.indexOf('catalog') !== -1,
  emojis
})

const app = document.querySelector('#app')
app.innerHTML = html
