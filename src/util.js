/**
 * 获取行的类型
 * @param str
 * @return {string}
 */
export function getRowType (str) {
  str = str.replace(/^\s*/g, '')

  if (/^\s*```/.test(str)) {
    return 'codeblock'
  }

  if (/^#/.test(str)) {
    return 'title'
  }

  if (/^\|/.test(str)) {
    return 'table'
  }

  if (/^(-|\*|[0-9]+\.?)\s/.test(str)) {
    return 'list'
  }

  if (/^>/.test(str)) {
    return 'blockquote'
  }

  if (/^---/.test(str)) {
    return 'line'
  }

  if (/^\[ \]/.test(str)) {
    return 'check'
  }

  if (/^\[x\]/.test(str)) {
    return 'checked'
  }

  if (/^&&&/.test(str)) {
    return 'reference'
  }

  if (!str) {
    return 'newline'
  }
}

/**
 * 合并多个空行为一行
 * @param rows
 * @return {*}
 */
export function removeEmptyRows (rows) {
  return rows.filter(function (row) {
    return !/^\s*$/.test(row)
  })
}

function setMergedOption (result, option, customize, property, defaultValue) {
  if (customize.hasOwnProperty(property)) {
    option[property] = customize[property]
  } else {
    option[property] = option.hasOwnProperty(property) ? option[property] : defaultValue
  }
}

export function getOption (option, customize) {
  option = option || {}
  customize = customize || {}
  const result = {}

  setMergedOption(result, option, customize, 'titleAnchor', true)
  setMergedOption(result, option, customize, 'codeIndex', true)
  setMergedOption(result, option, customize, 'codeHeader', true)
  setMergedOption(result, option, customize, 'codeHeight', 0)
  setMergedOption(result, option, customize, 'catalog', false)
  setMergedOption(result, option, customize, 'useHljs', false)
  setMergedOption(result, option, customize, 'emojiSize', '18px')

  return option
}

/**
 * 处理行的特殊字符
 * @param row
 * @param indent
 * @param space 是否处理空格
 */
export function rowFilter (row, indent, space) {
  const temp = row.substring(indent ? indent.length : 0)
    .replace(/\t/g, '    ')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return space ? temp.replace(/ /g, '&nbsp;') : temp
}
