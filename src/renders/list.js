import {getRowType, makeTag} from '../util'
import codeblock from './codeblock'
import blockquote from './blockquote'
import table from './table'
import common from './common'
import check from './check'
import checked from './checked'

export default {
  get(rows, index, option) {
    const temp = [rows[index++]]
    let emptyLineCount = 0
    let buffer, _
    // 遇到两个空行或隔一行后不是列表时，列表结束
    for (; index < rows.length; index++) {
      const row = rows[index]
      const rowType = getRowType(row, rows[index + 1])
      if (rowType === 'newline') {
        emptyLineCount++
        // 两个空行了
        if (emptyLineCount === 2) {
          break
        }
        continue
      }
      if (emptyLineCount === 1 && rowType !== 'list') {
        break
      }
      emptyLineCount = 0
      if (rowType === 'codeblock') {
        _ = temp.pop();
        [index, buffer] = codeblock.get(rows, index)
        temp.push(_ + codeblock.render(buffer, option))
      } else if (rowType === 'blockquote') {
        _ = temp.pop();
        [index, buffer] = blockquote.get(rows, index)
        temp.push(_ + blockquote.render(buffer, option))
      } else if (rowType === 'table-header') {
        _ = temp.pop();
        [index, buffer] = table.get(rows, index)
        temp.push(_ + table.render(buffer, option))
      } else if (row) {
        temp.push(row)
      }
      buffer = []
    }
    return [--index, temp]
  },
  render(rows, option) {
    // remove empty rows
    // rows = removeEmptyRows(rows)
    const firstItem = rows[0]
    let indent = firstItem.length - firstItem.replace(/^\s+/, '').length
    const regUl = /^\s*[*-]\s/
    const type = regUl.test(firstItem) ? 'ul' : 'ol'
    let level = 0
    const typeStack = []
    const indentStack = []
    let subType

    const html = [makeTag(type, `list list-level-${level}`, option)]

    const buffer = []

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      const itemIndent = row.length - row.replace(/^\s*/, '').length
      if (itemIndent > indent) {
        // 有更多缩进，重新获取列表类型
        subType = regUl.test(row) ? 'ul' : 'ol'
        // 下级列表开始
        typeStack.push(subType)
        indentStack.push(itemIndent)
        html.push(makeTag(subType, `list list-level-${++level}`, option))
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
          html.push(`</${typeStack.pop()}>`)
        }
      }
      indent = itemIndent
      row = row.replace(/^\s*(\*|-|[0-9]+\.?)\s/, '')
      const t = getRowType(row, rows[i + 1])
      // 是否是选择列表
      if (t === 'check') {
        row = row.replace(/^\[ \]/, '')
        row = check.render(common.render(row, option), option)
      } else if (t === 'checked') {
        row = row.replace(/^\[x\]/, '')
        row = checked.render(common.render(row, option), option)
      } else {
        row = common.render(row, option)
      }
      const nextRow = rows[i + 1]
      if (nextRow && getRowType(nextRow, rows[i + 2]) !== 'list') {
        buffer.push(row)
        continue
      }
      if (buffer.length) {
        row = buffer.join('')
        buffer.length = 0
      }
      html.push(`${makeTag('li', 'list-item', option)}${row}</li>`)
    }

    while (typeStack.length) {
      html.push(`</${typeStack.pop()}>`)
    }

    html.push(`</${type}>`)

    return option.render ? option.render('list', html.join('\n'), rows) : html.join('\n')
  }
}
