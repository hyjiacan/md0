import common from './common'

export default {
  render (str, option, catalog) {
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
    const anchor = option.titleAnchor ? `<a href="#${pureText}" class="md0-title-anchor"></a>` : ''
    const html = `<${tag} id="${pureText}" class="md0-title-${tag}">${anchor}
    <span class="md0-title-text">${text.replace(/^\s+/, '')}</span></${tag}>`

    return option.render ? option.render('title', html, str) : html
  }
}
