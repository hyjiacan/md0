// 下载 emoji

const fs = require('fs')
const path = require('path')
const http = require('https')

const pkg = require('../package')

const EMOJIS_URL = 'https://api.github.com/emojis'

console.info('[md0] Emojis is downloading from %s', EMOJIS_URL)

const url = new URL(EMOJIS_URL)

const options = {
  host: url.host,
  path: url.pathname,
  headers: {
    'user-agent': `${pkg.name}/${pkg.version}`,
    'accept': 'application/vnd.github.v3+json',
    'accept-encoding': 'utf-8'
  },
  rejectUnauthorized: false
}

http.get(options, res => {
  if (res.statusCode !== 200) {
    throw Error(res.statusMessage)
  }
  let content = ''
  res.on('data', data => {
    content += data
  })

  res.on('end', () => {
    console.info('[md0] Emojis downloaded')
    storeData(content)
  })

  res.on('error', err => {
    throw err
  })
})

function storeData(content) {
  const storePath = path.join(__dirname, '../assets')
  if (!fs.existsSync(storePath)) {
    fs.mkdirSync(storePath, {recursive: true})
  }
  fs.writeFileSync(path.join(storePath, 'emojis.json'), content, {encoding: 'utf8'})
  console.info('[md0] Emojis are available')
}
