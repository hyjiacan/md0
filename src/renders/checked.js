import {mergeString} from '../util'

export default {
  render (str) {
    return mergeString('<label class="md0-checkbox md0-checkbox-checked"><input type="checkbox" disabled="disabled" checked="checked" />',
      str.replace(/^\[x\]/, ''), '</label>')
  }
}
