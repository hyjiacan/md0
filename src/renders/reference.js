import {getRowType} from '../util'

export default {
  get (rows, index) {
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
}
