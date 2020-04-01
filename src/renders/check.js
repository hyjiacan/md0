export default {
  render (str, option) {
    const html = `<label class="md0-checkbox"><input type="checkbox" disabled="disabled" />${str.replace(/^\[ ]/, '')}</label>`
    return option.render ? option.render('check', html, str) : html
  }
}
