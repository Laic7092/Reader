import { onMounted, onUnmounted, ref, onActivated, onDeactivated, onUpdated } from 'vue'
import { curChapterIdx } from './store';

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

export function useChapterObserver() {
    const chapterSet: Set<HTMLParagraphElement> = new Set()
    const intersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].intersectionRatio > 0) {
            curChapterIdx.value = Number(entries[0].target.id)
        }
    }, {
        root: document.querySelector('#reader-overlay'),
        threshold: 1.0
    });
    onMounted(() => {
        document.querySelectorAll('p').forEach(pELe => {
            pELe.classList.contains('chapter') && chapterSet.add(pELe)
        })
        chapterSet.forEach(pELe => intersectionObserver.observe(pELe))
    })
    onUnmounted(() => intersectionObserver.disconnect())
    onUpdated(() => {
        chapterSet.forEach(pELe => intersectionObserver.unobserve(pELe))
        chapterSet.clear()
        document.querySelectorAll('p').forEach(pELe => {
            pELe.classList.contains('chapter') && chapterSet.add(pELe)
        })
        chapterSet.forEach(pELe => intersectionObserver.observe(pELe))
    })
}
