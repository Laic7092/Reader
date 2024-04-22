globalThis.importScripts('./idb')


let allBooks: Array<any> = []
setTimeout(async () => {
    allBooks.push(...await readAll())
    console.log(allBooks);

}, 1000)

function count(s: string, c: string) {
    return (s.match(new RegExp(c, 'g')) || []).length;
}



addEventListener('message', (e) => {
    globalThis.postMessage('You said: ' + e.data);
});

function mm() {
    const pp = document.querySelectorAll('p')
    let a = []
    pp.forEach(ele => a.push(ele.clientHeight))
    a.reduce((pre, cur) => cur += pre)

    for (let i = 0; i < 10000; i++) {
        if (a[i] !== b[i])
            console.log(i, a[i], b[i], a[i] > b[i])
    }
}

interface Config {
    maxWidth: number,
    lineHeight: number,
    fontSize: number
}

function measureHeight(canvas: OffscreenCanvasRenderingContext2D, text: string, config: Config) {
    const { measureText } = canvas
    const { maxWidth, lineHeight, fontSize } = config
    const closeWidth = fontSize * 2 //close to linebreak point
    const length = text.length
    let resLength = length
    let res = 0

    // single line
    if (measureText(text).width < maxWidth) {
        return lineHeight * fontSize
    }

    while (resLength > 0) {
        let left = length - resLength, right = resLength - 1
        // finf break
        while (left < right) {
            const mid = (right - left) / 2 + left
            const { width: measureWidth } = measureText(text.slice(left, mid))

            const sub = measureWidth - maxWidth
            if (Math.abs(sub) > closeWidth) {
                if (sub > 0) right = mid
                else left = mid
            } else {
                // close to break point
                let offset = 1
                if (sub > 0) {
                    for (; mid - offset > left && measureWidth - measureText(text.slice(left, mid - offset)).width <= 0; offset++);
                } else {
                    for (; mid + offset < right && measureWidth - measureText(text.slice(left, mid + offset)).width <= 0; offset++);
                }

                // next 
                res += lineHeight * fontSize
                resLength -= mid + sub > 0 ? -offset : offset - left
            }
        }
    }

    return res
}


interface Config {
    maxWidth: number,
    lineHeight: number,
    fontSize: number,
    fontFamily: string
}


const mmll = []
function measureHeight1(ctx: OffscreenCanvasRenderingContext2D, text: string, config: Config) {

    const { maxWidth, lineHeight, fontSize, fontFamily } = config
    ctx.font = `${fontSize}px ${fontFamily}`;
    // const closeWidth = fontSize * 2 //close to linebreak point
    const length = text.length
    const step = Math.ceil(maxWidth / fontSize)

    let p = 0
    let q = 0

    let lineCount = 0
    // debugger
    let log = []

    while (q < length) {
        q += step
        const { width: measureWidth } = ctx.measureText(text.slice(p, q))
        const sub = measureWidth - maxWidth
        q -= Math.floor(sub / fontSize)

        if (sub > 0) {
            let initQ = q
            while (q > p) {
                const { actualBoundingBoxLeft, actualBoundingBoxRight, width } = ctx.measureText(text.slice(--q, initQ))
                if (width > sub) {
                    break
                }
            }
            lineCount++
        } else {
            let initQ = q
            while (q < length) {
                const { actualBoundingBoxLeft, actualBoundingBoxRight, width } = ctx.measureText(text.slice(initQ, ++q))
                if (width > Math.abs(sub)) {
                    break
                }
            }
            lineCount++
        }
        log.push(text.slice(p, q))
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
    paras.forEach((para: string) => {
        let cur = measureHeight1(ctx, para, config)
        // let cur = measureHeightOptimized(ctx, para, config)
        height += cur
        cnt.push(cur)
    });
    console.timeEnd()
    console.log('malou', mmll)
    let sum = 0
    cnt.forEach(i => sum += i)
    console.log('malou', cnt.reduce((pre, cur) => cur += pre), sum, cnt)
})
