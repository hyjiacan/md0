(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory()
    } else {
        global.md0 = factory()
    }
// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function () {
    var KEYWORDS = {
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
    var escapeMap = {}

    var headers = []

    function mergeString() {
        return [].slice.apply(arguments).join('')
    }

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
        return rows.filter(function (row) {
            return !/^\s*$/.test(row)
        })
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
            return row.replace(/(\/\/|#|--).*/, function (match) {
                return mergeString('<span class="md0-code-block-comment">', match, '/span>')
            })
        }
        // 行内注释
        var temp = /^(.*?)(\/\/|#|--)(.*)$/.exec(row)
        var tag = ''
        var comment = ''
        if (temp) {
            [, row, tag, comment] = temp
        }
        var buffer = {}
        var i = 0
        var keywords = getKeywords(lang)
        var tpl = row
        // string
            .replace(/(['"])(.+?)\1/g, function (match, group1, group2) {
                var key = mergeString('@', i++, '@')
                buffer[key] = mergeString('<span class="md0-code-block-text">', group1, group2, group1, '</span>')
                return key
            })
            // numeric
            .replace(/(&nbsp;)(\d+)([^'"])?/g, function (match, group1, group2, group3) {
                var key = mergeString('@', i++, '@')
                buffer[key] = mergeString(group1 || '', '<span class="md0-code-block-number">', group2, '</span>', group3 || '')
                return key
            })
            // keyword
            .replace(new RegExp(mergeString('(^|[^a-zA-Z0-9_$])(', keywords.join('|'), ')([^a-zA-Z0-9_$])', 'g')),
                function (match, group1, group2, group3) {
                    var key = mergeString('@', i++, '@')
                    buffer[key] = mergeString(group1, '<span class="md0-code-block-keyword">', group2, '</span>', group3)
                    return key
                })
            // inline comment
            .replace(/(\/\/|#).+$/, function (match) {
                var key = mergeString('@', i++, '@')
                buffer[key] = mergeString('<span class="md0-code-block-comment">', match, '</span>')
                return key
            })
        return tpl.replace(/@\d+@/g, function (match) {
            return buffer[match]
        }) + (tag ? mergeString('<span class="md0-code-block-comment">', tag, comment, '</span>') : '')
    }

    var renders = {
        common: function (str) {
            var buffer = {}
            var tpl = str
            // image
                .replace(/!\[(.+?)\]\((.*?)\)/g, function (match, group1, group2) {
                    return mergeString('<img src="', group2, '" alt="', group1, '" />')
                })
                // hyper link
                .replace(/\[(.*?)\]\((.*?)\)/g, function (match, group1, group2) {
                    return mergeString('<a href="', group2, '" class="md0-link">', group1, '"</a>')
                })
                // bold
                .replace(/([_*]{2})(.+?)\1/g, function (match, group1, group2) {
                    return mergeString('<b>', group2, '</b>')
                })
                // italic
                .replace(/([_*])(.+?)\1/g, function (match, group1, group2) {
                    return mergeString('<i>', group2, '</i>')
                })
                // inline code
                .replace(/(`)(.+?)\1/g, function (match, group1, group2) {
                    return mergeString('<span class="md0-code-inline">', group2, '</span>')
                })
                // Strikethrough
                .replace(/([-~]{2})(.+?)\1/g, function (match, group1, group2) {
                    return mergeString('<span class="md0-strikethrough">', group2, '</span>')
                })

            return tpl.replace(/@\d+@/g, function (match) {
                return buffer[match]
            })
        },
        title: function (str, option) {
            // console.log(str)
            str = str.replace(/^\s*/g, '')
            var text = str.replace(/#/g, '')
            var level = str.length - text.length
            var tag = 'h' + level
            text = renders.common(text)
            // remove tags, white space
            var pureText = text.replace(/(<.+?>|\s+)/g, '').trim()
            headers.push({
                level: level,
                text: pureText
            })
            var anchor = option.titleAnchor ? mergeString('<a href="#', pureText, '" class="md0-title-anchor">#</a>') : ''
            return mergeString('<', tag, ' id="', pureText, '" class="md0-title-', tag, '">', anchor,
                '<span class="md0-title-text">', text.replace(/^\s+/, ''), '</span></', tag, '>')
        },
        codeBlock: function (rows, option) {
            // remove empty rows
            // rows = removeEmptyRows(rows)
            // remove the 1st row and get the language
            // if not specified, set 'text' as default
            var defineLine = rows.shift()
            while (!defineLine) {
                defineLine = rows.shift()
            }
            var temp = /^(\s*)```(.+?)\s*$/.exec(defineLine)
            var indent = temp[1]
            var lang = temp[2] || 'text'
            // remove the last row
            rows.pop()

            var html = [mergeString('<div class="md0-code-block" data-lang="', lang, '">')]

            html.push(mergeString('<div class="md0-code-block-header"><span class="md0-code-block-lang">', lang, '</span></div>'))
            var style = ''
            if (option.codeHeight) {
                style = mergeString('overflow: auto; max-height: ', option.codeHeight)
            }
            html.push(mergeString('<div class="md0-code-block-body" style="', style, '">'))
            // 行号
            if (option.codeIndex) {
                html.push('<div class="md0-code-block-gutter">')
                rows.forEach(function (str, i) {
                    html.push(mergeString('<span class="md0-code-block-rowindex">', i + 1, '</span>'))
                })
                html.push('</div>')
            }
            html.push('<div class="md0-code-block-content">')
            var blockCommentFounded = false
            rows.forEach(function (str) {
                var temp = str
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
                        temp = mergeString('<span class="md0-code-block-comment">', temp, '</span>')
                    } else {
                        // highlight
                        temp = codeHighlight(temp, lang)
                    }
                } else if (str.indexOf('*/') !== -1 || str.indexOf('"""') !== -1) {
                    // 找到结束处
                    blockCommentFounded = false
                    temp = mergeString('<span class="md0-code-block-comment">', temp, '</span>')
                } else {
                    // 注释中内容
                    temp = mergeString('<span class="md0-code-block-comment">', temp, '</span>')
                }
                html.push(mergeString('<div class="md0-code-block-line">', temp, '</div>'))
            })
            html.push('</div>')
            html.push('</div>')
            html.push('</div>')
            return html.join('\n')
        },
        table: function (rows) {
            // remove empty rows
            rows = removeEmptyRows(rows)
            var html = ['<table class="md0-table">']
            var header = rows.shift().split('|')
            var align = rows.shift().split('|').map(function (col) {
                if (/^\s*:-+:\s*$/.test(col)) {
                    return 'md-0-table-align-center'
                }

                if (/^\s*-+:\s*$/.test(col)) {
                    return 'md-0-table-align-right'
                }
                return 'md-0-table-align-left'
            })
            html.push('<thead><tr>')
            var i
            for (i = 1; i < header.length - 1; i++) {
                html.push(mergeString('<th class="md0-table-cell ', align[i], '">', renders.common(header[i]), '</th>'))
            }
            html.push('</tr></thead>')
            html.push('<tbody>')
            for (i = 0; i < rows.length; i++) {
                var row = rows[i].split('|')
                html.push('<tr>')
                for (var j = 1; j < header.length - 1; j++) {
                    html.push(mergeString('<td class="md0-table-cell ', align[j], '">', renders.common(row[j]), '</td>'))
                }
                html.push('</tr>')
            }
            html.push('</tbody>')
            html.push('</table>')
            return html.join('\n')
        },
        list: function (rows) {
            // remove empty rows
            rows = removeEmptyRows(rows)

            var firstItem = rows[0]
            var indent = 0
            var types = []
            var reg = /^\s*[*-]\s/
            var type = reg.test(firstItem) ? 'ul' : 'ol'
            types.push(type)

            var html = [mergeString('<', type, ' class="md0-list">')]

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i]
                var subType = reg.test(row) ? 'ul' : 'ol'
                var itemIndent = row.length - row.replace(/^\s*/, '').length
                if (itemIndent > indent) {
                    // sub
                    types.unshift(subType)
                    html.push(mergeString('<', subType, ' class="md0-list">'))
                } else if (itemIndent < indent) {
                    html.push(mergeString('</', types.shift(), '>'))
                }
                indent = itemIndent
                row = row.replace(/^\s*(\*|-|[0-9]+\.?)\s/, '')
                // 是否是选择列表
                var t = getRowType(row)
                if (t === 'check') {
                    row = row.replace(/^\[ \]/, '')
                    row = renders.check(renders.common(row))
                } else if (t === 'checked') {
                    row = row.replace(/^\[x\]/, '')
                    row = renders.checked(renders.common(row))
                } else {
                    row = renders.common(row)
                }
                html.push(mergeString('<li class="md0-list-item">', row, '</li>'))
            }

            html.push(mergeString('</', types[0], '>'))
            return html.join('\n')
        },
        quote: function (rows) {
            rows = rows.map(function (str) {
                return renders.common(str.replace(/^\s*>/, ''))
            })
            return mergeString('<blockquote class="md0-quote">', rows.join(''), '</blockquote>')
        },
        newline: function (rows) {
            return rows.length > 1 ? '<br/>' : ''
        },
        line: function () {
            return '<hr class="md0-line" />'
        },
        check: function (str) {
            return mergeString('<label class="md0-checkbox"><input type="checkbox" disabled="disabled" />',
                str.replace(/^\[ \]/, ''), '</label>')
        },
        checked: function (str) {
            return mergeString('<label class="md0-checkbox md0-checkbox-checked"><input type="checkbox" disabled="disabled" checked="checked" />',
                str.replace(/^\[x\]/, ''), '</label>')
        }
    }

    function getCodeBlock(rows, index) {
        var temp = [rows[index++]]
        for (; index < rows.length; index++) {
            var row = rows[index]
            temp.push(row)
            if (getRowType(row) === 'codeBlock') {
                break
            }
        }
        return [index, temp]
    }

    function getListBlock(rows, index, option) {
        var temp = [rows[index++]]
        var emptyLineCount = 0
        var buffer, _
        // 遇到两个空行或隔一行后不是列表时，列表结束
        for (; index < rows.length; index++) {
            var row = rows[index]
            var rowType = getRowType(row)
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
                _ = temp.pop();
                [index, buffer] = getCodeBlock(rows, index)
                temp.push(_ + renders.codeBlock(buffer, option))
            } else if (rowType === 'quote') {
                _ = temp.pop();
                [index, buffer] = getQuoteBlock(rows, index)
                temp.push(_ + renders.quote(buffer))
            } else if (rowType === 'table') {
                _ = temp.pop();
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
        var temp = [rows[index++]]
        var indent = -1
        for (; index < rows.length; index++) {
            var row = rows[index]
            var rowIndent = row.length - row.replace(/^\s*/, '').length
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
        var temp = [rows[index++]]
        for (; index < rows.length; index++) {
            var row = rows[index]
            if (getRowType(row) !== 'table') {
                break
            }
            temp.push(row)
        }
        return [--index, temp]
    }

    function getParagraphBlock(rows, index, option) {
        var temp = []
        for (; index < rows.length; index++) {
            var row = rows[index]
            var type = getRowType(row)
            if (['codeBlock', 'list', 'table', 'newline', 'title', 'quote'].indexOf(type) !== -1) {
                break
            }
            temp.push(renders[type || 'common'](row, option))
        }
        return [--index, temp]
    }


    function getEmptyBlock(rows, index) {
        var temp = [rows[index++]]
        for (; index < rows.length; index++) {
            var row = rows[index]
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
        var temp = markdownContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        var rows = temp
        // 处理转义
            .replace(/\\(.)/g, function (match, ch) {
                var code = ch.charCodeAt(0)
                escapeMap[code] = ch
                return mergeString('$ESCAPE', code, 'EPACSE$')
            })
            .split('\n')
        var html = ['<div class="md0-container">']
        option = option || {}
        if (!option.hasOwnProperty('titleAnchor')) {
            option.titleAnchor = true
        }
        if (!option.hasOwnProperty('codeIndex')) {
            option.codeIndex = true
        }
        if (!option.hasOwnProperty('codeHeight')) {
            option.codeHeight = 0
        }
        if (!option.hasOwnProperty('catalog')) {
            option.catalog = false
        }

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i]

            var type = getRowType(row)
            var buffer

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
            var catalog = headers.map(function (h) {
                return mergeString('<li><a href="#', h.text, '">', fillCatalogItem(h.level), '# ', h.text, '</a></li>')
            })
            catalog.unshift('<ul class="md0-catalog">')
            catalog.push('</ul>')
            html.unshift(catalog.join('\n'))
        }
        return html.join('\n').replace(/\$ESCAPE([0-9]+)EPACSE\$/g, function (match, code) {
            return String.fromCharCode(code)
        })
    }

    function fillCatalogItem(n) {
        var temp = []
        for (var i = 1; i < n; i++) {
            temp.push('··')
        }
        return mergeString('<span class="md0-catalog-dots">', temp.join(''), '</span>')
    }

    return render
})
