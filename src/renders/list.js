import {getRowType, mergeString, removeEmptyRows} from '../util'
import codeblock from './codeblock'
import blockquote from './blockquote'
import table from './table'
import common from './common'
import check from './check'
import checked from './checked'

export default {
  get (rows, index, option) {
    const temp = [rows[index++]]
    let emptyLineCount = 0
    let buffer, _
    // 遇到两个空行或隔一行后不是列表时，列表结束
    for (; index < rows.length; index++) {
      const row = rows[index]
      const rowType = getRowType(row)
      if (rowType === 'newline') {
        emptyLineCount++
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
      } else if (rowType === 'table') {
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
  render (rows, option) {
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
        row = check.render(common.render(row, option), option)
      } else if (t === 'checked') {
        row = row.replace(/^\[x\]/, '')
        row = checked.render(common.render(row, option), option)
      } else {
        row = common.render(row, option)
      }
      html.push(mergeString('<li class="md0-list-item">', row, '</li>'))
    }

    html.push(mergeString('</', type, '>'))

    return option.render ? option.render('list', html.join('\n'), rows) : html.join('\n')
  }
}
