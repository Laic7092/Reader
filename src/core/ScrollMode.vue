<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { binarySearch } from '../modules/utils';
import { curChapterIdx, getCurBook } from '../modules/store';

const props = defineProps<{
    list: Array<any>,
    heightList: Array<number>
}>();

const LINEGAP = 10;

// 计算累积高度数组
const accumulatedHeightArray = computed(() => {
    return props.heightList.reduce((acc: Array<number>, curr, index) => {
        acc.push((index === 0 ? curr : acc[index - 1] + curr) + LINEGAP);
        return acc;
    }, []);
});

// 虚拟列表的配置
const CATCH_NUM = 5; // 预加载的额外行数
const DISPLAY_NUM = 30; // 可视区域的最大行数
const totalLen = props.list.length;
const totalHeight = computed(() => accumulatedHeightArray.value[totalLen - 1] || 0);

const startIndex = ref(0); // 当前渲染的起始索引
const endIndex = computed(() => Math.min(startIndex.value + DISPLAY_NUM + CATCH_NUM * 2, totalLen));

// 可视区域的 DOM 引用
const constHeight = ref<HTMLElement>();
const vListWrapper = ref<HTMLElement>();

// 更新起始索引
function updateStartIndex(scrollTop: number) {
    const idx = binarySearch(accumulatedHeightArray.value, scrollTop);
    if (Math.abs(startIndex.value - idx) > CATCH_NUM) {
        startIndex.value = idx;
        updateCurrentChapter(idx);
    }
}

// 更新当前章节
function updateCurrentChapter(idx: number) {
    const chapterArray = getCurBook()?.chapterArr;
    const chapterIdx = chapterArray?.find((chapter) => {
        const { startLine, endLine } = chapter;
        return idx >= startLine && idx <= endLine;
    })?.idx;
    curChapterIdx.value = chapterIdx || 0;
}

// 滚动事件处理
let isScrolling = false;
function handleScroll(e: Event) {
    if (isScrolling) return;
    isScrolling = true;

    requestAnimationFrame(() => {
        const { scrollTop } = e.target as HTMLElement;
        updateStartIndex(scrollTop);
        isScrolling = false;
    });
}

onMounted(() => {
    constHeight.value && constHeight.value.style.setProperty('height', totalHeight.value + 'px');
    vListWrapper.value?.parentElement?.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    vListWrapper.value?.parentElement?.removeEventListener('scroll', handleScroll);
});

// 计算当前需要渲染的列表项
const visibleList = computed(() => {
    const start = Math.max(0, startIndex.value - CATCH_NUM);
    const end = Math.min(totalLen, endIndex.value);
    return props.list.slice(start, end);
});

// 计算偏移量
const transform = computed(() => {
    const start = Math.max(0, startIndex.value - CATCH_NUM);
    return `translateY(${start > 0 ? accumulatedHeightArray.value[start - 1] : 0}px)`;
});

// 暴露方法
defineExpose({
    jump(index: number, scrollTop?: number) {
        vListWrapper.value?.parentElement?.scrollTo({
            top: scrollTop ?? (index === 0 ? 0 : accumulatedHeightArray.value[index - 1]),
        })
    },
    getStart: () => startIndex.value,
    getScrollTop: () => vListWrapper.value?.parentElement?.scrollTop
});
</script>

<template>
    <div ref="vListWrapper" class="vList-wrapper">
        <div ref="constHeight">
            <div :style="{ transform: transform }">
                <template v-for="item in visibleList" :key="item.id">
                    <slot v-bind="item" :style="{ height: `${heightList[item.id]}px` }"></slot>
                </template>
            </div>
        </div>
    </div>
</template>