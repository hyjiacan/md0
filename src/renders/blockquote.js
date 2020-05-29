import common from './common'
import {getRowType} from '../util'

export default {
  get(rows, index) {
    const temp = [rows[index++]]
    // 初始缩进
    const indent = temp[0].length - temp[0].replace(/^\s*/, '').length
    for (; index < rows.length; index++) {
      const row = rows[index]
      const rowIndent = row.length - row.replace(/^\s*/, '').length
      if (getRowType(row) === 'newline') {
        break
      }
      if (rowIndent !== indent) {
        break
      }
      temp.push(row)
    }
    return [--index, temp]
  },
  render(rows, option) {
    const indent = /^\s*/.exec(rows[0])[0].length
    rows = rows.map((str) => {
      return common.render(str.replace(/^\s*>/, ''), option)
    })
    const html = `<blockquote class="md0-blockquote" style="margin-left: ${indent}em">${rows.join('')}</blockquote>`
    return option.render ? option.render('blockquote', html, rows) : html
  }
}
