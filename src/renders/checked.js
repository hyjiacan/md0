import {mergeString} from '../util'

export default {
  render (str, option) {
    const html = mergeString('<label class="md0-checkbox md0-checkbox-checked"><input type="checkbox" disabled="disabled" checked="checked" />',
      str.replace(/^\[x\]/, ''), '</label>')
    return option.render ? option.render('checked', html, str) : html
  }
}
