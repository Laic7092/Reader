<script setup lang="ts">
// @ts-nocheck
import { computed, nextTick, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
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


const { catchNum, displayNum } = { catchNum: 8, displayNum: 15 }
const totalLen = props.list.length
const totalHeight = arraySumming(props.heightList)

const start = ref(0)

const ul = ref<HTMLElement | null>(null)
onMounted(() => {
    ul.value && ul.value.style.setProperty('height', totalHeight + 'px')
    document.querySelector('#reader-overlay').addEventListener('scroll', throttleScroller)
})
onUnmounted(() => {
    document.querySelector('#reader-overlay').removeEventListener('scroll', throttleScroller)
})


const throttleScroller = throttled(scrollHandler, 40)

let _scrollTop = 0
async function scrollHandler(e: Event) {
    const { scrollTop } = e.target as HTMLElement
    _scrollTop = scrollTop
    const idx = binarySearch(accumulatedHeightArray, scrollTop)

    if (start.value === idx + 1) return

    start.value = idx + 1
    const vHeight = idx > catchNum ? arraySumming(props.heightList.slice(0, Limit(start.value - catchNum))) : 0
    const supplemntHeight = vHeight

    if (ul.value) {
        ul.value.style.setProperty('margin-top', supplemntHeight + 'px')
        ul.value.style.height = totalHeight - supplemntHeight + 'px'
    }
}

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
watch(start, (newValue) => {
    const idx = chapterArray?.find((chapter, idx) => {
        const { startLine, endLine } = chapter
        return newValue >= startLine && newValue <= endLine
    })?.idx
    curChapterIdx.value = idx
})

defineExpose({
    jump(index: number, scrollTop?: number) {
        document.querySelector('#reader-overlay').scrollTo({
            top: scrollTop ?? (index === 0 ? 0 : accumulatedHeightArray[index - 1]),
        })
    },
    getStart: () => start.value,
    getScrollTop: () => _scrollTop
})
</script>
<template>
    <div ref="ul" class="vList-wrapper">
        <template v-for="item in vList" :id="item.id">
            <slot v-bind="item"></slot>
        </template>
    </div>
</template>