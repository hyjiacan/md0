import {makeTag} from '../util'

export default {
  render(str, option) {
    const html = `${makeTag('label', 'checkbox', option)}<input type="checkbox" disabled="disabled" />${str.replace(/^\[ ]/, '')}</label>`
    return option.render ? option.render('check', html, str) : html
  }
}
