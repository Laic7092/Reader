globalThis.importScripts('./idb')


let allBooks: Array<any> = []
setTimeout(async () => {
    allBooks.push(...await readAll())
    console.log(allBooks);

}, 1000)

function count(s: string, c: string) {
    return (s.match(new RegExp(c, 'g')) || []).length;
}

function wrapText(canvas: OffscreenCanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const inity = y
    const arrText = text.split('');
    let line = '';
    // console.log('6', canvas.measureText("“没关系，你们放心吧，我一定会成为高级魔法师的”"))
    for (let n = 0; n < arrText.length; n++) {
        //每个循环累加字符
        let testLine = line + arrText[n];
        //检测累加字符 获取累加字符的高度和宽度
        let metrics = canvas.measureText(testLine);
        //用这两个，会面对line-break判断问题，sum偏低
        // const { actualBoundingBoxRight, actualBoundingBoxLeft } = metrics
        // let testWidth = actualBoundingBoxLeft + actualBoundingBoxRight;
        // 用这个，面对的是一个误差问题，sum偏高
        let testWidth = metrics.width;

        // 1,canvas里的引号,和实际渲染差异
        // 现有的那个,line-break,是需要的,用anywhere算出来,数值对上了?
        if (testWidth > maxWidth) {
            // debugger
            testWidth -= count(testLine, "”") * 9
            testWidth -= count(testLine, "“") * 9
        }

        // && 
        //如果累加字符的宽度大于定义的绘制文本最大宽度 则绘制累加字符的文本 并且设置换行间距再次进行绘制
        if (testWidth > maxWidth && n > 0) {
            // debugger
            if ("“”。".includes(testLine[testLine.length - 1]) && testWidth - maxWidth < 9) {
                console.log(metrics, testLine)
                line = testLine;
            } else {
                canvas.fillText(line, x, y);
                line = arrText[n];
                y += lineHeight;
            }
        } else {
            line = testLine;
        }
    }
    canvas.fillText(line, x, y);
    return y - inity + lineHeight
}


addEventListener('message', (e) => {
    globalThis.postMessage('You said: ' + e.data);
});


addEventListener('message', (evt) => {
    return
    const canvas: OffscreenCanvas = evt.data.canvas;
    // console.log(canvas)
    canvas.height = 4000
    canvas.width = 450
    const ctx: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d");
    // console.log(ctx)
    if (!ctx) return
    ctx.font = "16px inter"

    const render = () => {

        ctx.fillStyle = '#fff'
        // console.log(ctx.measureText("“我很乖啊，对了，妈妈我今天选择我要修的主、次魔法了。”"))
        // console.log(ctx.measureText("“我很乖啊，对了，妈妈我今天选择我要修的主、次魔法了。"))
        // console.log(ctx.measureText("“我很乖啊，对了，妈妈我今天选择我要修的主、次魔法了"))
        // console.log(ctx.measureText("为了让我的幻兽成长我竟然破天荒的兴起了好好学习的心态。"))
        // console.log(ctx.measureText("为了让我的幻兽成长我竟然破天荒的兴起了好好学习的心态"))
        // console.log(ctx.measureText("“老师，就这么服下它么？”萧炎眨了眨眼，有些迫不及待。"))
        // console.log(ctx.measureText("“呵呵…”面对着少女毫不掩饰的坦率话语，少年尴尬的笑了一"))
        // console.log(ctx.measureText("“呵呵…”面对着少女毫不掩饰的坦率话语，少年尴尬的笑了"))
        // console.log(ctx.measureText("声，可却未再说什么，人不风流枉少年，可现在的他，实在"))
        // console.log(ctx.measureText("没这资格与心情，落寞的回转过身，对着广场之外缓缓行去…"))
        // console.log(ctx.measureText("“"), "左引号")
        // console.log(ctx.measureText("”"), "右引号")
        // console.log(ctx.measureText("我说“"),"右引号")
        // console.log(ctx.measureText("我说”"),"右引号")
        // console.log(ctx.measureText("我说:“你妈妈还好吗”"))
        // console.log(ctx.measureText("出场，附近的议论声便是小了许多，一双双略微火热的目光，"))
        // console.log(ctx.measureText("“萧炎，斗之力，三段！级别：低级！”测验魔石碑之旁，一位"))
        // console.log(ctx.measureText("“耶！”听着测验员所喊出的成绩，少女脸颊扬起了得意的"))
        console.log(ctx.measureText("“一星斗者，d级，二星斗者。c级，以此类推，最高级别，则是s级别的五星斗者，当然，这里的年龄界限，是二十以下。”"))
        console.log(ctx.measureText("“一星斗者，d级，二星斗者。c级，以此类推，最高级别，则"))
        console.log(ctx.measureText("是s级别的五星斗者，当然，这里的年龄界限，是二十以下。"))

        let malou = allBooks[0].paraArr.slice(0, 10000)
        malou = [
            "“那也得等你有那个福气，说不定你儿子哪天就被人剪断了命根子…”心头诅咒了一声，奥巴帕也是开口喊道：“两万三千！”",
            "“一星斗者，d级，二星斗者。c级，以此类推，最高级别，则是s级别的五星斗者，当然，这里的年龄界限，是二十以下。”",
            "“呵呵，不用请了，萧族长近来可好?老头我可是不请自来了。”萧战的声音刚刚落下，苍老的笑声，便是从门外朗笑传来。"
        ]
        let cnt: Array<number> = []
        let height = 16
        malou.forEach((element: string) => {
            let cur = wrapText(ctx, element, 0, height, 430, 16 * 1.5)
            height += cur
            cnt.push(cur)
        });
        let sum = 0
        cnt.forEach(i => sum += i)
        console.log(cnt.reduce((pre, cur) => cur += pre), sum, cnt)
        // requestAnimationFrame(render);
    }
    render()
    // requestAnimationFrame(render);
})

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

