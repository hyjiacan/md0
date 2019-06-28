const fs = require('fs')
const md0 = require('./src/md0')

const args = process.argv.splice(2)

if (!args.length) {
    console.log(`Usage:
    node parser.js <inputFile> [outputFile]

Example:
    node parser.js README.md readme.html
`)
    process.exit(1)
}

const inputFile = args[0]
let outputFile = args[1]

if (!outputFile) {
    outputFile = `${inputFile}.html`
}

console.log(`Read template`)
const template = `<html>
<head>
  <meta charset="utf-8"/>
  <link rel="stylesheet" href="../src/md0.css" />
</head>

<body>
  {content}
</body>

</html>`

console.log(`Read ${inputFile}`)
const content = fs.readFileSync(inputFile, {
    encoding: 'utf8'
})

console.log(`Parse content`)
console.time()

let markdownHtml = md0(content, {
    codeHeight: 400,
    catalog: true
})

let html = template.replace('{content}', markdownHtml)
console.timeEnd()
console.log(`Write ${outputFile}`)
fs.writeFileSync(outputFile, html, {
    encoding: 'utf8'
})
