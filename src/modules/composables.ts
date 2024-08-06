import { onMounted, onUnmounted, ref, onActivated, onDeactivated } from 'vue'

export function useViewPortSize(el: HTMLElement | string, handler: (DOMRect: DOMRectReadOnly) => void) {
    // const rect = el.getBoundingClientRect()
    const objResizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        // content-box: width 与 height 只包括内容的宽和高，不包括边框（border），内边距（padding），外边距（margin）。
        _DOMRect.value = entry.contentRect;
        handler(_DOMRect.value)
    });

    const _DOMRect = ref()

    onMounted(() => {
        // element | selector
        const _el = typeof el === 'string' ? document.querySelector(el) : el
        objResizeObserver.observe(_el as Element);
    })
    onUnmounted(() => {
        objResizeObserver.disconnect()
    })

    return _DOMRect
}

export function useLockBody() {
    // control body
    onActivated(() => {
        document.body.style.overflow = 'hidden'
    })
    onDeactivated(() => {
        document.body.style.overflow = ''
    })
}