function measureHeight2(ctx: OffscreenCanvasRenderingContext2D, text: string, config: Config) {
    const { maxWidth, lineHeight, fontSize, fontFamily } = config
    ctx.font = `${fontSize}px ${fontFamily}`;
    const { measureText } = ctx
    const closeWidth = fontSize * 2 //close to linebreak point

    const { width: measureWidth } = measureText(text.slice(p, q))
}

// from chatgpt
function measureHeight3(ctx: OffscreenCanvasRenderingContext2D, text: string, config: Config) {
    const { maxWidth, lineHeight, fontSize, fontFamily } = config;
    ctx.font = `${fontSize}px ${fontFamily}`;
    const length = text.length;
    let p = 0;
    let lineCount = 0;

    while (p < length) {
        let q = p + Math.ceil(maxWidth / fontSize);
        while (ctx.measureText(text.slice(p, q)).width > maxWidth && q > p) {
            q--;
        }
        lineCount++;
        p = q;
    }

    return lineCount * fontSize * lineHeight;
}

// from chatgpt
function measureHeight4(ctx: OffscreenCanvasRenderingContext2D, text: string, config: Config) {
    const { maxWidth, lineHeight, fontSize, fontFamily } = config;
    ctx.font = `${fontSize}px ${fontFamily}`;
    const length = text.length;
    let p = 0;
    let lineCount = 0;

    while (p < length) {
        let low = p;
        let high = length;
        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (ctx.measureText(text.slice(p, mid)).width <= maxWidth) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        p = low - 1;
        lineCount++;
    }

    return lineCount * fontSize * lineHeight;
}

// from: gpt-4
function measureHeightOptimized(ctx: OffscreenCanvasRenderingContext2D, text: string, config: Config) {
    const { maxWidth, lineHeight, fontSize, fontFamily } = config;
    ctx.font = `${fontSize}px ${fontFamily}`;
    let lineCount = 0;
    let p = 0;
    let q = 0;
    const length = text.length;
    while (p < length) {
        let min = 1;
        let max = length - p;
        while (min <= max) {
            const mid = Math.ceil((min + max) / 2);
            const subText = text.slice(p, p + mid);
            const { width: measureWidth } = ctx.measureText(subText);
            if (measureWidth > maxWidth) {
                max = mid - 1;
            } else if (measureWidth < maxWidth) {
                min = mid + 1;
            } else {
                q = p + mid;
                break;
            }
        }
        q = p + max;
        lineCount++;
        p = q;
    }
    return lineCount * lineHeight * fontSize;
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
