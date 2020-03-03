import {getRowType, mergeString, removeEmptyRows, rowFilter} from './util'

const renders = {
  common: function (str) {
    const buffer = {}
    const tpl = str
      // image
      .replace(/!\[(.+?)\]\((.*?)\)/g, function (match, group1, group2) {
        return mergeString('<img src="', group2, '" alt="', group1, '" />')
      })
      // hyper link
      // 处理未使用 []() 格式的超链接为 []() 格式
      .replace(/^((ftp|https?):\/\/[a-z0-9\-_%/\\?&.!@#$()\[\]|,<>{}:]+)/ig, function (match, group1, group2) {
        return mergeString('[', group1, '](', group1, ')<br/>')
      })
      // hyper link
      // 处理未使用 []() 格式的超链接为 []() 格式
      .replace(/([^[('"])((ftp|https?):\/\/[a-z0-9\-_%/\\?&.!@#$()\[\]|,<>{}:]+)/ig, function (match, group1, group2, group3) {
        return mergeString(group1, '[', group2, '](', group2, ')')
      })
      // hyper link
      .replace(/\[(.*?)\]\((.*?)\)/g, function (match, group1, group2) {
        return mergeString('<a href="', group2, '" class="md0-link">', group1, '</a>')
      })
      // bold
      .replace(/([_*]{2})(.+?)\1/g, function (match, group1, group2) {
        return mergeString('<b>', group2, '</b>')
      })
      // italic
      .replace(/([_*])(.+?)\1/g, function (match, group1, group2) {
        return mergeString('<i>', group2, '</i>')
      })
      // inline code
      .replace(/(`)(.+?)\1/g, function (match, group1, group2) {
        return mergeString('<span class="md0-code-inline">', group2.replace(/</g, '&lt;').replace(/>/g, '&gt;'), '</span>')
      })
      // Strikethrough
      .replace(/([-~]{2})(.+?)\1/g, function (match, group1, group2) {
        return mergeString('<span class="md0-strikethrough">', group2, '</span>')
      })

    return tpl.replace(/@\d+@/g, function (match) {
      return buffer[match]
    })
  },
  title: function (str, option, catalog) {
    // console.log(str)
    str = str.replace(/^\s*/g, '')
    let text = str.replace(/#/g, '')
    const level = str.length - text.length
    const tag = 'h' + level
    text = this.common(text)
    // remove tags, white space
    const pureText = text.replace(/(<.+?>|\s+)/g, '').trim()
    catalog.push({
      level: level,
      text: pureText
    })
    const anchor = option.titleAnchor ? mergeString('<a href="#', pureText, '" class="md0-title-anchor"></a>') : ''
    return mergeString('<', tag, ' id="', pureText, '" class="md0-title-', tag, '">', anchor,
      '<span class="md0-title-text">', text.replace(/^\s+/, ''), '</span></', tag, '>')
  },
  codeBlock: function (rows, option) {
    // remove empty rows
    // rows = removeEmptyRows(rows)
    // remove the 1st row and get the language
    // if not specified, set 'text' as default
    let defineLine = rows.shift()
    while (!defineLine) {
      defineLine = rows.shift()
    }
    const temp = /^(\s*)```(.+?)\s*$/.exec(defineLine)
    const indent = temp[1]
    const lang = temp[2] || 'text'
    // remove the last row
    rows.pop()

    const html = [mergeString('<div class="md0-code-block" data-lang="', lang, '">')]
    if (option.codeHeader) {
      html.push(mergeString('<div class="md0-code-block-header"><span class="md0-code-block-lang">', lang, '</span></div>'))
    }
    let style = ''
    if (option.codeHeight) {
      style = mergeString('overflow: auto; max-height: ', option.codeHeight, 'px')
    }
    html.push(mergeString('<div class="md0-code-block-body" style="', style, '">'))
    // 行号
    if (option.codeIndex) {
      html.push('<div class="md0-code-block-gutter">')
      rows.forEach((str, i) => {
        html.push(mergeString('<span class="md0-code-block-rowindex">', i + 1, '</span>'))
      })
      html.push('</div>')
    }
    if (option.useHljs) {
      html.push(mergeString('<pre class="md0-code-block-content" style="', style, '"><code class="' + lang + '">'))

      rows.forEach((str) => {
        // 移除多余的缩进
        html.push(rowFilter(str, indent, true))
      })
      html.push('</code></pre>')
    } else {
      html.push('<div class="md0-code-block-content">')
      rows.forEach((str) => {
        html.push(mergeString('<div class="md0-code-block-line">', rowFilter(str, indent, true), '</div>'))
      })
      html.push('</div>')
    }
    html.push('</div>')
    html.push('</div>')
    return html.join('\n')
  },
  table: function (rows) {
    // remove empty rows
    rows = removeEmptyRows(rows)
    const html = ['<table class="md0-table">']
    const header = rows.shift().split('|')
    const align = rows.shift().split('|').map((col) => {
      if (/^\s*:-+:\s*$/.test(col)) {
        return 'md-0-table-align-center'
      }

      if (/^\s*-+:\s*$/.test(col)) {
        return 'md-0-table-align-right'
      }
      return 'md-0-table-align-left'
    })
    html.push('<thead><tr>')
    let i
    for (i = 1; i < header.length - 1; i++) {
      html.push(mergeString('<th class="md0-table-cell ', align[i], '">', this.common(header[i]), '</th>'))
    }
    html.push('</tr></thead>')
    html.push('<tbody>')
    for (i = 0; i < rows.length; i++) {
      const row = rows[i].split('|')
      html.push('<tr>')
      for (let j = 1; j < header.length - 1; j++) {
        html.push(mergeString('<td class="md0-table-cell ', align[j], '">', this.common(row[j]), '</td>'))
      }
      html.push('</tr>')
    }
    html.push('</tbody>')
    html.push('</table>')
    return html.join('\n')
  },
  list: function (rows) {
    // remove empty rows
    rows = removeEmptyRows(rows)
    const firstItem = rows[0]
    let indent = firstItem.length - firstItem.replace(/^\s+/, '').length
    const reg = /^\s*[*-]\s/
    const type = reg.test(firstItem) ? 'ul' : 'ol'
    let level = 0
    const typeStack = []
    const indentStack = []
    let subType

    const html = [mergeString('<', type, ' class="md0-list md0-list-level-' + level + '">')]

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      const itemIndent = row.length - row.replace(/^\s*/, '').length
      if (itemIndent > indent) {
        // 有更多缩进，重新获取列表类型
        subType = reg.test(row) ? 'ul' : 'ol'
        // 下级列表开始
        typeStack.push(subType)
        indentStack.push(itemIndent)
        html.push(mergeString('<', subType, ' class="md0-list md0-list-level-' + (++level) + '">'))
      } else if (itemIndent < indent) {
        // 下级列表结束
        while (true) {
          if (!indentStack.length) {
            break
          }
          if (indentStack[indentStack.length - 1] <= itemIndent) {
            break
          }
          indentStack.pop()
          html.push(mergeString('</', typeStack.pop(), '>'))
        }
      }
      indent = itemIndent
      row = row.replace(/^\s*(\*|-|[0-9]+\.?)\s/, '')
      const t = getRowType(row)
      // 是否是选择列表
      if (t === 'check') {
        row = row.replace(/^\[ \]/, '')
        row = this.check(this.common(row))
      } else if (t === 'checked') {
        row = row.replace(/^\[x\]/, '')
        row = this.checked(this.common(row))
      } else {
        row = this.common(row)
      }
      html.push(mergeString('<li class="md0-list-item">', row, '</li>'))
    }

    html.push(mergeString('</', type, '>'))
    return html.join('\n')
  },
  quote: function (rows) {
    rows = rows.map((str) => {
      return this.common(str.replace(/^\s*>/, ''))
    })
    return mergeString('<blockquote class="md0-quote">', rows.join(''), '</blockquote>')
  },
  newline: function (rows) {
    return rows.length > 1 ? '<br/>' : ''
  },
  line: function () {
    return '<hr class="md0-line" />'
  },
  check: function (str) {
    return mergeString('<label class="md0-checkbox"><input type="checkbox" disabled="disabled" />',
      str.replace(/^\[ \]/, ''), '</label>')
  },
  checked: function (str) {
    return mergeString('<label class="md0-checkbox md0-checkbox-checked"><input type="checkbox" disabled="disabled" checked="checked" />',
      str.replace(/^\[x\]/, ''), '</label>')
  },
  fillCatalogItem: function (n) {
    const temp = []
    for (let i = 1; i < n; i++) {
      temp.push('··')
    }
    return mergeString('<span class="md0-catalog-dots">', temp.join(''), '</span>')
  }
}

export default renders
