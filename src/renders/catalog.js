import {makeTag} from '../util'

export default {
  fillDots: function (n, option) {
    const temp = []
    for (let i = 1; i < n; i++) {
      temp.push('··')
    }
    return `${makeTag('span', 'catalog-dots', option)}${temp.join('')}</span>`
  }
}
