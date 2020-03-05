import {getRowType} from '../util'

export default {
  get (rows, index) {
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
}
