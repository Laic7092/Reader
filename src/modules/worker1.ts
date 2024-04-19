globalThis.importScripts('./idb')


let allBooks: Array<any> = []
setTimeout(async () => {
    allBooks.push(...await readAll())
    console.log(allBooks);

}, 1000)

function wrapText(canvas: OffscreenCanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const arrText = text.split('');
    let line = '';
    // console.log('6', canvas.measureText("“没关系，你们放心吧，我一定会成为高级魔法师的”"))
    for (let n = 0; n < arrText.length; n++) {
        //每个循环累加字符
        let testLine = line + arrText[n];
        //检测累加字符 获取累加字符的高度和宽度
        let metrics = canvas.measureText(testLine);
        //用这两个，会面对line-break判断问题，sum偏低
        const { actualBoundingBoxRight, actualBoundingBoxLeft } = metrics
        // let testWidth = actualBoundingBoxLeft + actualBoundingBoxRight;
        // 用这个，面对的是一个误差问题，sum偏高
        let testWidth = metrics.width;
        //如果累加字符的宽度大于定义的绘制文本最大宽度 则绘制累加字符的文本 并且设置换行间距再次进行绘制
        if (testWidth > maxWidth && n > 0) {
            canvas.fillText(line, x, y);
            line = arrText[n];
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    canvas.fillText(line, x, y);
    return y + lineHeight
}


addEventListener('message', (e) => {
    globalThis.postMessage('You said: ' + e.data);
});


addEventListener('message', (evt) => {
    const canvas: OffscreenCanvas = evt.data.canvas;
    console.log(canvas)
    canvas.height = 932
    canvas.width = 430
    const ctx: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d");
    console.log(ctx)
    if (!ctx) return
    ctx.font = "16px inter"

    const render = () => {

        ctx.fillStyle = '#fff'
        console.log(ctx.measureText("“我很乖啊，对了，妈妈我今天选择我要修的主、次魔法了。”"))
        console.log(ctx.measureText("“我很乖啊，对了，妈妈我今天选择我要修的主、次魔法了。"))
        console.log(ctx.measureText("“我很乖啊，对了，妈妈我今天选择我要修的主、次魔法了"))
        console.log(ctx.measureText("为了让我的幻兽成长我竟然破天荒的兴起了好好学习的心态。"))
        console.log(ctx.measureText("为了让我的幻兽成长我竟然破天荒的兴起了好好学习的心态"))

        const malou = allBooks[0].paraArr.slice(0, 1000)
        let cnt: Array<number> = []
        malou.forEach((element: string) => {
            cnt.push(wrapText(ctx, element, 0, 0, 430, 16 * 1.5))
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

    for (let i = 0; i < 1000; i++) {
        if (a[i] !== b[i])
            console.log(i, a[i], b[i])
    }
}
