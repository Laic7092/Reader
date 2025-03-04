import { Book, Chapter } from "./indexDb";

addEventListener('message', (e) => {
    globalThis.postMessage('You said: ' + e.data);
});

const REM_PX = 16

interface Config {
    maxWidth: number,
    lineHeight: number,
    fontSize: number,
    fontFamily: string,
    textIndent: number
}

let curBook: any;

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

const msContentArr: Array<any> = []
function getPrefixSumByCharMap(text: string, charWidthMap: Map<string, number>) {
    let sum: number[] = []
    Array.from(text).forEach((char, idx) => {
        sum.push((sum[idx - 1] || 0) + (charWidthMap.get(char) || 0))
    })
    return sum
}

let ml = 0
let lm = 0
function measureHeight(text: string, config: Config) {

    const { maxWidth, lineHeight, textIndent, fontSize } = config
    const length = text.length

    let _maxWidth = config.maxWidth - textIndent * fontSize
    const charWidthMap = curBook.charWidthMap
    const prefixSum = getPrefixSumByCharMap(text, charWidthMap)

    let lineCount = 0

    let i = 0
    // 下行行首
    let lineHeadIndex = 0
    while (i < length) {
        if (prefixSum[i] - (prefixSum[lineHeadIndex - 1] || 0) < _maxWidth) {
            i++
        } else {
            while (lineStartProhibition.has(text[i]) || lineEndProhibition.has(text[i - 1])) i--
            lineCount === 0 && (_maxWidth = maxWidth)
            lineCount++
            lineHeadIndex = i
        }
    }
    i === length && lineCount++
    return lineCount * fontSize * lineHeight
}

addEventListener('message', (evt) => {
    const { canvas, width, height, book } = evt.data as { height: number, width: number, canvas: OffscreenCanvas, book: Book };
    curBook = book
    canvas.height = height
    canvas.width = width
    const ctx: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return

    const config: Config = {
        fontSize: 20,
        fontFamily: 'system-ui',
        lineHeight: 1.5,
        maxWidth: width - 4 * REM_PX,
        textIndent: 2,
    }

    console.time('charset')
    ctx.font = `${config.fontSize}px ${config.fontFamily}`;
    const charSet = curBook.charSet as Set<string>
    const charWidthMap = new Map()
    charSet.forEach(char => charWidthMap.set(char, ctx.measureText(char).width))
    console.log(charWidthMap)
    curBook.charWidthMap = charWidthMap
    console.timeEnd('charset')
    console.time('msHeight')
    let paras = curBook.paraArr
    let chapterIdxSet = new Set()
    curBook.chapterArr.forEach((chapter: Chapter) => chapterIdxSet.add(chapter.idx))
    let cnt: Array<number> = []
    let _height = config.fontSize
    paras.forEach((para: string) => {
        let cur = measureHeight(para, config)
        _height += cur
        cnt.push(cur)
    });
    console.log(lm, ml);

    console.timeEnd('msHeight')

    globalThis.postMessage({
        key: 'msContentArr',
        val: msContentArr
    });
    globalThis.postMessage({
        key: 'msHeightArr',
        val: cnt
    });
})
