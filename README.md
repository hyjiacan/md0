# md0

这是一个丑陋的 markdown 文档处理器

> 最近很忙，没时间整理代码，代码凌乱，各位将就一下吧，忙过这段了再整理

## 代码

- Gitee: https://gitee.com/hyjiacan/md0
- Github: https://github.com/hyjiacan/md0

## Usage

[Try it online](https://hyjiacan.github.io/md0/sample.html)

### NodeJS

```bash
npm install md0
```

```javascript
var md0 = require('md0')

var markdown = '# title1\n## title2'
var option = {
    codeIndex: true,
    codeHeight: 0,
    titleAnchor: true,
    catalog: false
}
var html = md0(markdown, option)
console.log(html)
```

> 详细用法见项目根目录文件 *./parser.js*

### Browser

```html
<script src="/path/to/md0.js"></script>
<link rel="stylesheet" href="/path/to/md0.css"/>

<script>
var markdown = '# title1\n## title2'
var option = {
    codeIndex: true,
    codeHeight: 0,
    titleAnchor: true,
    catalog: false
}
var html = md0(markdown, option)
console.log(html)
</script>
```

也可以使用 cdn:

```html
<script src="https://cdn.jsdelivr.com/npm/md0/dist/md0.js"></script>
```

### cli

```shell script
md0 <input-file> [output-file] [--title] [--code-header[=true]][--code-index[=true]] [--code-height[=0]] [--title-anchor[=true]] [--catalog[=false]] [--use-hljs[=false]]
```

- input-file 要转换的markdown文件路径
- output-file 输出文件路径，不指定时，使用相同文件名输出到与输入同一路径
- title 指定输出文件的 title，不指定时使用文件名
- code-header 是否渲染代码块头，默认为 true
- code-index 是否渲染代码行号，默认为 true
- code-height 设置代码块最大高度，单位为像素，设置为 0 时表示自动调整。默认为 0
- title-anchor 是否渲染标题的锚点，默认为 true
- catalog 是否根据标题渲染目录，默认为 false
- use-hljs 是否使用 highlight.js 高亮代码块，默认为 false

## Option

|名字|类型|默认值|描述|
|---|---|---|---|
|codeHeader|Boolean|true|是否在代码块上面显示语言|
|codeIndex|Boolean|true|是否在代码块前面显示行号|
|codeHeight|Number|0|代码块的最大高度，单位为`px`，为0表示不限制|
|titleAnchor|Boolean|true|是否在标题前显示导航锚点|
|catalog|Boolean|false|是否生成目录|
|useHljs|Boolean|false|是否使用`highlight.js`高亮代码|

## Feature

md0 添加有实用的`引用`功能，用于块或结构化内容的引用

定义引用块`theCode`:

```markdown
&&&theCode
引用的内容部分
这里面可以写表格
|col1|col2|col3|
|---|---|---|
|-|-|-|
&&&
```

> `theCode` 是引用的名称，引用名称仅支持 `[a-zA-Z_\-0-9]`

引用 `theCode` 块:

```markdown
|col1|col2|col3|
|---|---|---|
|&theCode&|-|-|
```
使用 `&theCode&` 来将前面定义的引用块引用到表格内。

## 使用 `highlight.js` 高亮代码

在使用时，需要自行在页面内引入 `highlight.js` 库以及其样式文件:

```html
<script src="/path/to/highlight.min.js"></script>
<link href="/path/to/styles/default.min.css" rel="stylesheet">
```

此时，`md0.css` 需要在 `highlight.js` 的样式后引入，以使其适应主题

代码高亮配置参考: https://github.com/highlightjs/highlight.js

## TODO

- [ ] 支持图片以 base64 格式嵌入
