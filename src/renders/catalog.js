export default {
  fillDots: function (n) {
    const temp = []
    for (let i = 1; i < n; i++) {
      temp.push('··')
    }
    return `<span class="md0-catalog-dots">${temp.join('')}</span>`
  }
}
