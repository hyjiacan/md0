import common from './common'
import {getRowType, mergeString} from '../util'

export default {
  get (rows, index) {
    const temp = [rows[index++]]
    let indent = -1
    for (; index < rows.length; index++) {
      const row = rows[index]
      const rowIndent = row.length - row.replace(/^\s*/, '').length
      if (indent === -1) {
        indent = rowIndent
      }
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
  render (rows, option) {
    rows = rows.map((str) => {
      return common.render(str.replace(/^\s*>/, ''), option)
    })
    const html = mergeString('<blockquote class="md0-blockquote">', rows.join(''), '</blockquote>')
    return option.render ? option.render('blockquote', html, rows) : html
  }
}
