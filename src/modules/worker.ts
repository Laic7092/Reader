import type { Msg } from "../core/declare";

interface Config {
    maxWidth: number,
    lineHeight: number,
    fontSize: number,
    fontFamily: string,
    textIndent: number
}

// 点号（顿号、逗号、句号、冒号、分号、叹号、问号）、结束引号、结束括号、结束双书名号（书名号乙式）、连接号、间隔号、分隔号不能出现在一行的开头。
const lineStartProhibition = new Set([
    "\u3002", "\uFF0E", "\uFF0C", "\u3001", "\uFF1A", "\uFF1B", "\uFF01", "\u203C", "\uFF1F", "\u2047",
    "\u201C", "\u2018", // ???
    "\u300D", "\u300F", "\u201D", "\u2019",
    "\uFF09", "\u300B", "\u3009",
    "\uFF5E", "\u002D", "\u2013", //"\u2014",
    "\u00B7", "\u30FB", "\u2027",
    "\u002F", "\uFF0F",
    "\u3011", "\u3017", "\u3015", "\uFF3D", "\uFF5D",
    // 省略号-破折号不可分割
    "\u2014", "\u2026", "\u22EF",
    "!", ")", "}", "]", ":", ";", "\"", "\'", ">", ",", ".", "?", "-", "\\", "|", "/", "~"
])

// 开始引号、开始括号、开始单双书名号等符号，不能出现在一行的结尾。这是最推荐的方法。
const lineEndProhibition = new Set([
    // "\u201D", "\u2019", // ???
    "\u300C", "\u300E", "\u201C", "\u2018",
    "\uFF08",
    "\u300A",
    "\u3008",
    "\u3010", "\u3016", "\u3014", "\uFF3B", "\uFF5B",
    "\'", "\"", "(", "<", "{", "["
])

const charWidthMap = new Float32Array(65536)
function measureHeight(text: string, config: Config) {
    const { maxWidth, lineHeight, textIndent, fontSize } = config
    const length = text.length

    let _maxWidth = maxWidth - textIndent * fontSize // 第一行的最大宽度
    let lineCount = 0
    let lineHeadIndex = 0
    let currentWidth = 0

    const bps = []
    bps.push(text[lineHeadIndex])
    for (let i = 0; i < length; i++) {
        // 更新当前行宽度
        currentWidth += (charWidthMap[text.charCodeAt(i)] || 0)
        // 如果当前行超出最大宽度，尝试换行
        if (currentWidth > _maxWidth) {
            // 从当前位置向前查找最近的合法换行点
            let breakPoint = i
            // while (
            //     breakPoint > lineHeadIndex &&
            //     (lineStartProhibition.has(text[breakPoint]) ||
            //         lineEndProhibition.has(text[breakPoint - 1]))
            // ) {
            //     breakPoint--
            // }

            // 如果找到合法换行点，则换行
            if (breakPoint > lineHeadIndex) {
                lineHeadIndex = breakPoint
                i = breakPoint - 1 // 从换行点重新开始
            } else {
                lineHeadIndex = i
                i -= 1 // 从换行点重新开始
            }
            currentWidth = 0
            lineCount++
            _maxWidth = maxWidth
            bps.push(text[lineHeadIndex])
        }
    }

    // 如果最后一行有内容，增加一行
    if (currentWidth > 0) {
        lineCount++
    }
    // console.log(bps);

    return lineCount * fontSize * lineHeight
}

addEventListener('message', (evt) => {
    const { canvas, width, height, lineArr, charSet, chapterIdxSet } = evt.data as Msg;
    canvas.height = height
    canvas.width = width
    const ctx: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return

    const config: Config = {
        fontSize: 20,
        fontFamily: 'PingFang SC, system-ui',
        lineHeight: 1.5,
        maxWidth: width,
        textIndent: 2,
    }

    console.time('charset')
    ctx.font = `${config.fontSize}px ${config.fontFamily}`;
    const charCodeSet = new Set()
    charSet.forEach(char => {
        charCodeSet.add(char.charCodeAt(0))
        charWidthMap[char.charCodeAt(0)] = ctx.measureText(char).width
    })
    console.log(charSet, charCodeSet);
    console.log(charWidthMap);

    console.timeEnd('charset')
    console.time('msHeight')
    let cnt: Array<number> = []
    lineArr.forEach((para: string, idx) => {
        const isChapter = chapterIdxSet.has(idx)
        let cur = isChapter ? measureHeight(para.slice(2), config) * 1.2 : measureHeight(para, config)
        cnt.push(cur)
    });
    console.timeEnd('msHeight')

    globalThis.postMessage({
        key: 'msHeightArr',
        val: cnt
    });
})
