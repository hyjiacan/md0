/**
 * 获取行的类型
 * @param row
 * @param nextRow
 * @return {string}
 */
export function getRowType(row, nextRow) {
  row = row.replace(/^\s*/g, '')

  if (/^\s*```/.test(row)) {
    return 'codeblock'
  }

  if (/^#/.test(row)) {
    return 'title'
  }

  if (/^\|/.test(row)) {
    if (nextRow && /^\|\s*:?-+/.test(nextRow)) {
      return 'table-header'
    }
    return 'table-row'
  }

  if (/^(-|\*|[0-9]+\.?)\s/.test(row)) {
    return 'list'
  }

  if (/^>/.test(row)) {
    return 'blockquote'
  }

  if (/^---/.test(row)) {
    return 'line'
  }

  if (/^\[ \]/.test(row)) {
    return 'check'
  }

  if (/^\[x\]/.test(row)) {
    return 'checked'
  }

  if (/^&&&/.test(row)) {
    return 'reference'
  }

  if (!row) {
    return 'newline'
  }
}

/**
 * 合并多个空行为一行
 * @param rows
 * @return {*}
 */
export function removeEmptyRows(rows) {
  return rows.filter(function (row) {
    return !/^\s*$/.test(row)
  })
}

function setMergedOption(result, option, customize, property, defaultValue) {
  if (customize.hasOwnProperty(property)) {
    option[property] = customize[property]
  } else {
    option[property] = option.hasOwnProperty(property) ? option[property] : defaultValue
  }
}

export function getOption(option, customize) {
  option = option || {}
  customize = customize || {}
  const result = {}

  setMergedOption(result, option, customize, 'titleAnchor', true)
  setMergedOption(result, option, customize, 'codeIndex', false)
  setMergedOption(result, option, customize, 'codeHeader', false)
  setMergedOption(result, option, customize, 'codeHeight', 0)
  setMergedOption(result, option, customize, 'catalog', false)
  setMergedOption(result, option, customize, 'useHljs', false)
  setMergedOption(result, option, customize, 'emojis', {})
  setMergedOption(result, option, customize, 'emojiSize', '18px')

  return option
}

/**
 * 处理行的特殊字符
 * @param row
 * @param indent
 * @param space 是否处理空格
 */
export function rowFilter(row, indent, space) {
  const temp = row.substring(indent ? indent.length : 0)
    .replace(/\t/g, '    ')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return space ? temp.replace(/ /g, '&nbsp;') : temp
}
