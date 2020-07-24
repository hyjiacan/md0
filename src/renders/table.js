import {getRowType, makeTag, removeEmptyRows} from '../util'
import common from './common'

export default {
  get(rows, index) {
    const temp = [rows[index++]]
    for (; index < rows.length; index++) {
      const row = rows[index]
      if (getRowType(row, rows[index + 1]) !== 'table-row') {
        break
      }
      temp.push(row)
    }
    return [--index, temp]
  },
  render(rows, option) {
    // remove empty rows
    rows = removeEmptyRows(rows)
    const html = [makeTag('table', 'table', option)]
    const header = rows.shift().split('|')
    const align = rows.shift().split('|').map((col) => {
      if (/^\s*:-+:\s*$/.test(col)) {
        return 'center'
      }

      if (/^\s*-+:\s*$/.test(col)) {
        return 'right'
      }
      return 'left'
    })
    html.push('<thead><tr>')
    let i
    for (i = 1; i < header.length - 1; i++) {
      html.push(`${makeTag('th', {
        class: 'table-cell',
        style: `text-align: ${align[i]}`
      }, option)}${common.render(header[i], option)}</th>`)
    }
    html.push('</tr></thead>')
    html.push('<tbody>')
    for (i = 0; i < rows.length; i++) {
      const row = rows[i].split('|')
      html.push('<tr>')
      for (let j = 1; j < header.length - 1; j++) {
        html.push(`${makeTag('td', {
          class: 'table-cell',
          style: `text-align: ${align[j]}`
        }, option)}${common.render(row[j], option)}</td>`)
      }
      html.push('</tr>')
    }
    html.push('</tbody>')
    html.push('</table>')

    return option.render ? option.render('table', html.join('\n'), rows) : html.join('\n')
  }
}
