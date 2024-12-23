<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { throttled, binarySearch, arraySumming } from '../modules/utils';
import { curChapterIdx, getCurBook } from '../modules/store';

const props = defineProps<{
    list: Array<any>,
    heightList: Array<number>
}>()

const accumulatedHeightArray = props.heightList.reduce((acc: Array<number>, curr, index) => {
    acc.push(index === 0 ? curr : acc[index - 1] + curr);
    return acc;
}, []);


const { catchNum, displayNum } = { catchNum: 15, displayNum: 30 }
const totalLen = props.list.length
const totalHeight = arraySumming(props.heightList)

const start = ref(0)

const constHeight = ref<HTMLElement>()
const vListWrapper = ref<HTMLElement>()
onMounted(() => {
    constHeight.value && constHeight.value.style.setProperty('height', totalHeight + 'px')
    vListWrapper.value?.parentElement?.addEventListener('scroll', throttleScroller)
})
onUnmounted(() => {
    vListWrapper.value?.parentElement?.removeEventListener('scroll', throttleScroller)
})



let _scrollTop = 0
const CHUNK = (20 + 10) * 1.5 * catchNum
let preScrollTop = 0
async function scrollHandler(e: Event) {
    const { scrollTop } = e.target as HTMLElement
    _scrollTop = scrollTop
    if (Math.abs(preScrollTop - _scrollTop) < CHUNK) {
        return
    }
    preScrollTop = scrollTop
    const idx = binarySearch(accumulatedHeightArray, scrollTop) + 1
    if (start.value === idx) return
    setStart(idx)
}

const throttleScroller = scrollHandler

function Limit(val: number) {
    if (val < 0) {
        return 0
    } else if (val > totalLen) {
        return totalLen
    }
    return val
}

const vList = computed(() => props.list.slice(Limit(start.value - catchNum), Limit(start.value + displayNum + catchNum)))

const chapterArray = getCurBook()?.chapterArr

const setStart = (idx: number) => {
    start.value = idx
    const chapterIdx = chapterArray?.find((chapter) => {
        const { startLine, endLine } = chapter
        return idx >= startLine && idx <= endLine
    })?.idx
    curChapterIdx.value = chapterIdx || 0
}

defineExpose({
    jump(index: number, scrollTop?: number) {
        vListWrapper.value?.parentElement?.scrollTo({
            top: scrollTop ?? (index === 0 ? 0 : accumulatedHeightArray[index - 1]),
        })
    },
    getStart: () => start.value,
    getScrollTop: () => _scrollTop
})

const getTransform = (idx: number) => `translateY(${idx > 0 ? accumulatedHeightArray[idx - 1] : 0}px)`
</script>

<template>
    <div ref="vListWrapper" class="vList-wrapper" id="reader-overlay">
        <div ref="constHeight" style="position: relative;">
            <div class="item" v-for="item in vList" :key="item.id" :style="{ transform: getTransform(item.id) }">
                <slot v-bind="item"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.item {
    position: absolute;
    will-change: transform;
    width: 100%;
    top: 0;
    left: 0;
}
</style>