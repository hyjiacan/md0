#!/usr/bin/env node

const fs = require('fs')
const md0 = require('../dist/md0')

(function () {
  const args = process.argv.splice(2)

  if (!args.length) {
    console.log(['Usage:',
      '    node parser.js <input> [output]',
      '',
      'Example:',
      '    node parser.js README.md readme.html'].join('\n'))
    process.exit(1)
  }

  const input = args[0]
  const output = args[1]

  function parse (option) {
    if (!option.output) {
      option.output = option.input + '.html'
    }

    console.log('Read template')
    const template = fs.readFileSync('./src/template.html', {
      encoding: 'utf-8'
    })

    console.log('Read ' + option.input)
    const content = fs.readFileSync(option.input, {
      encoding: 'utf8'
    })

    console.log('Parse content')
    console.time('parse')

    const markdownHtml = md0(content, {
      codeHeight: 0,
      codeHeader: true,
      catalog: true,
      useHljs: option.useHljs
    })

    const html = template
      .replace('{title}', option.title || input.split(/[\\\/]/).pop())
      .replace('{content}', markdownHtml)
    console.timeEnd('parse')
    console.log('Write ' + option.output)
    fs.writeFileSync(option.output, html, {
      encoding: 'utf8'
    })
  }

  parse({
    title: null,
    input: input,
    output: output,
    useHljs: false
  })
})()
