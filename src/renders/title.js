import common from './common'
import {makeTag} from '../util'

export default {
  render(str, option, catalog) {
    // console.log(str)
    str = str.replace(/^\s*/g, '')
    let text = str.replace(/#/g, '')
    const level = str.length - text.length
    const tag = 'h' + level
    text = common.render(text, option)
    // remove tags, white space
    const pureText = text.replace(/(<.+?>|\s+)/g, '').trim()
    catalog.push({
      level: level,
      text: pureText
    })
    const anchor = option.titleAnchor ? `${makeTag('a', {
      href: `#${pureText}`,
      class: 'title-anchor'
    }, option)}</a>` : ''
    const html = `${makeTag(tag, {
      id: pureText,
      class: `title-${tag}`
    }, option)}
${anchor}
${makeTag('span', 'title-text', option)}
${text.replace(/^\s+/, '')}</span></${tag}>`

    return option.render ? option.render('title', html, str) : html
  }
}
