import {getRowType, makeTag, rowFilter} from '../util'

export default {
  get(rows, index) {
    const temp = [rows[index++]]
    for (; index < rows.length; index++) {
      const row = rows[index]
      temp.push(row)
      if (getRowType(row) === 'codeblock') {
        break
      }
    }
    return [index, temp]
  },
  render(rows, option) {
    // remove empty rows
    // rows = removeEmptyRows(rows)
    // remove the 1st row and get the language
    // if not specified, set 'text' as default
    let defineLine = rows.shift()
    while (!defineLine) {
      defineLine = rows.shift()
    }
    const temp = /^(\s*)```(.+?)?\s*$/.exec(defineLine)
    const indent = temp[1]
    const lang = temp[2] || 'text'
    // remove the last row
    rows.pop()

    const html = [makeTag('div', {
      class: 'code-block',
      'data-lang': lang
    }, option)]
    if (option.codeHeader) {
      html.push(`${makeTag('div', 'code-block-header', option)}${makeTag('span', 'code-block-lang', option)}${lang}</span></div>`)
    }
    let style = ''
    if (option.codeHeight) {
      style = `overflow: auto; max-height: ${option.codeHeight}px`
    }
    html.push(makeTag('div', {
      class: 'code-block-body',
      style
    }, option))
    // 行号
    if (option.codeIndex) {
      html.push(makeTag('div', 'code-block-gutter', option))
      rows.forEach((str, i) => {
        html.push(`${makeTag('span', 'code-block-rowindex', option)}${i + 1}</span>`)
      })
      html.push('</div>')
    }
    if (option.useHljs) {
      html.push(`${makeTag('pre', {
        class: 'code-block-content',
        style
      }, option)}<code class="${lang}">`)

      rows.forEach((str) => {
        // 移除多余的缩进
        html.push(rowFilter(str.replace(/&nbsp;/g, ' '), indent, true))
      })
      html.push('</code></pre>')
    } else {
      html.push(makeTag('div', 'code-block-content', option))
      rows.forEach((str) => {
        html.push(`${makeTag('div', 'code-block-line', option)}${rowFilter(str, indent, true)}</div>`)
      })
      html.push('</div>')
    }
    html.push('</div>')
    html.push('</div>')

    return option.render ? option.render('codeblock', html.join('\n'), rows) : html.join('\n')
  }
}
