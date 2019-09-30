var css = editors.css.getValue()
var markdown = editors.markdown.getValue()

var html = md0(markdown, {
    catalog: true,
    codeHeight: 0,
    codeIndex: true,
    titleAnchor: true,
    useHljs: false
})

var win = $('iframe')[0].contentWindow
var doc = win.document
doc.head.innerHTML = '<meta charset="UTF-8"/><style>' + css + '</style>'
doc.body.innerHTML = html
