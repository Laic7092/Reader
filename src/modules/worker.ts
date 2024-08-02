// @ts-nocheck
addEventListener('message', (e) => {
    globalThis.postMessage('You said: ' + e.data);
});

const REM_PX = 16

function count(s: string, c: string) {
    return (s.match(new RegExp(c, 'g')) || []).length;
}

interface Config {
    maxWidth: number,
    lineHeight: number,
    fontSize: number,
    fontFamily: string,
    step: number
}

let curBook;

// 点号（顿号、逗号、句号、冒号、分号、叹号、问号）、结束引号、结束括号、结束双书名号（书名号乙式）、连接号、间隔号、分隔号不能出现在一行的开头。
// 开始引号、开始括号、开始单双书名号等符号，不能出现在一行的结尾。这是最推荐的方法。
const lineStartProhibition = [
    "、", "，", "。", "：", "；", "！", "？",
    "」", "』", "”", "’",
    "）", "》",
    "～", "-", "–", "—",
    "·", "・", "‧",
    "/", "／"
]

const lineEndProhibition = [
    "“", "‘",
    "（", "〈", "《"
]
const msContentArr: Array<any> = []
function measureWidthByCharMap(text: string, charWidthMap: Map<string, number>) {
    if (text === '') return 0
    return Array.from(text).map(char => charWidthMap.get(char)).reduce((pre, cur) => pre + cur)
}
function measureHeight(ctx: OffscreenCanvasRenderingContext2D, text: string, config: Config) {

    const { maxWidth, lineHeight, fontSize, fontFamily, step, textIndent } = config
    ctx.font = `${fontSize}px ${fontFamily}`;
    const length = text.length

    let _maxWidth = maxWidth - textIndent * fontSize
    const charWidthMap = curBook.charWidthMap

    // start of curline
    let p = 0
    // start of nextline
    let q = 0

    let lineCount = 0
    let log = []

    while (q <= length) {
        q += step
        let a = ''

        const _width = measureWidthByCharMap(text.slice(p, q), charWidthMap)
        const sub = _width - _maxWidth
        const initQ = q
        if (sub > 0) {
            while (q > p) {
                if (measureWidthByCharMap(text.slice(--q, initQ), charWidthMap) > sub) {
                    // while (lineStartProhibition.indexOf(text[q]) !== -1)
                    //     q--
                    break
                }
            }
        } else {
            while (q <= length) {
                if (measureWidthByCharMap(text.slice(initQ, q + 1), charWidthMap) > Math.abs(sub)) {
                    // while (lineStartProhibition.indexOf(text[q]) !== -1)
                    //     q--
                    break
                }
                q++
            }
        }
        log.push({
            content: text.slice(p, q),
            width: measureWidthByCharMap(text.slice(p, q), charWidthMap),
        })
        lineCount === 0 && (_maxWidth = maxWidth)
        lineCount++
        p = q
    }
    msContentArr.push(log)
    return lineCount * fontSize * lineHeight
}

addEventListener('message', (evt) => {
    const { canvas, width, height, book } = evt.data as { height: number, width: number, canvas: OffscreenCanvas };
    curBook = book
    canvas.height = height
    canvas.width = width
    const ctx: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return

    const config: Config = {
        fontSize: 18,
        fontFamily: 'system-ui',
        lineHeight: 1.5,
        maxWidth: width - 4 * REM_PX,
        textIndent: 2,
        step: 26
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
    let cnt: Array<number> = []
    let _height = config.fontSize
    paras.forEach((para: string, idx) => {
        let cur = measureHeight(ctx, para, config)
        _height += cur
        cnt.push(cur)
    });
    console.timeEnd('msHeight')

    globalThis.postMessage({
        key: 'msContentArr',
        val: msContentArr
    });
    globalThis.postMessage({
        key: 'msHeightArr',
        val: cnt
    });
    globalThis.postMessage({
        key: 'heightArr',
        val: cnt
    });
})

function compare() {
    const p = document.querySelectorAll('p')
    const realHeightArr = []
    p.forEach(ele => realHeightArr.push(ele.clientHeight))
    for (let i = 0; i < 1000; i++) {
        if (realHeightArr[i] !== msHeightArr[i]) {
            console.log(i, realHeightArr[i], msHeightArr[i], realHeightArr[i] > msHeightArr[i])
            console.log(p[i], msContentArr[i])
        }
    }
}
