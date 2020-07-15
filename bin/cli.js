#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const argv = require('yargs').argv
const walk = require('walkdir')
const md0 = require('../dist/md0')

const emojis = require('../assets/emojis')

const workingDir = process.cwd()

function getOptionValue(name, defaultValue) {
  if (!argv.hasOwnProperty(name)) {
    return defaultValue
  }

  const val = argv[name]
  if (typeof defaultValue === typeof val) {
    return val
  }

  if (typeof defaultValue === 'boolean') {
    if (['true', 'false'].indexOf(val) === -1) {
      throw Error(`[${name}]无效值: ${val}`)
    }
    return val === 'true'
  }

  if (typeof defaultValue === 'number') {
    const temp = parseInt(val)
    if (isNaN(temp) || temp < 0) {
      throw Error(`[${name}]无效值: ${val}`)
    }
    return temp
  }

  return val
}

function parse(inputFile, outputFile, option) {
  const template = fs.readFileSync(path.join(__dirname, 'template.html'), {
    encoding: 'utf-8'
  })

  console.log('Read ' + inputFile)
  const content = fs.readFileSync(inputFile, {
    encoding: 'utf8'
  })

  console.log('Parse content')
  console.time('parse')

  const markdownHtml = md0(content, option)

  const title = option.title || path.basename(inputFile, path.extname(inputFile))
  const css = option.clean ? '' : fs.readFileSync(path.join(__dirname, '../dist/md0.css'), {
    encoding: 'utf-8'
  })

  const html = template
    .replace('{title}', title)
    .replace('/*{style}*/', css)
    .replace('{content}', markdownHtml)
  console.timeEnd('parse')
  console.log('Write ' + outputFile)
  fs.writeFileSync(outputFile, html, {
    encoding: 'utf8'
  })
}

function getOutputFile(inputRoot, inputFile, outputDir) {
  outputDir = path.isAbsolute(outputDir) ? outputDir : path.join(workingDir, outputDir)

  // 获取相对路径
  const relativePath = path.relative(inputRoot, inputFile)
  // 更换扩展名
  const htmlFile = path.join(path.dirname(relativePath), path.basename(relativePath, path.extname(relativePath))) + '.html'

  const outputFile = path.join(outputDir, htmlFile)
  const outputPath = path.dirname(outputFile)

  if (!fs.existsSync(outputPath)) {
    console.info('mkdir: %s', outputPath)
    fs.mkdirSync(outputPath, {recursive: true})
  }

  return outputFile
}

function usage() {
  const usage = `md0: a ugly markdown parser
---------------------------------------------------
md0 <input> [--options]
---------------------------------------------------
input 要转换的markdown文件/目录
options
- output 输出目录，默认为 output
- title 指定输出文件的 title，不指定时使用文件名
- clean 是否渲染为清洁模式，清洁模式时会保留浏览器的默认样式，默认为 true
- code-header 是否渲染代码块头，默认为 true
- code-index 是否渲染代码行号，默认为 true
- code-height 设置代码块最大高度，单位为像素，设置为 0 时表示自动调整。默认为 0
- title-anchor 是否渲染标题的锚点，默认为 true
- catalog 是否根据标题渲染目录，默认为 false
- use-hljs 是否使用 highlight.js 高亮代码块，默认为 false
- base64 是否将本地图片作为 base64 数据格式嵌入，默认为 false
`
  console.info(usage)
}

!(function () {
  let input = argv._[0]
  if (!input) {
    usage()
    return
  }

  if (!path.isAbsolute(input)) {
    input = path.resolve(path.join(workingDir, input))
  }

  if (!fs.existsSync(input)) {
    console.info('[md0] File/Path not found: %s', input)
    return
  }
  // 根据输入判断是否是目录
  const isDir = fs.statSync(input).isDirectory()

  const output = getOptionValue('output', 'output')

  let option

  try {
    option = {
      codeHeight: getOptionValue('code-height', 0),
      codeIndex: getOptionValue('code-index', true),
      codeHeader: getOptionValue('code-header', true),
      clean: getOptionValue('clean', false),
      catalog: getOptionValue('catalog', false),
      useHljs: getOptionValue('use-hljs', false),
      titleAnchor: getOptionValue('title-anchor', true),
      base64: getOptionValue('base64', false),
      emojis
    }
    if (option.base64) {
      option.render = function (type, html) {
        if (!/^<img/i.test(html)) {
          return html
        }
        const src = /src="(.+?)"/.exec(html)[1]
        if (!src) {
          return html
        }
        // TODO 暂时只支持本地图片
        if (/^(https?|ftp):\/\//i.test(src)) {
          return html
        }
        if (fs.existsSync(src)) {
          const data = fs.readFileSync(src)
          return html.replace(/src="(.+?)"/,
            `src="data:image/${path.extname(src).substring(1)};base64,${data.toString('base64')}"`)
        }
        return html
      }
    }
  } catch (e) {
    console.error(e.message)
    console.info(usage)
    return
  }

  if (!isDir) {
    parse(input, getOutputFile(path.dirname(input), input, output), option)
    return
  }

  const emitter = walk(input)

  emitter.on('file', (i, stat) => {
    if (!(/\.(md|markdown)$/i.test(i))) {
      return
    }
    parse(i, getOutputFile(input, i, output), option)
  })
})()
