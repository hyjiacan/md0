# md0

这是一个丑陋的 markdown 文档处理器

## 代码

- Gitee: https://gitee.com/hyjiacan/md0
- Github: https://github.com/hyjiacan/md0

## Usage

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
<script src="https://cdn.jsdelivr.net/npm/md0/dist/md0.js"></script>
```

### cli

```shell script
md0 <input-file> [output-file] [--options]
```

options

- input-file 要转换的markdown文件路径
- output-file 输出文件路径，不指定时，使用相同文件名输出到与输入同一路径
- title 指定输出文件的 title，不指定时使用文件名
- code-header 是否渲染代码块头，默认为 true
- code-index 是否渲染代码行号，默认为 true
- code-height 设置代码块最大高度，单位为像素，设置为 0 时表示自动调整。默认为 0
- title-anchor 是否渲染标题的锚点，默认为 true
- catalog 是否根据标题渲染目录，默认为 false
- use-hljs 是否使用 highlight.js 高亮代码块，默认为 false
- base64 是否将本地图片作为 base64 数据格式嵌入，默认为 false

## Option

|名字|类型|默认值|描述|
|---|---|---|---|
|codeHeader|Boolean|true|是否在代码块上面显示语言|
|codeIndex|Boolean|true|是否在代码块前面显示行号|
|codeHeight|Number|0|代码块的最大高度，单位为`px`，为0表示不限制|
|titleAnchor|Boolean|true|是否在标题前显示导航锚点|
|catalog|Boolean|false|是否生成目录|
|useHljs|Boolean|false|是否使用`highlight.js`高亮代码|
|render|function(type, html, data)|-|自定义内容渲染器|

注意：指定了 `catalog` 参数 **或** markdown 文件中包含 `[toc]` 标记时，均会生成目录。
不同之处在于，如果指定了 `[toc]` 那么目录会放置在 `[toc]` 处，否则会放置在文档最前方。
另外，仅会处理第一个 `[toc]` 标记。 *Since 1.2.0*

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

- emoji 支持

## 更新日志

### 1.2.0

- 添加 `[toc]` 标记支持

### 1.1.3

- 修复 代码中包含 `&` 符号被识别为转义符的问题
- 修复 目录样式问题
- 修复 代码内html被解析的问题
- 修复 html 解析异常
- 修复 行内代码被异常解析的问题
- 修复 列表项后新起一行的文本被渲染为列表项的问题

### 1.1.0

- 选项添加 `render` 支持，可以自定义对一些内容的渲染
- CLI 模式下，支持将本地图片以 base64 数据格式嵌入

### 1.0.0

- 完成代码模块化
- 添加 CLI 支持
