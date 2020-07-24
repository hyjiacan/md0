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

### CLI

安装到全局

```shell
# npm
npm install md0 -g
# yarn
yarn global add md0
```

安装后，就能够使用全局的命令 `md0`

```shell script
md0 <input> [--options]
```

- input 要转换的markdown文件/目录
- options
    - output 输出目录，默认为 output
    - title 指定输出文件的 title，不指定时使用文件名
    - code-header 是否渲染代码块头，默认为 true
    - code-index 是否渲染代码行号，默认为 true
    - code-height 设置代码块最大高度，单位为像素，设置为 0 时表示自动调整。默认为 0
    - title-anchor 是否渲染标题的锚点，默认为 true
    - catalog 是否根据标题渲染目录，默认为 false
    - use-hljs 是否使用 highlight.js 高亮代码块，默认为 false
    - base64 是否将本地图片作为 base64 数据格式嵌入，默认为 false

注意：当 **input** 是目录时，会处理其下的所有匹配文件 

### 示例

处理单个文件

```shell
md0 /path/to/awesome.md
```

此时输出文件为 *output/awesome.html* 

处理目录下所有文件

```shell
md0 /path/to --output dist
```

此时会处理目录 */path/to* 下的所有文件，并将输出写入目录 *dist* 。

输出目录是相对于执行 `md0` 命令的目录。

## Option

|名字|类型|默认值|描述|
|---|---|---|---|
|codeHeader|Boolean|true|是否在代码块上面显示语言|
|codeIndex|Boolean|true|是否在代码块前面显示行号|
|codeHeight|Number|0|代码块的最大高度，单位为`px`，为0表示不限制|
|titleAnchor|Boolean|true|是否在标题前显示导航锚点|
|clean|Boolean|false|是否渲染为清洁模式，清洁模式时会保留浏览器的默认样式|
|catalog|Boolean|false|是否生成目录|
|useHljs|Boolean|false|是否使用`highlight.js`高亮代码|
|render|function(type, html, data)|-|自定义内容渲染器|
|emojis|Object|-|指定 `emoji` 的标识与图片映射关系的对象，目前 CLI 是从 https://api.github.com/emojis 获取 *since 1.2.0*|
|emojiSize|String|18px|指定 `emoji` 的大小 *since 1.2.0*|

注意：指定了 `catalog` 参数 **或** markdown 文件中包含 `[toc]` 标记时，均会生成目录。
不同之处在于，如果指定了 `[toc]` 那么目录会放置在 `[toc]` 处，否则会放置在文档最前方。
另外，仅会处理第一个 `[toc]` 标记。 *Since 1.2.0*

`emoji` 列表来自 https://api.github.com/emojis，其图片为在线url

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

### 功能

#### 转义

符号 `\` 对块级元素有转义作用，即出现此符号后，后续相关符号都按原样输出

#### 加粗/斜体

如果 `_`, `*` 符号被 ` `(空白字符) 包围，那么按原样渲染 

#### 代码

行内代码可以 ``var a = '`' `` 的写法来包含 `` ` `` 符号

代码块可以直接通过使用 4 个 space 或 1 个 tab (相对前面一项) 声明。
当遇到小于此缩进时(不论是出现空行)，代码块结束

代码块除了使用 ` 符号，还可以使用 ~ 符号

#### 标题

还可以通过这样的方式生成标题

h1
```
title1
===
```
h2
```
title2
---
```

文字下的划线数量不限（大于1即有效），这种情况下，划线上方的文字可以有多行（不能包含空行）

```
tit
le
1 and 
title2
---
```

划线前最多可以有3个空格 (这种写法的优先级甚至高于 html):

```
<a title="a lot
---
of dashes"/>
```

会被解析为标题，而不是 html

在写作 `## xxxx ###` 时，前导 `#` 符号如果多于6个，则按原样输出多余的符号
(按 commonmark 标准，多于6个时，就不认为是标题了)；
后续的 `#` 符号删除 (有转义时不删除)

#### 引用块 blockquote

其中可以包含以下类型：
headers, lists, and code blocks

#### 引用

引用是为链接和图片服务的。每个引用项需要单独占用一行。其在文档中的位置不限。
格式如下：
```
[id]: http://www.abc.com "title" 
```

title 必须包含引用（单引号或双引号均可）。但如果引号不匹配，那么就不解析为引用

#### 链接和图片

可以指定 title:

```
[link](http://www.abc.com "title")
![alt](http://www.abc.com "title")
```

使用引用:

```
[link][id]
![alt][id]
# 下面是简写
[id][]
```

还可以这么简写: `<http://example.com/>`

#### 列表

无序列表，可以使用 `*`, `-`, `+` 这几种符号

对有序列表，可以考虑在后期添加选项以支持保留荐的原编号。

如果列表项被空行包围，那么此项的内容将被 `<p>` 元素包围。

列表项下的代码块（如果使用缩进），那么需要正常的两倍。

#### html块

在原始的html代码块中，如果html在同一行，那其内的文本内容，需要被当作 markdown 解析。

块级 html ，始终不渲染 markdown 语法。

### `@` 和 `#` 功能支持

`@` 表示提醒一个用户，需要通过选项提供接口来渲染
`#` 表示引用一个地址，需要通过选项提供接口来渲染

### 优化

- [ ]  添加输出对 bootstrap 样式的支持 (考虑将样式名称剥离到 json 文件，以通过配置的方式直接支持)
- [ ] 输出时不附加样式(代码块不添加额外样式)，以及对代码块的html标签简化
- [ ] CLI 支持处理时同时复制引用的资源（图片等）到输出目录
- [ ] CLI 添加 `watch` 选项以支持实时渲染
- [ ] webpack-loader. see [markdown-loader](https://www.npmjs.com/package/markdown-loader)

## 更新日志

### 1.2.4

- 修复 错误的换行处理导致的解析错误
- 优化 表格解析

### 1.2.3

- 修复 带缩进的 `quoteblock` 渲染错误的问题

### 1.2.1

- 修复 使用 nodejs 解析时，若启用了 `useHljs` 选项，此时生成的文件无法高亮的问题
- 修复 多余的换行处理导致解析结果错误的问题

### 1.2.0

- 添加 `[toc]` 标记支持
- 优化 emoji 支持
- 添加 cli 对目录的处理

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
