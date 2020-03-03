import {getOption, getRowType, mergeString} from './util'
import renders from './renders'
import {
  getCodeBlock,
  getEmptyBlock,
  getListBlock,
  getParagraphBlock,
  getQuoteBlock,
  getReferenceBlock,
  getTableBlock
} from './block-getter'

import './md0.less'

function renderRows (rows, refMap, option, catalog) {
  const html = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    let type = getRowType(row)
    let buffer

    // code block
    // 代码的优先级高干一切
    if (type === 'codeBlock') {
      [i, buffer] = getCodeBlock(rows, i)
      html.push(renders.codeBlock(buffer, option))
      continue
    }

    if (type === 'ref') {
      let refName
      [i, buffer, refName] = getReferenceBlock(rows, i)
      refMap[refName] = renderRows(buffer, refMap, getOption(option, {
        codeIndex: false,
        codeHeader: false,
        codeHeight: 0
      }), catalog)
      continue
    }

    if (type === 'title') {
      html.push(renders.title(row, option, catalog))
      continue
    }

    // list
    if (type === 'list') {
      [i, buffer] = getListBlock(rows, i, option)
      html.push(renders.list(buffer))
      continue
    }

    // quote
    if (type === 'quote') {
      [i, buffer] = getQuoteBlock(rows, i)
      html.push(renders.quote(buffer))
      continue
    }

    // table
    if (type === 'table') {
      [i, buffer] = getTableBlock(rows, i)
      html.push(renders.table(buffer))
      continue
    }

    if (type === 'newline') {
      [i, buffer] = getEmptyBlock(rows, i)
      html.push(renders.newline(buffer))
      continue
    }

    if (!type) {
      type = 'common'
      html.push('<div class="md0-paragraph">')
    } else {
      // console.log(i, 'render', type)
    }
    [i, buffer] = getParagraphBlock(rows, i, option)
    html.push(buffer.join(''))
    if (type === 'common') {
      html.push('</div>')
    }
  }
  return html.join('\n')
}

function processCodeBlock () {
  if (hljs) hljs.initHighlighting()
  const codes = document.querySelectorAll('pre>code')
  codes.forEach(function (codeBlock) {
    const content = codeBlock.innerHTML
    const lines = content.split(/\n/g)
    lines.shift()
    lines.pop()
    codeBlock.innerHTML = '<div class="md0-code-block-line">' + lines.join('</div><div class="md0-code-block-line">') + '</div>'
  })
}


/**
 * Convert markdown content into html
 * @param {string} markdownContent Markdown content
 * @param {object} [option]
 */
function render (markdownContent, option) {
  /**
   * 转义表
   * @type {{}}
   */
  const escapeMap = {}
  /**
   * 引用表
   * @type {{}}
   */
  const refMap = {}
  /**
   * 目录
   * @type {Array}
   */
  const catalog = []
  const rows = markdownContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    // 处理转义
    .replace(/\\(.)/g, function (match, ch) {
      const code = ch.charCodeAt(0)
      escapeMap[code] = ch
      return mergeString('$ESCAPE', code, 'EPACSE$')
    })
    // 处理引用
    .replace(/&([a-z\-_0-9]+?)&/ig, function (match, name) {
      if (!name) {
        return match
      }
      return mergeString('$REF', name, 'FER$')
    })
    .split('\n')

  const html = ['<div class="md0-container">']

  option = getOption(option)

  html.push(renderRows(rows, refMap, option, catalog))
  html.push('</div>')
  if (option.catalog) {
    html.unshift('<ul class="md0-catalog">\n' + catalog.map(function (h) {
      return mergeString('<li><a href="#', h.text, '">', renders.fillCatalogItem(h.level), '# ', h.text, '</a></li>')
    }).join('\n') + '</ul>\n')
  }
  const temp = html.join('\n').replace(/\$ESCAPE([0-9]+)EPACSE\$/g, function (match, code) {
    const ch = escapeMap[code]
    return ch === '\&' ? '&' : ch
  }).replace(/\$REF(.+?)FER\$/g, function (match, name) {
    return refMap[name] || mergeString('&', name, '&')
  })
  if (!option.useHljs) {
    return temp
  }
  // 处理 highlight.js 渲染后的代码行
  if (global.window !== global) {
    // node 环境
    return temp + ['<' + 'script>', processCodeBlock.toString(), 'processCodeBlock();</' + 'script>'].join('')
  }
  // 浏览器环境
  // 等待DOM渲染完成再调用
  setTimeout(function () {
    processCodeBlock()
  }, 100)
  return temp
}

export default render
