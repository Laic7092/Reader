<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { throttled } from '../utils/utils';

interface Config {
    catchNum: number
    displayNum: number
    wrapperClass: string
}
const props = defineProps<{
    list: Array<any>
    config: Config
    initIdx: number
}>()

const ITEM_HEIGHT = 50
const { catchNum, displayNum, wrapperClass } = props.config

const start = ref(0)
const total = props.list.length

function Limit(val: number) {
    if (val < 0) {
        return 0
    } else if (val > total) {
        return total
    }
    return val
}

const ul = ref<HTMLElement | null>(null)
onMounted(() => {
    setHeight()
    ul.value?.parentElement?.scrollTo({
        top: (props.initIdx - 6) * ITEM_HEIGHT,
        behavior: 'auto'
    })
})
function setHeight() {
    const height = total * ITEM_HEIGHT + 'px'
    ul.value && ul.value.style.setProperty('height', height)
}

const TOTAL_HEIGHT = total * ITEM_HEIGHT
function scrollHandler(e: Event) {
    const { scrollTop } = e.target as HTMLElement
    const idx = Math.floor(Math.max(scrollTop, 0) / ITEM_HEIGHT)

    if (start.value === idx) return

    start.value = idx
    const vHeight = idx > catchNum ? (idx - catchNum) * ITEM_HEIGHT : 0

    if (ul.value) {
        ul.value.style.setProperty('margin-top', vHeight + 'px')
        ul.value.style.height = TOTAL_HEIGHT - vHeight + 'px'
    }
}
const throttleScroller = throttled(scrollHandler, 40)

const vList = computed(() => props.list.slice(Limit(start.value - catchNum), Limit(start.value + displayNum + catchNum)))
</script>
<template>
    <div class="vList-wrapper" @scroll="throttleScroller">
        <ul ref="ul" class="vList" :class="wrapperClass">
            <li class="item" v-for="item in vList" :key="item">
                <slot name="item" v-bind="item"></slot>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.vList-wrapper {
    height: 100%;
    overflow-y: auto;
    contain: layout;

    .vList {
        margin: 0;
        padding: 0;
    }
}
</style>