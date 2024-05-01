globalThis.importScripts('./idb')

addEventListener('message', (e) => {
    globalThis.postMessage('You said: ' + e.data);
});


const allBooks: Array<any> = []
setTimeout(async () => {
    allBooks.push(...await readAll())
    console.log(allBooks);
}, 1000)

function count(s: string, c: string) {
    return (s.match(new RegExp(c, 'g')) || []).length;
}

function mm() {
    const p = document.querySelectorAll('p')
    let a = []
    p.forEach(ele => a.push(ele.clientHeight))
    a.reduce((pre, cur) => cur += pre)

    for (let i = 0; i < 10000; i++) {
        if (a[i] !== b[i])
            console.log(i, a[i], b[i], a[i] > b[i])
    }
}
function validate(ctx: OffscreenCanvasRenderingContext2D, text: string, hope: number) {

}




interface Config {
    maxWidth: number,
    lineHeight: number,
    fontSize: number,
    fontFamily: string
}

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
const mmll: Array<any> = []
function measureHeight(ctx: OffscreenCanvasRenderingContext2D, text: string, config: Config) {

    const { maxWidth, lineHeight, fontSize, fontFamily } = config
    ctx.font = `${fontSize}px ${fontFamily}`;
    // const closeWidth = fontSize * 2 //close to linebreak point
    const length = text.length
    const step = Math.floor(maxWidth / fontSize)

    // start of curline
    let p = 0
    // start of nextline
    let q = 0

    let lineCount = 0
    let log = []
    // debugger

    while (q <= length) {
        q += step
        const mt = ctx.measureText(text.slice(p, q))
        const sub = mt.width - maxWidth
        // 可能不对?但我暂时想不出来了...
        // Math.abs(sub) > fontSize && (q -= Math.floor(sub / fontSize))
        let initQ = q
        if (sub > 0) {
            // debugger
            // never in ?
            // ok????
            while (q > p) {
                if (ctx.measureText(text.slice(--q, initQ)).width > sub) {
                    lineStartProhibition.indexOf(text[q]) !== -1 && (q -= 1)
                    break
                }
            }
        } else {
            // debugger
            // ok???, part width not equal part + part,pitty...
            while (q <= length) {
                const { width } = ctx.measureText(text.slice(initQ, q + 1))
                const len = text.slice(p, q).match(/[“‘”’]/g)?.length || 0
                if (width - len * fontSize * 0.5 > Math.abs(sub)) {
                    lineStartProhibition.indexOf(text[q]) !== -1 && (q -= 1)
                    break
                }
                q++
            }

        }
        log.push(text.slice(p, q))
        lineCount++
        p = q
    }
    // debugger
    mmll.push(log)
    return lineCount * fontSize * lineHeight
}

addEventListener('message', (evt) => {
    const canvas: OffscreenCanvas = evt.data.canvas;
    canvas.height = 4000
    canvas.width = 430
    const ctx: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return

    const config: Config = {
        fontSize: 16,
        fontFamily: 'inter',
        lineHeight: 1.5,
        maxWidth: 430
    }
    let paras = allBooks[0].paraArr.slice(0, 1000)
    let cnt: Array<number> = []
    let height = config.fontSize
    console.time()
    paras.forEach((para: string, idx) => {
        let cur = measureHeight(ctx, para, config)
        height += cur
        cnt.push(cur)
    });
    console.timeEnd()
    globalThis.postMessage({
        key: 'c',
        val: mmll
    });
    globalThis.postMessage({
        key: 'b',
        val: cnt
    });
    let sum = 0
    cnt.forEach(i => sum += i)
    console.log('malou', cnt.reduce((pre, cur) => cur += pre), sum, cnt)
})
