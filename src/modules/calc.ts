type StyleConfig = {
    fontSize: number;
    lineHeight: number;
};

type DeviceSize = {
    width: number;
    height: number;
};

type HeightCalculatorOptions = {
    lineArray: string[];
    styleConfig: StyleConfig;
    deviceSize: DeviceSize;
    chapterIdxSet: Set<number>,
};

// 初始化样式
const initStyles = (deviceSize: DeviceSize, styleConfig: StyleConfig) => {
    const style = document.createElement('style');
    style.textContent = `
        p {
            visibility: hidden;
            text-indent: 2em;
            overflow-wrap: break-word;
            width: ${deviceSize.width}px;
            font-size: ${styleConfig.fontSize}px;
            line-height: ${styleConfig.lineHeight};
            margin: 0;
        }
        .chapter {
            font-size: 1.5em;
            text-indent: 0;
        }
    `;
    document.head.appendChild(style);
    return style
};


// 计算所有<p>元素的高度
const calculateHeights = (
    lineArray: string[],
    chapterIdxSet: Set<number>,
    onComplete: (heights: number[]) => void
): void => {
    const heights: number[] = [];
    let index = 0;
    // 模拟 requestIdleCallback 的降级方案
    const processChunk = () => {
        const startTime = performance.now();
        const chunkDuration = 50; // 每次处理的时间限制（毫秒）

        const fragment = document.createDocumentFragment()
        const div = document.createElement('div')
        div.style.position = 'absolute'
        fragment.appendChild(div)
        const elements = []

        while (index < lineArray.length) {
            const now = performance.now();
            if (now - startTime > chunkDuration) {
                // 如果超出时间限制，继续处理下一批
                setTimeout(processChunk);
                return;
            }

            const text = lineArray[index];
            const p = document.createElement('p')
            elements.push(p)

            chapterIdxSet.has(index) && p.classList.add('chapter')
            p.textContent = text;
            div.appendChild(p)
            index++;
        }

        document.body.appendChild(fragment)
        elements.forEach(p => heights.push(p.clientHeight))
        document.body.removeChild(div)

        // 如果所有行都处理完成，清理 DOM 并返回结果
        if (index >= lineArray.length) {
            onComplete(heights);
        } else {
            // 如果还有未处理的行，继续处理下一批
            setTimeout(processChunk);
        }
    };

    // 开始处理第一个块
    setTimeout(processChunk)
};

// 导出模块
export const createHeightCalculator = (options: HeightCalculatorOptions): Promise<number[]> => {
    console.time()
    const { lineArray, styleConfig, deviceSize, chapterIdxSet } = options;

    return new Promise((resolve) => {
        // 初始化样式
        const style = initStyles(deviceSize, styleConfig);

        // 开始计算高度
        calculateHeights(lineArray, chapterIdxSet, (heights) => {
            document.head.removeChild(style);
            console.timeEnd()
            resolve(heights);
        },);
    });
};
