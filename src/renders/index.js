import {getRowType, makeTag} from '../util'

import title from '../renders/title'
import codeblock from '../renders/codeblock'
import list from '../renders/list'
import blockquote from '../renders/blockquote'
import table from '../renders/table'
import newline from '../renders/newline'
import empty from '../renders/empty'
import paragraph from '../renders/paragraph'

function renderRows(rows, refMap, option, catalog) {
  // 最后生成的 html 内容
  const html = []

  // 遍历每一行，分析内容
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    // 获取此行的类型
    let type = getRowType(row, rows[i + 1])

    let buffer

    // 代码的优先级高于其他
    if (type === 'codeblock') {
      [i, buffer] = codeblock.get(rows, i)
      html.push(codeblock.render(buffer, option))
      continue
    }

    if (type === 'ref') {
      const {id, href, title} = /^\[(?<id>.+?)]:\s*(?<href>[\S]+)(\s*(['"])(?<title>.+?)\4)?\s*$/.exec(row).groups
      refMap[`${id}-href`] = href
      refMap[`${id}-title`] = title || ''
      continue
    }

    if (type === 'title') {
      html.push(title.render(row, option, catalog))
      continue
    }

    // list
    if (type === 'list') {
      [i, buffer] = list.get(rows, i, option)
      html.push(list.render(buffer, option))
      continue
    }

    // blockquote
    if (type === 'blockquote') {
      [i, buffer] = blockquote.get(rows, i)
      html.push(blockquote.render(buffer, option))
      continue
    }

    // table
    if (type === 'table-header') {
      [i, buffer] = table.get(rows, i)
      html.push(table.render(buffer, option))
      continue
    }

    if (type === 'newline') {
      [i, buffer] = empty.get(rows, i)
      html.push(newline.render(buffer, option))
      continue
    }

    if (!type) {
      type = 'common'
      html.push(makeTag('div', 'paragraph', option))
    } else {
      // console.log(i, 'render', type)
    }
    [i, buffer] = paragraph.get(rows, i, option)
    html.push(buffer.join(''))
    if (type === 'common') {
      html.push('</div>')
    }
  }
  return html.join('\n')
}

export default {
  renderRows
}
