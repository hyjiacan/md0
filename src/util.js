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

  if (/^(([*-]\s*){3,})$/.test(row)) {
    return 'line'
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

  if (/^\[ ]/.test(row)) {
    return 'check'
  }

  if (/^\[x]/.test(row)) {
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
  setMergedOption(result, option, customize, 'clean', false)
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

export function makeTag(tag, classNameOrAttrs, option) {
  if (typeof classNameOrAttrs === 'string') {
    classNameOrAttrs = {
      class: classNameOrAttrs
    }
  }
  if (option.clean) {
    delete classNameOrAttrs.class
  } else if (classNameOrAttrs.class) {
    classNameOrAttrs.class = classNameOrAttrs.class.split(' ')
      .map(item => `md0-${item}`).join(' ')
  }
  const temp = []
  for (const name in classNameOrAttrs) {
    temp.push(`${name}="${classNameOrAttrs[name]}"`)
  }
  if (!temp.length) {
    return `<${tag}>`
  }

  return `<${tag} ${temp.join(' ')}>`
}
