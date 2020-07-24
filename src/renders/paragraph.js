import {getRowType} from '../util'

import title from './title'
import codeblock from './codeblock'
import list from './list'
import blockquote from './blockquote'
import table from './table'
import newline from './newline'
import empty from './empty'
import line from './line'
import check from './check'
import checked from './checked'
import common from './common'

const renders = {
  title,
  codeblock,
  list,
  blockquote,
  table,
  newline,
  empty,
  line,
  check,
  checked,
  common
}

export default {
  get (rows, index, option) {
    const temp = []
    for (; index < rows.length; index++) {
      const row = rows[index]
      const type = getRowType(row, rows[index + 1])
      if (['codeblock', 'list', 'table-header','table-row', 'newline', 'title', 'blockquote'].indexOf(type) !== -1) {
        break
      }
      temp.push(`${renders[type || 'common'].render(row, option)}`)
    }
    return [--index, temp]
  }
}
