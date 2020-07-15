import {makeTag} from '../util'

export default {
  render (str, option) {
    const html = `${makeTag('label', 'checkbox checkbox-checked', option)}<input type="checkbox" disabled="disabled" checked="checked" />${str.replace(/^\[x]/, '')}</label>`
    return option.render ? option.render('checked', html, str) : html
  }
}
