export function throttled(fn: (arg?: any) => void, delay: number) {
    let timer: any;
    let startTime = Date.now()
    return function () {
        const remain = delay - (Date.now() - startTime)
        clearTimeout(timer)
        if (remain <= 0) {
            // @ts-ignore
            fn.apply(this, arguments)
            startTime = Date.now()
        } else {
            // @ts-ignore
            timer = setTimeout(() => fn.apply(this, arguments), remain)
        }

    }
}

export function debounced(fn: (param?: any) => void, delay: number) {
    let timer: any
    return function () {
        clearTimeout(timer)
        // @ts-ignore
        timer = setTimeout(() => fn.apply(this, arguments), delay)
    }
}

export function arraySumming(arr: Array<number>) {
    return arr.reduce((pre, cur) => pre + cur)
}

export function binarySearch(arr: Array<number>, target: number): number {
    let left = 0, right = arr.length - 1;
    let mid = 0;

    while (left <= right) {
        mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid; // 直接返回匹配的索引
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // 循环结束后，left > right，此时left是最接近target的索引
    return left;
}

export function lockBody() {
    const { style, classList } = document.body
    const scrollBarWidth = window.innerWidth - document.body.clientWidth
    if (scrollBarWidth > 0) {
        classList.add('keep-width')
        style.width = document.body.clientWidth + 'px'
        style.paddingRight = scrollBarWidth + 'px'
    }
    style.setProperty('touch-action', 'none')
    style.setProperty('overflow', 'hidden')
}

export function unLockBody() {
    const { style, classList } = document.body
    if (document.body.classList.contains('keep-width')) {
        classList.remove('keep-width')
        style.paddingRight = ""
        style.width = ""
    }
    style.removeProperty('touch-action')
    style.removeProperty('overflow')
}

export function isInReader() {
    return !!document.querySelector('.reader')
}


// const newlineBytes = {
//     'UTF-8': [[0x0A], [0x0D, 0x0A]], // \n 和 \r\n
//     'gbk': [[0x0A], [0x0D, 0x0A]], // \n 和 \r\n
//     'gb2312': [[0x0A], [0x0D, 0x0A]], // \n 和 \r\n
//     'gb18030': [[0x0A], [0x0D, 0x0A]], // \n 和 \r\n
//     'UTF-16LE': [[0x0A, 0x00], [0x0D, 0x00, 0x0A, 0x00]], // \n 和 \r\n
//     'UTF-16BE': [[0x00, 0x0A], [0x00, 0x0D, 0x00, 0x0A]], // \n 和 \r\n
// };

const DEFAULT_CHARCODE = 'UTF-8'
export async function getCharCode(buffer: ArrayBuffer): Promise<string> {
    console.time('charCode')
    const chardet = await import('chardet')
    return new Promise((resolve, reject) => {
        try {
            const encode = chardet.detect(new Uint8Array(buffer, 0, 1024))
            console.log('charCode:', encode);
            resolve(encode || DEFAULT_CHARCODE)
        } catch (error) {
            console.error(error)
            reject
        } finally {
            console.timeEnd('charCode')
        }
    })
}

export function splitTextFileByLine(_buffer: ArrayBuffer, chunkSize: number, encoding = 'utf-8', logText = false) {
    console.time('chunk')
    const chunks = [];
    const chunkTexts = []
    let offset = 0;
    const byteLength = _buffer.byteLength

    while (offset < byteLength) {
        // 读取当前块
        const buffer = _buffer.slice(offset, offset + chunkSize)
        const uint8Array = new Uint8Array(buffer);

        // 最后的分块
        if (offset + chunkSize >= byteLength) {
            logText && chunkTexts.push(new TextDecoder(encoding).decode(buffer))
            chunks.push(buffer);
            offset += uint8Array.length;
            break;
        }

        // 查找最后一个换行符的位置
        let lastNewlineIndex = -1;
        for (let i = uint8Array.length - 1; i >= 0; i--) {
            if (uint8Array[i] === 0x0A) { // 换行符的字节值
                lastNewlineIndex = i;
                break;
            }
        }

        // 如果找到换行符，将当前块切分
        if (lastNewlineIndex !== -1) {
            const chunkBuffer = buffer.slice(0, lastNewlineIndex + 1);
            logText && chunkTexts.push(new TextDecoder(encoding).decode(chunkBuffer))
            chunks.push(chunkBuffer);
            offset += lastNewlineIndex + 1;
        } else {
            // 如果没有找到换行符，将整个块作为一个分块
            logText && chunkTexts.push(new TextDecoder(encoding).decode(buffer))
            chunks.push(buffer);
            offset += uint8Array.length;
        }
    }
    logText && console.log(chunkTexts);
    console.timeEnd('chunk')
    return chunks;
}

// 计算文件hash
export async function calculateHash(buffer: ArrayBuffer): Promise<string> {
    const xxhash = await import('xxhash-wasm');
    const { h32Raw } = await xxhash.default()
    console.time('hash')
    return new Promise((resolve, reject) => {
        try {
            const hash = h32Raw(new Uint8Array(buffer))
            console.log('hash', hash)
            resolve(String(hash));
        } catch (error) {
            console.error(error)
            reject(new Error('Failed to calculate SHA-1 hash.'));
        } finally {
            console.timeEnd('hash')
        }
    });
}

// export function $on(handler: (e: Event) => void, target: EventTarget = document) {
//     // target.addEventListener()
// }

// export function $off(handler: (e: Event) => void, target: EventTarget = document) {
//     // target.removeEventListener()
// }