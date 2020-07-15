import {makeTag} from '../util'

export default {
  render(row, option) {
    const html = makeTag('hr', 'line', option)
    return option.render ? option.render('line', html, row) : html
  }
}
