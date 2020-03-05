export type Md0Options = {
    /**
     * 是否在代码块上面显示语言
     * 默认为 true
     */
    codeHeader: boolean;
    /**
     * 是否在代码块前面显示行号
     * 默认为 true
     */
    codeIndex: boolean;
    /**
     * 代码块的最大高度，单位为px，为0表示不限制
     * 默认为 0
     */
    codeHeight: number;
    /**
     * 是否在标题前显示导航锚点
     * 默认为 true
     */
    titleAnchor: boolean;
    /**
     * 是否生成目录
     * 默认为 false
     */
    catalog: boolean;
    /**
     * 是否使用highlight.js高亮代码
     * 默认为 false
     */
    useHljs: boolean;

    /**
     * 自定义内容渲染器
     * @param type
     * @param html
     * @param data
     */
    render(type, html, data);
}

export function md0(content: string, options?: Md0Options)
