import {makeTag} from '../util'

export default {
  render(str, option) {
    const buffer = {}
    let i = 0
    const tpl = str
      // inline code
      // 代码永远优先
      .replace(/(`)(.+?)\1/g, function (match, group1, group2) {
        const html = `${makeTag('code', 'code-inline', option)}${group2.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`
        const placeholder = `@${i++}@`
        buffer[placeholder] = option.render ? option.render('common', html, match) : html
        return placeholder
      })
      // emoji
      .replace(/:(.+?):/g, function (match, group1) {
        const img = option.emojis[group1]
        // 无效的 emoji
        if (!img) {
          return match
        }
        // 有效的 emoji
        return `<img src="${img}" alt="${group1}" width="${option.emojiSize}" height="${option.emojiSize}" />`
      })
      // image
      .replace(/!\[(.*?)]\((.*?)\)/g, function (match, group1, group2) {
        const html = `<img src="${group2}" alt="${group1}" />`
        return option.render ? option.render('common', html, match) : html
      })
      // hyper link
      // 处理未使用 []() 格式的超链接为 []() 格式
      .replace(/^((ftp|https?):\/\/[a-z0-9\-_%/\\?&.!@#$()\[\]|,<>{}:]+)/ig, function (match, group1, group2) {
        return `[${group1}](${group1})<br/>`
      })
      // hyper link
      // 处理未使用 []() 格式的超链接为 []() 格式
      .replace(/([^[('"])((ftp|https?):\/\/[a-z0-9\-_%/\\?&.!@#$()\[\]|,<>{}:]+)/ig, function (match, group1, group2, group3) {
        return `${group1}[](${group2})`
      })
      // hyper link
      .replace(/\[(.*?)]\((.*?)\)/g, function (match, group1, group2) {
        const placeholder = `@${i++}@`
        buffer[placeholder] = group2
        const html = `${makeTag('a', {
          href: placeholder,
          class: 'link'
        }, option)}${group1 || group2}</a>`
        return option.render ? option.render('common', html, match) : html
      })
      // bold
      .replace(/([_*]{2})(.+?)\1/g, function (match, group1, group2) {
        const html = `<strong>${group2}</strong>`
        return option.render ? option.render('common', html, match) : html
      })
      // italic
      .replace(/([_*])(.+?)\1/g, function (match, group1, group2) {
        const html = `<em>${group2}</em>`
        return option.render ? option.render('common', html, match) : html
      })
      // Strikethrough
      .replace(/([-~]{2})(.+?)\1/g, function (match, group1, group2) {
        const html = `${makeTag('del', 'strikethrough', option)}${group2}</del>`
        return option.render ? option.render('common', html, match) : html
      })

    return tpl.replace(/@\d+@/g, function (match) {
      return buffer[match]
    })
  }
}
