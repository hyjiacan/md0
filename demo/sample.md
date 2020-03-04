# md0

## 标题

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级<span style="color: red;">红色</span>标题

---

- [显示目录](./?catalog#md0)
- [不显示目录](./#md0)

此页面对应的 markdown 源文件

- https://raw.githubusercontent.com/hyjiacan/md0/master/docs/sample.md
- https://gitee.com/hyjiacan/md0/raw/master/docs/sample.md

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

\`不代码`

---

## 代码

- [使用 highlight.js 高亮代码块](./?useHljs#代码)
- [使用内置代码块](./#代码)

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
    await ajax.get('/data.json')
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

![图片](img.gif)

## 选中框

[ ] 未选中
[x] 选中

- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

---

## 表格

|表格|此列居中对齐|此列右对齐|
|---|:---:|---:|
|表格|[超链接]()|![不要以为这里的图片没有加载成功，其实没有写图片路径]()|
|_斜体_|*斜体*|表格|
|**粗体**|--粗体--|表格|
|代码: `let a = 'xxx'`|表格|表格|
|表格|表格|表格|

## 引用

```markdown
&&&theTable
引用的内容部分
这里面可以写表格
|col1|col2|col3|
|---|---|---|
|-|-|-|
&&&


&&&theList
- item1
- item2
  1. item3
  2. item4
&&&
```

&&&theTable
引用的内容部分
这里面可以写表格
|col1|col2|col3|
|---|---|---|
|-|-|-|
&&&

&&&theList
- item1
- item2
  1. item3
  2. item4
&&&

&&&theCode
```javascript
$.get('/path/to/url', {
  id: 0,
  keyword: 'md0',
}, function(response) {
  //
}
```
&&&

|col1|col2|col3|
|---|---|---|
|&theTable&|&theList&|&theCode&|
