import {getOption, makeTag} from './util'


import './md0.less'
import renders from './renders'
import catalog from './renders/catalog'

function processCodeBlock(option) {
  if (hljs) hljs.initHighlighting()
  // const codes = document.querySelectorAll('pre>code')
  // codes.forEach(function (codeBlock) {
  //   const content = codeBlock.innerHTML
  //   const lines = content.split(/\n/g)
  //   lines.shift()
  //   lines.pop()
  //   codeBlock.innerHTML = lines.map(line => {
  //     return `${makeTag('div', 'code-block-line', option)}${line}</div>`
  //   }).join('\n')
  // })
}


/**
 * Convert markdown content into html
 * @param {string} markdownContent Markdown content
 * @param {object} [option]
 */
function md0(markdownContent, option) {
  // 设置默认选项
  option = getOption(option)

  /**
   * 引用表
   * @type {{}}
   */
  const refMap = {}
  /**
   * 目录
   * @type {Array}
   */
  const catalogData = []

  const rows = markdownContent.split(/\n/g)

  const html = [makeTag('div', 'container', option)]

  // renderRows 可能会更新 option.catalog 的值为 true
  html.push(renders.renderRows(rows, refMap, option, catalogData))
  html.push('</div>')

  let temp = html.join('\n')
    .replace(/\$REF(.+?)FER\$/g, function (match, name) {
      return refMap.hasOwnProperty(name) ? refMap[name] : name
    })

  if (option.catalog) {
    const catalogHtml = `${makeTag('ul', 'catalog', option)}\n` + catalogData.map(function (h) {
      return `<li><a href="#${h.text}">${catalog.fillDots(h.level, option)}# ${h.text}</a></li>`
    }).join('\n') + '</ul>\n'

    if (/\[toc]/.test(temp)) {
      temp = temp.replace('[toc]', catalogHtml)
    } else {
      temp = (option.render ? option.render('catalog', catalogHtml, catalogData) : catalogHtml) + temp
    }
  }

  if (!option.useHljs) {
    return temp
  }
  // 处理 highlight.js 渲染后的代码行
  if (global.window !== global) {
    // node 环境
    return temp + ['<' + 'script>', processCodeBlock.toString(), processCodeBlock.name, '(JSON.stringify(option);</' + 'script>'].join('')
  }
  // 浏览器环境
  // 等待DOM渲染完成再调用
  setTimeout(function () {
    processCodeBlock(option)
  }, 100)
  return temp
}

export default md0
