export function throttled(fn: () => void, delay: number) {
    let timer: any;
    let startTime = Date.now()
    return function () {
        const remain = delay - (Date.now() - startTime)
        clearTimeout(timer)
        if (remain <= 0) {
            fn.apply(this, arguments)
            startTime = Date.now()
        } else {
            timer = setTimeout(() => fn.apply(this, arguments), remain)
        }

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