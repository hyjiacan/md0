import {getOption, getRowType} from './util'

import reference from './renders/reference'
import title from './renders/title'
import codeblock from './renders/codeblock'
import list from './renders/list'
import blockquote from './renders/blockquote'
import table from './renders/table'
import newline from './renders/newline'
import empty from './renders/empty'
import paragraph from './renders/paragraph'
import catalog from './renders/catalog'

import './md0.less'

function renderRows(rows, refMap, option, catalog) {
  // 最后生成的 html 内容
  const html = []

  // 遍历每一行，分析内容
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    // 获取此行的类型
    let type = getRowType(row)
    let buffer

    // 代码的优先级高于其他
    if (type === 'codeblock') {
      [i, buffer] = codeblock.get(rows, i)
      html.push(codeblock.render(buffer, option))
      continue
    }

    if (type === 'reference') {
      let refName
      [i, buffer, refName] = reference.get(rows, i)
      refMap[refName] = renderRows(buffer, refMap, getOption(option, {
        codeIndex: false,
        codeHeader: false,
        codeHeight: 0
      }), catalog)
      continue
    }

    if (type === 'title') {
      html.push(title.render(row, option, catalog))
      continue
    }

    // list
    if (type === 'list') {
      [i, buffer] = list.get(rows, i, option)
      html.push(list.render(buffer, option))
      continue
    }

    // blockquote
    if (type === 'blockquote') {
      [i, buffer] = blockquote.get(rows, i)
      html.push(blockquote.render(buffer, option))
      continue
    }

    // table
    if (type === 'table') {
      [i, buffer] = table.get(rows, i)
      html.push(table.render(buffer, option))
      continue
    }

    if (type === 'newline') {
      [i, buffer] = empty.get(rows, i)
      html.push(newline.render(buffer, option))
      continue
    }

    if (!type) {
      type = 'common'
      html.push('<div class="md0-paragraph">')
    } else {
      // console.log(i, 'render', type)
    }
    [i, buffer] = paragraph.get(rows, i, option)
    html.push(buffer.join(''))
    if (type === 'common') {
      html.push('</div>')
    }
  }
  return html.join('\n')
}

function processCodeBlock() {
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
function md0(markdownContent, option) {
  /**
   * 缓存串表
   * @type {{}}
   */
  const cacheMap = {}
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

  let index = 0

  // 不能将多个空行合并成一个，即：不能执行 replace(/\n\n/g, '\n')
  // 因为替换会导致原有的格式发生变化，从而影响解析结果

  // 处理换行符
  markdownContent = markdownContent.replace(/\r/g, '\n')
    .replace(/\n/g, function (match) {
      return '$LF@@FL$'
    })

  // 将代码先处理
  markdownContent = markdownContent
    // 代码块
    // 需要在行内代码前处理
    .replace(/`{3}.+?`{3}/g, function (match) {
      cacheMap[index] = match.replace(/&/g, '&amp;')
      return `$CODE${index++}EDOC$`
    })
    // 行内代码
    .replace(/`.+?`/g, function (match) {
      cacheMap[index] = match.replace(/&/g, '&amp;')
      return `$CODE${index++}EDOC$`
    })


  // 处理转义
  markdownContent = markdownContent.replace(/\\(.)/g, function (match, ch) {
    cacheMap[index] = ch
    return `$CACHE${index++}EHCAC$`
  })

  // 处理剩下内容中的html
  markdownContent = markdownContent.replace(/<\/?([a-z0-9_-]+?)(\s+.+?)?>/g, function (match) {
    cacheMap[index] = match
    return `$CACHE${index++}EHCAC$`
  })

  // 处理引用
  markdownContent = markdownContent.replace(/&([a-z\-_0-9]+?)&/ig, function (match, name) {
    if (!name) {
      return match
    }
    return `$REF${index++}FER$`
  })

  // 是否有 [toc] （目录标记）
  const renderCatalog = /\[toc]/i.test(markdownContent)
  if (renderCatalog) {
    markdownContent = markdownContent.replace(/\[toc]/i, '@CATALOG-TOC-GOLATAC@')
  }

  // 还原代码
  markdownContent = markdownContent.replace(/\$CODE(\d+)EDOC\$/g, function (match, idx) {
    return cacheMap[idx]
  })

  const rows = markdownContent.split(/\$LF@@FL\$/g)

  const html = ['<div class="md0-container">']

  option = getOption(option)

  html.push(renderRows(rows, refMap, option, catalogData))
  html.push('</div>')

  let temp = html.join('\n')
    .replace(/\$REF(.+?)FER\$/g, function (match, name) {
      return refMap[name] || `&${name}&`
    })
    .replace(/\$CACHE(\d+)EHCAC\$/g, function (match, idx) {
      return cacheMap[idx]
    })

  if (option.catalog || renderCatalog) {
    const catalogHtml = '<ul class="md0-catalog">\n' + catalogData.map(function (h) {
      return `<li><a href="#${h.text}">${catalog.fillDots(h.level)}# ${h.text}</a></li>`
    }).join('\n') + '</ul>\n'

    if (renderCatalog) {
      temp = temp.replace('@CATALOG-TOC-GOLATAC@', catalogHtml)
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
    return temp + ['<' + 'script>', processCodeBlock.toString(), processCodeBlock.name, '();</' + 'script>'].join('')
  }
  // 浏览器环境
  // 等待DOM渲染完成再调用
  setTimeout(function () {
    processCodeBlock()
  }, 100)
  return temp
}

export default md0
