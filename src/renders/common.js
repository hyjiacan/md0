import {mergeString} from '../util'

export default {
  render (str, option) {
    const buffer = {}
    let i = 0
    const tpl = str
      // inline code
      // 代码永远优先
      .replace(/(`)(.+?)\1/g, function (match, group1, group2) {
        const html = mergeString('<span class="md0-code-inline">', group2.replace(/</g, '&lt;').replace(/>/g, '&gt;'), '</span>')
        const placeholder = `@${i++}@`
        buffer[placeholder] = option.render ? option.render('common', html, match) : html
        return placeholder
      })
      // image
      .replace(/!\[(.+?)\]\((.*?)\)/g, function (match, group1, group2) {
        const html = mergeString('<img src="', group2, '" alt="', group1, '" />')
        return option.render ? option.render('common', html, match) : html
      })
      // hyper link
      // 处理未使用 []() 格式的超链接为 []() 格式
      .replace(/^((ftp|https?):\/\/[a-z0-9\-_%/\\?&.!@#$()\[\]|,<>{}:]+)/ig, function (match, group1, group2) {
        return mergeString('[', group1, '](', group1, ')<br/>')
      })
      // hyper link
      // 处理未使用 []() 格式的超链接为 []() 格式
      .replace(/([^[('"])((ftp|https?):\/\/[a-z0-9\-_%/\\?&.!@#$()\[\]|,<>{}:]+)/ig, function (match, group1, group2, group3) {
        return mergeString(group1, '[', group2, '](', group2, ')')
      })
      // hyper link
      .replace(/\[(.*?)\]\((.*?)\)/g, function (match, group1, group2) {
        const html = mergeString('<a href="', group2, '" class="md0-link">', group1, '</a>')
        return option.render ? option.render('common', html, match) : html
      })
      // bold
      .replace(/([_*]{2})(.+?)\1/g, function (match, group1, group2) {
        const html = mergeString('<b>', group2, '</b>')
        return option.render ? option.render('common', html, match) : html
      })
      // italic
      .replace(/([_*])(.+?)\1/g, function (match, group1, group2) {
        const html = mergeString('<i>', group2, '</i>')
        return option.render ? option.render('common', html, match) : html
      })
      // Strikethrough
      .replace(/([-~]{2})(.+?)\1/g, function (match, group1, group2) {
        const html = mergeString('<span class="md0-strikethrough">', group2, '</span>')
        return option.render ? option.render('common', html, match) : html
      })

    return tpl.replace(/@\d+@/g, function (match) {
      return buffer[match]
    })
  }

}
