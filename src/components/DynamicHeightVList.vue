<script setup lang="ts">
// @ts-nocheck

import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
const props = defineProps<{
    list: Array<any>,
    heightList: Array<number>
}>()

const accumulatedHeightArray = props.heightList.reduce((acc: Array<number>, curr, index) => {
    acc.push(index === 0 ? curr : acc[index - 1] + curr);
    return acc;
}, []);
function getSumHeight(arr: Array<number>) {
    return arr.reduce((pre, cur) => pre + cur)
}

function binarySearch(arr: Array<number>, aimHeight: number): number {
    let left = 0, right = arr.length - 1;
    let mid = 0;

    while (left <= right) {
        mid = Math.floor((left + right) / 2);
        if (arr[mid] === aimHeight) {
            return mid; // 直接返回匹配的索引
        } else if (arr[mid] < aimHeight) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // 循环结束后，left > right，此时left是最接近aimHeight的索引
    return left;
}

const { catchNum, displayNum } = { catchNum: 8, displayNum: 15 }
const totalLen = props.list.length
const totalHeight = getSumHeight(props.heightList)

const start = ref(0)

const ul = ref<HTMLElement | null>(null)
onMounted(() => {
    ul.value && ul.value.style.setProperty('height', totalHeight + 'px')
    document.querySelector('#reader-overlay').addEventListener('scroll', throttleScroller)
})
onUnmounted(() => {
    document.querySelector('#reader-overlay').removeEventListener('scroll', throttleScroller)
})

function throttled(fn: () => void, delay: number) {
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

const throttleScroller = throttled(scrollHandler, 40)

let swicth = true
async function scrollHandler(e: Event) {
    if (!swicth) return
    const { scrollTop } = e.target as HTMLElement

    const idx = binarySearch(accumulatedHeightArray, scrollTop)
    start.value = idx
    // const topCacheHeight = getSumHeight(props.heightList.slice(Limit(start.value - catchNum), start.value))
    const vHeight = idx > catchNum ? getSumHeight(props.heightList.slice(0, Limit(start.value - catchNum))) : 0
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

defineExpose({
    jump(index: number) {
        swicth = false

        start.value = index + catchNum

        const vHeight = index > catchNum ? getSumHeight(props.heightList.slice(0, Limit(start.value - catchNum))) : 0
        const supplemntHeight = vHeight

        if (ul.value) {
            ul.value.style.setProperty('margin-top', supplemntHeight + 'px')
            ul.value.style.height = totalHeight - supplemntHeight + 'px'
        }

        nextTick(() => {
            document.querySelector('p')?.scrollIntoView({ behavior: 'smooth' })
            setTimeout(() => {
                swicth = true
            });
        })
    }
})

// 稍微分析一下动态高度虚拟该如何计算
// 1. 假设全部渲染，就是正常滚动，一切都不需要考虑
// 2. 虚拟列表 + 真实渲染（缓冲区 + 视口）
// 3. 为了方便，我已经得到了每项高度
// 4. 那现在的滚动，需要用margin去填充虚拟部分（上部分，下部分不需要，为空就行）
// 5. 真实区域，则需要考虑缓冲区每次的高度变化，以及视口部分的高度变化
// 6. 最后就是保证好滚动条位置。。。
</script>
<template>
    <div ref="ul" class="vList-wrapper">
        <template v-for="item in vList" :key="item.key">
            <slot :text="item.text"></slot>
        </template>
    </div>
</template>