<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

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

const start = ref(catchNum + props.initIdx)
const total = props.list.length

const _scrollHeight = ref(0)

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
        top: (props.initIdx - 8) * ITEM_HEIGHT,
        behavior: 'auto'
    })
})
function setHeight() {
    const height = total * ITEM_HEIGHT + 'px'
    _scrollHeight.value = parseInt(height)
    ul.value && ul.value.style.setProperty('height', height)
}

let ticker = false
async function listenScroll(e: Event) {
    if (!ticker) {
        ticker = true

        const { scrollTop } = e.target as HTMLElement

        const hiddenNum = Math.floor(Math.max(scrollTop, 0) / ITEM_HEIGHT)

        start.value = hiddenNum + catchNum
        if (ul.value) {
            ul.value.style.setProperty('margin-top', hiddenNum * ITEM_HEIGHT + 'px')
            ul.value.style.height = total * ITEM_HEIGHT - hiddenNum * ITEM_HEIGHT + 'px'
        }
        await nextTick()
        ticker = false
    }

}


const vList = computed(() => props.list.slice(Limit(start.value - catchNum), Limit(start.value + displayNum + catchNum)))

</script>
<template>
    <div class="vList-wrapper" @scroll="listenScroll">
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