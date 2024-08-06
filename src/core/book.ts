import { onMounted, onUnmounted, onBeforeUnmount, Ref } from "vue"

export const useTxtBook = (DVList: Ref<any>, bookId: string) => {
    // bookMark
    onMounted(() => {
        if (DVList.value) {
            const { idx = 0, scrollTop = 0 } = JSON.parse(localStorage.getItem(bookId) || '{}')
            DVList.value.jump(idx, scrollTop)
        }
        addEventListener('visibilitychange', saveBookMark)
        addEventListener('pagehide', saveBookMark)
    })

    onUnmounted(() => {
        removeEventListener('visibilitychange', saveBookMark)
        removeEventListener('pagehide', saveBookMark)
    })

    const saveBookMark = () => {
        const _DVList = DVList.value
        if (_DVList) {
            // 存在1的误差，可以看看算法是不是还有点问题。。。
            localStorage.setItem(bookId, JSON.stringify({
                idx: String(_DVList.getStart()),
                scrollTop: String(_DVList.getScrollTop())
            }))
        }
    }
    onBeforeUnmount(() => saveBookMark())
    return {

    }
}

export const useEpubBook = () => {
    return {

    }
}