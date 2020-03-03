import {mergeString} from '../util'

export default {
  render (str) {
    const buffer = {}
    const tpl = str
      // image
      .replace(/!\[(.+?)\]\((.*?)\)/g, function (match, group1, group2) {
        return mergeString('<img src="', group2, '" alt="', group1, '" />')
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
        return mergeString('<a href="', group2, '" class="md0-link">', group1, '</a>')
      })
      // bold
      .replace(/([_*]{2})(.+?)\1/g, function (match, group1, group2) {
        return mergeString('<b>', group2, '</b>')
      })
      // italic
      .replace(/([_*])(.+?)\1/g, function (match, group1, group2) {
        return mergeString('<i>', group2, '</i>')
      })
      // inline code
      .replace(/(`)(.+?)\1/g, function (match, group1, group2) {
        return mergeString('<span class="md0-code-inline">', group2.replace(/</g, '&lt;').replace(/>/g, '&gt;'), '</span>')
      })
      // Strikethrough
      .replace(/([-~]{2})(.+?)\1/g, function (match, group1, group2) {
        return mergeString('<span class="md0-strikethrough">', group2, '</span>')
      })

    return tpl.replace(/@\d+@/g, function (match) {
      return buffer[match]
    })
  }

}
