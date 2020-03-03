import {getRowType} from './util'
import renders from './renders'

export function getCodeBlock (rows, index) {
  const temp = [rows[index++]]
  for (; index < rows.length; index++) {
    const row = rows[index]
    temp.push(row)
    if (getRowType(row) === 'codeBlock') {
      break
    }
  }
  return [index, temp]
}

export function getListBlock (rows, index, option) {
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
    if (rowType === 'codeBlock') {
      _ = temp.pop();
      [index, buffer] = getCodeBlock(rows, index)
      temp.push(_ + renders.codeBlock(buffer, option))
    } else if (rowType === 'quote') {
      _ = temp.pop();
      [index, buffer] = getQuoteBlock(rows, index)
      temp.push(_ + renders.quote(buffer))
    } else if (rowType === 'table') {
      _ = temp.pop();
      [index, buffer] = getTableBlock(rows, index)
      temp.push(_ + renders.table(buffer))
    } else if (row) {
      temp.push(row)
    }
    buffer = []
  }
  return [--index, temp]
}

export function getQuoteBlock (rows, index) {
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
}

export function getTableBlock (rows, index) {
  const temp = [rows[index++]]
  for (; index < rows.length; index++) {
    const row = rows[index]
    if (getRowType(row) !== 'table') {
      break
    }
    temp.push(row)
  }
  return [--index, temp]
}

export function getParagraphBlock (rows, index, option) {
  const temp = []
  for (; index < rows.length; index++) {
    const row = rows[index]
    const type = getRowType(row)
    if (['codeBlock', 'list', 'table', 'newline', 'title', 'quote'].indexOf(type) !== -1) {
      break
    }
    temp.push(renders[type || 'common'](row, option))
  }
  return [--index, temp]
}

export function getEmptyBlock (rows, index) {
  const temp = [rows[index++]]
  for (; index < rows.length; index++) {
    const row = rows[index]
    if (getRowType(row) !== 'newline') {
      break
    }
    temp.push(row)
  }
  return [--index, temp]
}

export function getReferenceBlock (rows, index) {
  const temp = []
  const refName = rows[index].substring(3).replace(/\s+$/, '')
  index++
  for (; index < rows.length; index++) {
    const row = rows[index]
    if (getRowType(row) === 'ref') {
      break
    }
    temp.push(row)
  }
  return [index, temp, refName]
}
