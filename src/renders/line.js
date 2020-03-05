export default {
  render (row, option) {
    const html = '<hr class="md0-line" />'
    return option.render ? option.render('line', html, row) : html
  }
}
