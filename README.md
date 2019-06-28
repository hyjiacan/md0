# md0

这是一个简陋的 markdown 文档处理器

## 用法

### NodeJS

```javascript
const md0 = require('md0')

let markdown = '# title1\n## title2'
let option = {
    codeIndex: true,
    codeHeight: 0,
    titleAnchor: true,
    catalog: false
}
let html = md0(markdown, option)
console.log(html)
```

### Browser

```html
<script src="/path/to/md0.js"></script>
<link rel="stylesheet" href="/path/to/md0.css"/>

<script>
let markdown = '# title1\n## title2'
let option = {
    codeIndex: true,
    codeHeight: 0,
    titleAnchor: true,
    catalog: false
}
let html = md0(markdown, option)
console.log(html)
</script>
```

### Option

|名字|类型|默认值|描述|
|---|---|---|---|
|codeIndex|Boolean|true|是否在代码块前面显示行号|
|codeHeight|Number|0|代码块的最大高度，为0表示不限制|
|titleAnchor|Boolean|true|是否在标题前显示导航锚点|
|catalog|Boolean|false|是否生成目录|

### 编程

```javascript
const md0 = require('./src/md0')

let content = '# header1'

let html = md0(content)
```

### CLI

```shell
node parser.js README.md readme.html
```
