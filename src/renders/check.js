import {mergeString} from '../util'

export default {
  render (str) {
    return mergeString('<label class="md0-checkbox"><input type="checkbox" disabled="disabled" />',
      str.replace(/^\[ \]/, ''), '</label>')
  }
}
