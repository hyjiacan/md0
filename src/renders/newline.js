export default {
  render (rows, option) {
    const html = rows.length > 1 ? '<br/>' : ''
    return option.render ? option.render('newline', html, rows) : html
  }
}
