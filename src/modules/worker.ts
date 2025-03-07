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
    "、", "，", "。", "：", "；", "！", "？",
    "」", "』", "”", "’",
    "）", "》",
    "～", "-", "–", "—",
    "·", "・", "‧",
    "/", "／"
])

// 开始引号、开始括号、开始单双书名号等符号，不能出现在一行的结尾。这是最推荐的方法。
const lineEndProhibition = new Set([
    "“", "‘",
    "（", "〈", "《"
])

const charWidthMap = new Float32Array(65536)
function measureHeight(text: string, config: Config) {
    const { maxWidth, lineHeight, textIndent, fontSize } = config
    const length = text.length

    let _maxWidth = maxWidth - textIndent * fontSize // 第一行的最大宽度
    let lineCount = 0
    let lineHeadIndex = 0
    let currentWidth = 0

    for (let i = 0; i < length; i++) {
        // 更新当前行宽度
        currentWidth += (charWidthMap[text.charCodeAt(i)] || 0)

        // 如果当前行超出最大宽度，尝试换行
        if (currentWidth > _maxWidth) {
            // 从当前位置向前查找最近的合法换行点
            let breakPoint = i
            while (
                breakPoint > lineHeadIndex &&
                (lineStartProhibition.has(text[breakPoint]) ||
                    lineEndProhibition.has(text[breakPoint - 1]))
            ) {
                breakPoint--
            }

            // 如果找到合法换行点，则换行
            if (breakPoint > lineHeadIndex) {
                lineCount++
                lineHeadIndex = breakPoint
                currentWidth = 0
                _maxWidth = maxWidth // 从第二行开始使用完整的 maxWidth
                i = breakPoint - 1 // 从换行点重新开始
            }
        }
    }

    // 如果最后一行有内容，增加一行
    if (currentWidth > 0) {
        lineCount++
    }

    return lineCount * fontSize * lineHeight
}

addEventListener('message', (evt) => {
    const { canvas, width, height, lineArr, charSet } = evt.data as Msg;
    canvas.height = height
    canvas.width = width
    const ctx: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return

    const config: Config = {
        fontSize: 20,
        fontFamily: 'system-ui',
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
    lineArr.forEach((para: string) => {
        let cur = measureHeight(para, config)
        cnt.push(cur)
    });
    console.timeEnd('msHeight')

    globalThis.postMessage({
        key: 'msHeightArr',
        val: cnt
    });
})
