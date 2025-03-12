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
      .measure-p {
        position: absolute;
        visibility: hidden;
        text-indent: 2em;
        width: ${deviceSize.width}px;
        font-size: ${styleConfig.fontSize}px;
        line-height: ${styleConfig.lineHeight};
        margin: 0;
        padding: 0;
      }
        .chapter {
            font-size: 1.5em;
            text-indent: 0;
        }
    `;
    document.head.appendChild(style);
};

// 创建用于测量的<p>元素
const createMeasureElement = (): HTMLElement => {
    const p = document.createElement('p');
    p.className = 'measure-p';
    document.body.appendChild(p);
    return p;
};

// 计算所有<p>元素的高度
const calculateHeights = (
    lineArray: string[],
    chapterIdxSet: Set<number>,
    onComplete: (heights: number[]) => void
): void => {
    const heights: number[] = [];
    let index = 0;
    const measureElement = createMeasureElement(); // 复用 <p> 元素
    // const cache = new Map<string, number>(); // 缓存计算结果

    // 模拟 requestIdleCallback 的降级方案
    const processChunk = () => {
        const startTime = performance.now();
        const chunkDuration = 50; // 每次处理的时间限制（毫秒）

        while (index < lineArray.length) {
            const now = performance.now();
            if (now - startTime > chunkDuration) {
                // 如果超出时间限制，继续处理下一批
                setTimeout(processChunk, 0);
                return;
            }

            const text = lineArray[index];

            // 如果结果已缓存，直接使用缓存
            // if (cache.has(text)) {
            //     heights.push(cache.get(text)!);
            // } else {
            // 测量高度并缓存结果
            chapterIdxSet.has(index)
                ? measureElement.classList.add('chapter')
                : measureElement.classList.remove('chapter');
            measureElement.textContent = text;
            const height = measureElement.offsetHeight;
            heights.push(height);
            // cache.set(text, height);
            // }

            index++;
        }

        // 如果所有行都处理完成，清理 DOM 并返回结果
        if (index >= lineArray.length) {
            document.body.removeChild(measureElement); // 移除 <p> 元素
            onComplete(heights);
        } else {
            // 如果还有未处理的行，继续处理下一批
            setTimeout(processChunk, 0);
        }
    };

    // 开始处理第一个块
    processChunk();
};

// 导出模块
export const createHeightCalculator = (options: HeightCalculatorOptions): Promise<number[]> => {
    console.time()
    const { lineArray, styleConfig, deviceSize, chapterIdxSet } = options;

    return new Promise((resolve) => {
        // 初始化样式
        initStyles(deviceSize, styleConfig);

        // 开始计算高度
        calculateHeights(lineArray, chapterIdxSet, (heights) => {
            console.timeEnd()
            resolve(heights);
        },);
    });
};
