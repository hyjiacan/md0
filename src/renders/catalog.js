import {mergeString} from '../util'

export default {
  fillDots: function (n) {
    const temp = []
    for (let i = 1; i < n; i++) {
      temp.push('··')
    }
    return mergeString('<span class="md0-catalog-dots">', temp.join(''), '</span>')
  }
}
