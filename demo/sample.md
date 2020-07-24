# md0

> 一个丑陋的 markdown 文档处理器
>
> 功能也不强大
---

- [显示目录](./?catalog#md0)
- [不显示目录](./#md0)
- [内置样式模式](./#md0)
- [清洁模式](./?clean#md0)

GIT仓库

- [gitee][]
- https://github.com/hyjiacan/md0

此页面对应的 markdown 源文件

- https://raw.githubusercontent.com/hyjiacan/md0/master/docs/sample.md
- https://gitee.com/hyjiacan/md0/raw/master/docs/sample.md

> 更多信息见 [README.md](https://gitee.com/hyjiacan/md0#git-readme)

[gitee]: https://gitee.com/hyjiacan/md0 "码云"

## 列表

### 无序列表

- 无序列表
- 无序列表`代码` **粗体** _斜体_
- 无序列表
    - 二级无序列表
    - 二级无序列表`代码` **粗体** _斜体_
    - 二级无序列表
        1. 三级有序列表
        2. 三级有序列表`代码` **粗体** _斜体_
    - 二级无序列表
- 无序列表
- 无序列表
最后一项的内容1
最后一项的内容2
最后一项的内容3

无关的内容
无关的内容
无关的内容

### 有序列表

1. 有序列表
2. 有序列表
3. 有序列表`代码` **粗体** _斜体_
4. 有序列表
    1. 二级有序列表
    2. 二级有序列表`代码` **粗体** _斜体_
        - 三级无序列表
        - 三级无序列表
5. 有序列表

## 引用

> 引用文本
> 引用文本的第二行
> 引用文本的第三行
> 引用文本中的 `代码` **粗体** _斜体_

## 样式

**加粗文字**
__加粗文字__

<b>加粗文字</b>

_斜体文字_

*斜体文字*

<i>斜体文字</i>

**在加粗文字中有_斜体_**

--带删除线的文字--

~~带删除线的文字~~

<u>下划线</u>

\*\*不加粗**

\*不斜体*

`代码`

\`不代码`

---

## 代码

- [使用 highlight.js 高亮代码块](./?useHljs#代码)
- [使用内置代码块](./#代码)

里面包含特殊符号的代码段: `function _get_() // **aaa**`

```html
<div>
    <ul>
        <li>列表1</li>
        <li>列表2</li>
        <li>列表3</li>
    </ul>
</div>
```

```javascript
// 注释内容
let str = 'string let var const boolean' // 注释内容
let i = 12
var b = true
const arr = [{
    a: 1,
    b: 2
}, {
    a: 'foo',
    b: 'bar'
}]

/*
 * 注释内容
 */

(async ()=>{
    await ajax.get('/data?&param1=json')
})
```

```c#
using System;

namespace Foo {
    public class Bar {
        /// <summary>
        /// 注释内容
        /// </summary>
        public static int Main(){
            // 注释
            int a = 10;
            Console.WriteLine(a);
            return a;
        }
    }
}
```


```python
from app import logger

# 类文件
class Bar():
    # 初始化
    def __init__(self):
        pass
    # 主方法
    def main(self, v=None):
        """
        多行注释
        """
        a = 10
        print(a)
        return a
```

下面是一条分隔线

---

\-----------
-----------
\***
***
\- - -
- - -
\* * * *
* * * *

## 列表内样式

- 列表项1 代码
    ```javascript
    let a = 0
    var b = 'function'
    ```
- 列表项2 引用
    > 引用文字
    引用文字
- 列表项3 表格
    |列1|列2|列3|
    |---|---|---|
    |内容1|内容2|内容3|

---

[超链接]()

[超链接](http://a.b.c)

[](http://a.b.c)

<http://a.b.c>

http://a.b.c

[img]: img.gif

![图片][img]

## 选中框

- [ ] 未选中
- [x] 选中

- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

---

## 表格

|表格|此列居中对齐|此列右对齐|
|---|:---:|---:|
|表格|[超链接]()|![][img]|
|_斜体_|*斜体*|表格|
|**粗体**|--粗体--|表格|
|代码: `let a = 'xxx'`|表格|> 引用内容|
|表格|表格|表格|

> 表格内不会渲染 `>` 标记的引用内容

## html

<ul>
    <li style="color:red;/*font-size:20px;*/">列表</li>
    <li>列表</li>
</ul>

## emoji

- :+1::-1::100:
- :woman_office_worker::man_office_worker:
