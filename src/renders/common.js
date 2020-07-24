import {makeTag, toArray} from '../util'

export default {
  render(str, option) {
    const buffer = {}
    let i = 0
    const tpl = str
      // inline code
      // 代码永远优先
      .replace(/^(`{1,2})(?<code>.+?)\1/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const code = groups.code
        const html = `${makeTag('code', 'code-inline', option)}${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`
        const placeholder = `@${i++}@`
        buffer[placeholder] = option.render ? option.render('common', html, match) : html
        return placeholder
      })
      .replace(/(?<prefix>[^\\])(`{1,2})(?<code>.+?)\2/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {prefix, code} = groups
        const html = `${makeTag('code', 'code-inline', option)}${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`
        const placeholder = `@${i++}@`
        buffer[placeholder] = option.render ? option.render('common', html, match) : html
        return `${prefix}${placeholder}`
      })
      // emoji
      .replace(/^:(?<name>.+?):/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const name = groups.name
        const img = option.emojis[name]
        // 无效的 emoji
        if (!img) {
          return match
        }
        // 有效的 emoji
        return `<img src="${img}" alt="${name}" width="${option.emojiSize}" height="${option.emojiSize}" />`
      })
      .replace(/(?<prefix>[^\\]):(?<name>.+?):/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {prefix, name} = groups
        const img = option.emojis[name]
        // 无效的 emoji
        if (!img) {
          return `${prefix}${match[0]}`
        }
        // 有效的 emoji
        return `${prefix}<img src="${img}" alt="${name}" width="${option.emojiSize}" height="${option.emojiSize}" />`
      })
      // hyper link
      // 处理使用引用 [][] 格式的超链接为 []() 格式
      .replace(/^\[(?<text>.*?)]\[(?<id>.*?)]/ig, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        let {text, id} = groups
        id = id || text
        return `[${text}]($REF${id}-hrefFER$ "$REF${id}-titleFER$")<br/>`
      })
      .replace(/(?<prefix>[^\\])\[(?<text>.*?)]\[(?<id>.*?)]/ig, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        let {prefix, text, id} = groups
        id = id || text
        return `${prefix}[${text}]($REF${id}-hrefFER$ "$REF${id}-titleFER$")<br/>`
      })
      // image
      .replace(/^!\[(?<alt>.*?)]\((?<src>[\S]*?)(\s*(['|"])(?<title>.+?)\4)?\)/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {alt, src, title} = groups
        const html = `<img src="${src}" alt="${alt}" title="${title || ''}" />`
        return option.render ? option.render('common', html, match) : html
      })
      .replace(/(?<prefix>[^\\])!\[(?<alt>.*?)]\((?<src>[\S]*?)(\s*(['|"])(?<title>.+?)\5)?\)/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {prefix, alt, src, title} = groups
        const html = `${prefix}<img src="${src}" alt="${alt}" title="${title || ''}" />`
        return option.render ? option.render('common', html, match) : html
      })
      // hyper link
      // 处理使用 <url> 格式的超链接为 []() 格式
      .replace(/<(?<url>(ftp|https?):\/\/[\S]+)>/ig, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {url} = groups
        return `[${url}](${url})<br/>`
      })
      // hyper link
      // 处理未使用 []() 格式的超链接为 []() 格式
      .replace(/^(?<url>(ftp|https?):\/\/[\S]+)/ig, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {url} = groups
        return `[${url}](${url})<br/>`
      })
      .replace(/(?<prefix>[^\\[(])(?<url>(ftp|https?):\/\/[\S]+)/ig, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {prefix, url} = groups
        return `${prefix}[${url}](${url})<br/>`
      })
      // hyper link
      .replace(/\[(?<text>.*?)]\((?<href>.*?)(\s*(['|"])(?<title>.+?)\4)?\)/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {text, href, title} = groups
        const placeholder = `@${i++}@`
        buffer[placeholder] = href
        const html = `${makeTag('a', {
          href: placeholder,
          class: 'link',
          title: title || ''
        }, option)}${text || href}</a>`
        return option.render ? option.render('common', html, match) : html
      })
      // bold
      .replace(/^([_*]{2})(?<text>.+?)\1/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {text} = groups
        const html = `<strong>${text}</strong>`
        return option.render ? option.render('common', html, match) : html
      })
      .replace(/(?<prefix>[^\\])([_*]{2})(?<text>.+?)\2/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {prefix, text} = groups
        const html = `${prefix}<strong>${text}</strong>`
        return option.render ? option.render('common', html, match) : html
      })
      // italic
      .replace(/^([_*])(?<text>.+?)\1/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {text} = groups
        const html = `<em>${text}</em>`
        return option.render ? option.render('common', html, match) : html
      })
      .replace(/(?<prefix>[^\\])([_*])(?<text>.+?)\2/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {prefix, text} = groups
        const html = `${prefix}<em>${text}</em>`
        return option.render ? option.render('common', html, match) : html
      })
      // Strikethrough
      .replace(/^([-~]{2})(?<text>.+?)\1/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {text} = groups
        const html = `${makeTag('del', 'strikethrough', option)}${text}</del>`
        return option.render ? option.render('common', html, match) : html
      })
      .replace(/(?<prefix>[^\\])([-~]{2})(?<text>.+?)\2/g, function () {
        const match = toArray(arguments)
        const groups = match.pop()
        const {prefix, text} = groups
        const html = `${prefix}${makeTag('del', 'strikethrough', option)}${text}</del>`
        return option.render ? option.render('common', html, match) : html
      })

    return tpl.replace(/@\d+@/g, function (match) {
      return buffer[match]
    })
  }
}
