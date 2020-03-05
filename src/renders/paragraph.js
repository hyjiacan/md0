import {getRowType} from '../util'

import reference from './reference'
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
  reference,
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
      const type = getRowType(row)
      if (['codeblock', 'list', 'table', 'newline', 'title', 'blockquote'].indexOf(type) !== -1) {
        break
      }
      temp.push(renders[type || 'common'].render(row, option))
    }
    return [--index, temp]
  }
}