// @ts-nocheck


const myWorker = new Worker("/src/worker");
myWorker.onmessage = (ev) => {
    console.log(ev.data)
}

const htmlCanvas = document.createElement("canvas");
htmlCanvas.width = 430
htmlCanvas.height = 930
document.body.appendChild(htmlCanvas)
const offscreen = htmlCanvas?.transferControlToOffscreen();

myWorker.postMessage({
    canvas: offscreen
}, [offscreen]);


//在canvas的原型上添加一个方法
OffscreenCanvasRenderingContext2D.prototype.wrapText = function (canvas, text, x, y, maxWidth, lineHeight) {
    // 对入参的类型进行检测
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
        return;
    }
    //如果最大宽度未定义 默认为300px
    if (typeof maxWidth == 'undefined') {
        maxWidth = (canvas && canvas.width) || 300;
    }
    //如果行高未定义 则定义为检测画布文本的行高或html页面的默认行高
    //window.getComptedStyle(Eelement) 传入节点返回节点对象
    // if (typeof lineHeight == 'undefined') {
    // lineHeight = (canvas.canvas && parseInt(self.getComputedStyle(canvas.canvas).lineHeight)) || parseInt(self.getComputedStyle(document.body).lineHeight)
    // }
    var arrText = text.split('');
    var line = '';
    for (var n = 0; n < arrText.length; n++) {
        //每个循环累加字符
        var testLine = line + arrText[n];
        //检测累加字符 获取累加字符的高度和宽度
        var metrics = canvas.measureText(testLine);
        var testWidth = metrics.width;
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
}


addEventListener('message', (e) => {
    self.postMessage('You said: ' + e.data);
}
);

const chars = ['我', '你', '它', '，', '。', 'a', 'z', 'b']

addEventListener('message', (evt) => {
    const canvas: OffscreenCanvas = evt.data.canvas;
    console.log(canvas)
    canvas.height = 932
    canvas.width = 430
    const ctx: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d");
    console.log(ctx)
    if (!ctx) return
    ctx.font = "25px consolas"

    const render = () => {

        ctx.fillStyle = '#fff'

        const text = new Array(10000).fill('').map(i => chars[Math.floor(Math.random() * 8)]).join()
        // ctx?.fillText(text, 16, 16, 398)
        const text1 = `hasdhasdhahdasjdhsjahddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddhasdhasdhahdasjdhsjahdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd哈哈哈电话撒旦哈卡打开手到拈来卡哈哈哈电话撒旦哈卡打开手到拈来卡哈哈哈电话撒旦哈卡打开手到拈来卡哈哈哈电话撒旦哈卡打开手到拈来卡`
        const text11 = 'hasdhasdhahdasjdh,./?:"{}_+()*&^%$#@!sja，。、；‘[]’‘/、,.hddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddhasdhasdhahdasjdhsjahdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd哈哈哈电话撒旦哈卡打开手到拈来卡哈哈哈电话撒旦哈卡打开手到拈来卡哈哈哈电话撒旦哈卡打开手到拈来卡哈哈哈电话撒旦哈卡打开手到拈来卡'

        ctx.wrapText(ctx, text11, 0, 25, 430, 25 * 1.5)
        console.log(ctx)
        // requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
})