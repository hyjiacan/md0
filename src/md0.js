/* jshint -W033 */

/* jshint esversion:6 */

(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory()
    } else {
        global.md0 = factory()
    }
// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function () {
    const KEYWORDS = {
        _: [
            'return', 'try', 'catch', 'finally', 'for', 'while'
        ],
        js: [
            'true', 'false', 'null', 'function', 'new', 'return',
            'case', 'switch', 'if', 'else', 'var', 'let', 'const',
            'async', 'await', 'with', 'typeof', 'class', 'from',
            'import', 'throw', 'this', 'in', 'of'
        ],
        python: [
            'True', 'False', 'None', 'if', 'else', 'elif',
            'with', 'as', 'def', 'class', 'from', 'import',
            'raise', 'self', 'in', 'of', 'from', 'keyword'
        ],
        bash: [
            'true', 'false', 'null', 'function', 'new', 'xcopy',
            'case', 'esac', 'if', 'else', 'elif', 'fi', 'cp',
            'mv', 'rm', 'ln', 'link', 'source'
        ],
        java: [
            'true', 'false', 'null', 'new', 'import', 'interface',
            'case', 'switch', 'if', 'else', 'var', 'static', 'const',
            'readonly', 'final', 'class', 'abstract', 'virtual',
            'package', 'implements', 'extends', 'throws', 'String',
            'Boolean', 'float', 'double', 'long', 'int', 'public',
            'Integer', 'private', 'protected', 'synchronized', 'in',
            'of'
        ],
        csharp: [
            'true', 'false', 'null', 'new', 'using', 'namespace',
            'case', 'switch', 'if', 'else', 'var', 'static', 'const',
            'readonly', 'seal', 'class', 'async', 'await', 'struct',
            'package', 'throw', 'override', 'String', 'string', 'get',
            'bool', 'float', 'double', 'long', 'int', 'public', 'set',
            'Integer', 'Boolean', 'private', 'protected', 'internal',
            'out', 'ref', 'in', 'of', 'as', 'partial', 'interface',
            'abstract', 'virtual', 'from', 'select', 'join', 'where'
        ],
        cpp: [
            'true', 'false', 'null', 'TRUE', 'FALSE', 'NULL', 'new',
            'case', 'switch', 'if', 'else', 'const', '#define',
            'try', 'catch', 'finally', 'None', 'string', 'int', 'bool',
            'bool', 'float', 'double', 'long', 'struct', 'operator'
        ]
    }

    function getKeywords(lang) {
        if (['javascript', 'js', 'es6', 'ecmascript'].indexOf(lang) !== -1) {
            lang = 'js'
        } else if (['shell', 'bat', 'bash', 'ecmascript'].indexOf(lang) !== -1) {
            lang = 'bash'
        } else if (['c#', 'csharp'].indexOf(lang) !== -1) {
            lang = 'csharp'
        } else if (['c++', 'c', 'cpp', 'cxx'].indexOf(lang) !== -1) {
            lang = 'cpp'
        }
        return [].concat(KEYWORDS._, KEYWORDS[lang] || [])
    }

    /**
     * 转义表
     * @type {{}}
     */
    let escapeMap = {}

    let headers = []

    /**
     * 获取行的类型
     * @param str
     * @return {string}
     */
    function getRowType(str) {
        str = str.replace(/^\s*/g, '')

        if (/^\s*```/.test(str)) {
            return 'codeBlock'
        }

        if (/^#/.test(str)) {
            return 'title'
        }

        if (/^\|/.test(str)) {
            return 'table'
        }

        if (/^(-|\*|[0-9]+\.?)\s/.test(str)) {
            return 'list'
        }

        if (/^>/.test(str)) {
            return 'quote'
        }

        if (/^---/.test(str)) {
            return 'line'
        }

        if (/^\[ \]/.test(str)) {
            return 'check'
        }

        if (/^\[x\]/.test(str)) {
            return 'checked'
        }

        if (!str) {
            return 'newline'
        }
    }

    /**
     * 合并多个空行为一行
     * @param rows
     * @return {*}
     */
    function removeEmptyRows(rows) {
        return rows.filter(row => !/^\s*$/.test(row))
    }

    /**
     * 高亮代码
     * @param row
     * @param lang
     * @return {string}
     */
    function codeHighlight(row, lang) {
        // 注释行
        if (/^(&nbsp;)*(\/\/|#|--)/.test(row)) {
            // ignore line comment row
            return row.replace(/(\/\/|#|--).*/, match => {
                return `<span class="md0-code-block-comment">${match}</span>`
            })
        }
        // 行内注释
        let temp = /^(.*?)(\/\/|#|--)(.*)$/.exec(row)
        let tag = ''
        let comment = ''
        if (temp) {
            [, row, tag, comment] = temp
        }
        let buffer = {}
        let i = 0
        let keywords = getKeywords(lang)
        let tpl = row
        // string
            .replace(/(['"])(.+?)\1/g, (match, group1, group2) => {
                let key = `@${i++}@`
                buffer[key] = `<span class="md0-code-block-text">${group1}${group2}${group1}</span>`
                return key
            })
            // numeric
            .replace(/(&nbsp;)(\d+)([^'"])?/g, (match, group1, group2, group3) => {
                let key = `@${i++}@`
                buffer[key] = `${group1 || ''}<span class="md0-code-block-number">${group2}</span>${group3 || ''}`
                return key
            })
            // keyword
            .replace(new RegExp(`(^|[^a-zA-Z0-9_$])(${keywords.join('|')})([^a-zA-Z0-9_$])`, 'g'), (match, group1, group2, group3) => {
                let key = `@${i++}@`
                buffer[key] = `${group1}<span class="md0-code-block-keyword">${group2}</span>${group3}`
                return key
            })
            // inline comment
            .replace(/(\/\/|#).+$/, match => {
                let key = `@${i++}@`
                buffer[key] = `<span class="md0-code-block-comment">${match}</span>`
                return key
            })
        return tpl.replace(/@\d+@/g, match => {
            return buffer[match]
        }) + (tag ? `<span class="md0-code-block-comment">${tag}${comment}</span>` : '')
    }

    let renders = {
        common(str) {
            let buffer = {}
            let i = 0
            let tpl = str
            // image
                .replace(/!\[(.+?)\]\((.*?)\)/g, (match, group1, group2) => {
                    // let key = `@${i++}@`
                    // buffer[key] = `<img src="${group2}" alt="${group1}" />`
                    // return key
                    return `<img src="${group2}" alt="${group1}" />`
                })
                // hyper link
                .replace(/\[(.*?)\]\((.*?)\)/g, (match, group1, group2) => {
                    // let key = `@${i++}@`
                    // buffer[key] = `<a href="${group2}" class="md0-link">${group1}</a>`
                    // return key
                    return `<a href="${group2}" class="md0-link">${group1}</a>`
                })
                // bold
                .replace(/([_*]{2})(.+?)\1/g, (match, group1, group2) => {
                    // let key = `@${i++}@`
                    // buffer[key] = `<b>${group2}</b>`
                    // return key
                    return `<b>${group2}</b>`
                })
                // italic
                .replace(/([_*])(.+?)\1/g, (match, group1, group2) => {
                    // let key = `@${i++}@`
                    // buffer[key] = `<i>${group2}</i>`
                    // return key
                    return `<i>${group2}</i>`
                })
                // inline code
                .replace(/(`)(.+?)\1/g, (match, group1, group2) => {
                    // let key = `@${i++}@`
                    // buffer[key] = `<span class="md0-code-inline">${group2}</span>`
                    // return key
                    return `<span class="md0-code-inline">${group2}</span>`
                })
                // Strikethrough
                .replace(/([-~]{2})(.+?)\1/g, (match, group1, group2) => {
                    // let key = `@${i++}@`
                    // buffer[key] = `<span class="md0-strikethrough">${group2}</span>`
                    // return key
                    return `<span class="md0-strikethrough">${group2}</span>`
                })

            return tpl.replace(/@\d+@/g, match => {
                return buffer[match]
            })
        },
        title(str, option) {
            // console.log(str)
            str = str.replace(/^\s*/g, '')
            let text = str.replace(/#/g, '')
            let level = str.length - text.length
            let tag = 'h' + level
            text = renders.common(text)
            // remove tags, white space
            let pureText = text.replace(/(<.+?>|\s+)/g, '').trim()
            headers.push({
                level,
                text: pureText
            })
            let anchor = option.titleAnchor ? `<a href="#${pureText}" class="md0-title-anchor">#</a>` : ''
            return `<${tag} id="${pureText}" class="md0-title-${tag}">
            ${anchor}
            <span class="md0-title-text">${text.trimLeft()}</span>
        </${tag}>`
        },
        codeBlock(rows, option) {
            // remove empty rows
            // rows = removeEmptyRows(rows)
            // remove the 1st row and get the language
            // if not specified, set 'text' as default
            let defineLine = rows.shift()
            while (!defineLine) {
                defineLine = rows.shift()
            }
            let temp = /^(\s*)```(.+?)\s*$/.exec(defineLine)
            let indent = temp[1]
            let lang = temp[2] || 'text'
            // remove the last row
            rows.pop()

            let html = [`<div class="md0-code-block" data-lang="${lang}">`]

            html.push(`<div class="md0-code-block-header"><span class="md0-code-block-lang">${lang}</span></div>`)
            let style = ''
            if (option.codeHeight) {
                style = `overflow: auto; max-height: ${option.codeHeight}`
            }
            html.push(`<div class="md0-code-block-body" style="${style}">`)
            // 行号
            if (option.codeIndex) {
                html.push(`<div class="md0-code-block-gutter">`)
                rows.forEach((str, i) => {
                    html.push(`<span class="md0-code-block-rowindex">${i + 1}</span>`)
                })
                html.push('</div>')
            }
            html.push(`<div class="md0-code-block-content">`)
            let blockCommentFounded = false
            rows.forEach(str => {
                let temp = str
                // 移除多余的缩进
                    .substring(indent.length)
                    .replace(/\t/g, '    ')
                    .replace(/ /g, '&nbsp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                // block comment
                if (!blockCommentFounded) {
                    // 找到开始处
                    if (str.indexOf('/*') !== -1 || str.indexOf('"""') !== -1) {
                        blockCommentFounded = true
                        temp = `<span class="md0-code-block-comment">${temp}</span>`
                    } else {
                        // highlight
                        temp = codeHighlight(temp, lang)
                    }
                } else if (str.indexOf('*/') !== -1 || str.indexOf('"""') !== -1) {
                    // 找到结束处
                    blockCommentFounded = false
                    temp = `<span class="md0-code-block-comment">${temp}</span>`
                } else {
                    // 注释中内容
                    temp = `<span class="md0-code-block-comment">${temp}</span>`
                }
                html.push(`<div class="md0-code-block-line">${temp}</div>`)
            })
            html.push('</div>')
            html.push('</div>')
            html.push('</div>')
            return html.join('\n')
        },
        table(rows) {
            // remove empty rows
            rows = removeEmptyRows(rows)
            let html = ['<table class="md0-table">']
            let header = rows.shift().split('|')
            let align = rows.shift().split('|').map(col => {
                if (/^\s*:-+:\s*$/.test(col)) {
                    return 'md-0-table-align-center'
                }

                if (/^\s*-+:\s*$/.test(col)) {
                    return 'md-0-table-align-right'
                }
                return 'md-0-table-align-left'
            })
            html.push('<thead><tr>')
            for (let i = 1; i < header.length - 1; i++) {
                html.push(`<th class="md0-table-cell ${align[i]}">${renders.common(header[i])}</th>`)
            }
            html.push('</tr></thead>')
            html.push('<tbody>')
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i].split('|')
                html.push('<tr>')
                for (let i = 1; i < header.length - 1; i++) {
                    html.push(`<td class="md0-table-cell ${align[i]}">${renders.common(row[i])}</td>`)
                }
                html.push('</tr>')
            }
            html.push('</tbody>')
            html.push('</table>')
            return html.join('\n')
        },
        list(rows) {
            // remove empty rows
            rows = removeEmptyRows(rows)

            let firstItem = rows[0]
            let indent = 0
            let types = []
            let reg = /^\s*[*-]\s/
            let type = reg.test(firstItem) ? 'ul' : 'ol'
            types.push(type)

            let html = [`<${type} class="md0-list">`]

            for (let i = 0; i < rows.length; i++) {
                let row = rows[i]
                let type = reg.test(row) ? 'ul' : 'ol'
                let itemIndent = row.length - row.replace(/^\s*/, '').length
                if (itemIndent > indent) {
                    // sub
                    types.unshift(type)
                    html.push(`<${type} class="md0-list">`)
                } else if (itemIndent < indent) {
                    html.push(`</${types.shift()}>`)
                }
                indent = itemIndent
                row = row.replace(/^\s*(\*|-|[0-9]+\.?)\s/, '')
                // 是否是选择列表
                let t = getRowType(row)
                if (t === 'check') {
                    row = row.replace(/^\[ \]/, '')
                    row = renders.check(renders.common(row))
                } else if (t === 'checked') {
                    row = row.replace(/^\[x\]/, '')
                    row = renders.checked(renders.common(row))
                } else {
                    row = renders.common(row)
                }
                html.push(`<li class="md0-list-item">${row}</li>`)
            }

            html.push(`</${types[0]}>`)
            return html.join('\n')
        },
        quote(rows) {
            rows = rows.map(str => renders.common(str.replace(/^\s*>/, '')))
            return `<blockquote class="md0-quote">${rows.join('')}</blockquote>`
        },
        newline: (rows) => rows.length > 1 ? '<br/>' : '',
        line: () => '<hr class="md0-line" />',
        check: str => `<label class="md0-checkbox">
    <input type="checkbox" disabled="disabled" />${str.replace(/^\[ \]/, '')}
  </label>`,
        checked: str => `<label class="md0-checkbox md0-checkbox-checked">
    <input type="checkbox" disabled="disabled" checked="checked" />${str.replace(/^\[x\]/, '')}
  </label>`
    }

    function getCodeBlock(rows, index) {
        let temp = [rows[index++]]
        for (; index < rows.length; index++) {
            let row = rows[index]
            temp.push(row)
            if (getRowType(row) === 'codeBlock') {
                break
            }
        }
        return [index, temp]
    }

    function getListBlock(rows, index, option) {
        let temp = [rows[index++]]
        let emptyLineCount = 0
        let buffer
        // 遇到两个空行或隔一行后不是列表时，列表结束
        for (; index < rows.length; index++) {
            let row = rows[index]
            let rowType = getRowType(row)
            if (rowType === 'newline') {
                emptyLineCount++
                if (emptyLineCount === 2) {
                    break
                }
                continue
            }
            if (emptyLineCount === 1 && rowType !== 'list') {
                break
            }
            emptyLineCount = 0
            if (rowType === 'codeBlock') {
                let _ = temp.pop();
                [index, buffer] = getCodeBlock(rows, index)
                temp.push(_ + renders.codeBlock(buffer, option))
            } else if (rowType === 'quote') {
                let _ = temp.pop();
                [index, buffer] = getQuoteBlock(rows, index)
                temp.push(_ + renders.quote(buffer))
            } else if (rowType === 'table') {
                let _ = temp.pop();
                [index, buffer] = getTableBlock(rows, index)
                temp.push(_ + renders.table(buffer))
            } else if (row) {
                temp.push(row)
            }
            buffer = []
        }
        return [--index, temp]
    }

    function getQuoteBlock(rows, index) {
        let temp = [rows[index++]]
        let indent = -1
        for (; index < rows.length; index++) {
            let row = rows[index]
            let rowIndent = row.length - row.replace(/^\s*/, '').length
            if (indent === -1) {
                indent = rowIndent
            }
            if (getRowType(row) === 'newline') {
                break
            }
            if (rowIndent !== indent) {
                break
            }
            temp.push(row)
        }
        return [--index, temp]
    }

    function getTableBlock(rows, index) {
        let temp = [rows[index++]]
        for (; index < rows.length; index++) {
            let row = rows[index]
            if (getRowType(row) !== 'table') {
                break
            }
            temp.push(row)
        }
        return [--index, temp]
    }

    function getParagraphBlock(rows, index, option) {
        let temp = []
        for (; index < rows.length; index++) {
            let row = rows[index]
            let type = getRowType(row)
            if (['codeBlock', 'list', 'table', 'newline', 'title', 'quote'].indexOf(type) !== -1) {
                break
            }
            temp.push(renders[type || 'common'](row, option))
        }
        return [--index, temp]
    }


    function getEmptyBlock(rows, index) {
        let temp = [rows[index++]]
        for (; index < rows.length; index++) {
            let row = rows[index]
            if (getRowType(row) !== 'newline') {
                break
            }
            temp.push(row)
        }
        return [--index, temp]
    }

    /**
     * Convert markdown content into html
     * @param {string} markdownContent Markdown content
     * @param {object} [option]
     */
    function render(markdownContent, option) {
        let temp = markdownContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        let rows = temp
        // 处理转义
            .replace(/\\(.)/g, (match, ch) => {
                let code = ch.charCodeAt(0)
                escapeMap[code] = ch
                return `$ESCAPE${code}EPACSE$`
            })
            .split('\n')
        let html = ['<div class="md0-container">']

        option = {
            titleAnchor: true,
            codeIndex: true,
            ...option
        }

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]

            let type = getRowType(row)
            let buffer

            if (type === 'title') {
                html.push(renders.title(row, option))
                continue
            }

            // code block
            if (type === 'codeBlock') {
                [i, buffer] = getCodeBlock(rows, i)
                html.push(renders.codeBlock(buffer, option))
                continue
            }

            // list
            if (type === 'list') {
                [i, buffer] = getListBlock(rows, i, option)
                html.push(renders.list(buffer))
                continue
            }

            // quote
            if (type === 'quote') {
                [i, buffer] = getQuoteBlock(rows, i)
                html.push(renders.quote(buffer))
                continue
            }

            // table
            if (type === 'table') {
                [i, buffer] = getTableBlock(rows, i)
                html.push(renders.table(buffer))
                continue
            }

            if (type === 'newline') {
                [i, buffer] = getEmptyBlock(rows, i)
                html.push(renders.newline(buffer))
                continue
            }

            if (!type) {
                type = 'common'
                html.push('<div class="md0-paragraph">')
            } else {
                // console.log(i, 'render', type)
            }
            [i, buffer] = getParagraphBlock(rows, i, option)
            html.push(buffer.join(''))
            if (type === 'common') {
                html.push('</div>')
            }
        }
        html.push('</div>')
        if (option.catalog) {
            let catalog = headers.map(h => {
                return `<li><a href="#${h.text}">${fillDot(h.level)}# ${h.text}</a></li>`
            })
            catalog.unshift('<ul class="md0-catalog">')
            catalog.push('</ul>')
            html.unshift(catalog.join('\n'))
        }
        return html.join('\n').replace(/\$ESCAPE([0-9]+)EPACSE\$/g, (match, code) => {
            return String.fromCharCode(code)
        })
    }

    function fillDot(n) {
        let temp = []
        for (let i = 1; i < n; i++) {
            temp.push('··')
        }
        return `<span class="md0-catalog-dots">${temp.join('')}</span>`
    }

    return render
})
