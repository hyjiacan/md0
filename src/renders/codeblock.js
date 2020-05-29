import {getRowType, rowFilter} from '../util'

export default {
  get (rows, index) {
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
  render (rows, option) {
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

    const html = [`<div class="md0-code-block" data-lang="${lang}">`]
    if (option.codeHeader) {
      html.push(`<div class="md0-code-block-header"><span class="md0-code-block-lang">${lang}</span></div>`)
    }
    let style = ''
    if (option.codeHeight) {
      style = `overflow: auto; max-height: ${option.codeHeight}px`
    }
    html.push(`<div class="md0-code-block-body" style="${style}">`)
    // 行号
    if (option.codeIndex) {
      html.push('<div class="md0-code-block-gutter">')
      rows.forEach((str, i) => {
        html.push(`<span class="md0-code-block-rowindex">${i + 1}</span>`)
      })
      html.push('</div>')
    }
    if (option.useHljs) {
      html.push(`<pre class="md0-code-block-content" style="${style}"><code class="${lang}">`)

      rows.forEach((str) => {
        // 移除多余的缩进
        html.push(rowFilter(str, indent, true))
      })
      html.push('</code></pre>')
    } else {
      html.push('<div class="md0-code-block-content">')
      rows.forEach((str) => {
        html.push(`<div class="md0-code-block-line">${rowFilter(str, indent, true)}</div>`)
      })
      html.push('</div>')
    }
    html.push('</div>')
    html.push('</div>')

    return option.render ? option.render('codeblock', html.join('\n'), rows) : html.join('\n')
  }
}
