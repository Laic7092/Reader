<script setup lang="ts">
    import { computed, nextTick, onMounted, ref } from 'vue';
    import DynamicItem from './DynamicItem.vue';

    interface Para {
        content: string
        measureHeight: number
        realHeight: number
    }

    const props = defineProps<{
        list: Array<any>
        // 保留的样式配置
        config?: any
    }>()

    const { fontSize, lineHeight } = props.config || { fontSize: 16, lineHeight: 1.5 }
    const _lineHeight = lineHeight * fontSize
    const viewPortWidth = window.innerWidth - 2 * fontSize
    let measureScollHeight = 0
    const _list = props.list.map(item => {
        const measureHeight = _lineHeight * Math.ceil(item.length * fontSize / viewPortWidth)
        measureScollHeight += measureHeight
        return {
            content: item,
            measureHeight,
            realHeight: 0
        }
    })

    const MEASURE_HEIGHT = 64
    const { catchNum, displayNum } = { catchNum: 10, displayNum: 20 }

    const start = ref(catchNum)
    const total = props.list.length

    const scrollHeight = ref(0)
    const preScrollTop = ref(0)

    const realStart = computed(() => Math.max(start.value - catchNum, 0))
    const realEnd = computed(() => Math.min(start.value + displayNum + catchNum, total))

    const ul = ref<HTMLElement | null>(null)
    const vList = computed(() => _list.slice(realStart.value, realEnd.value))

    let ticker = false
    async function listenScroll(e: Event) {
        if (!ticker) {
            ticker = true

            const { scrollTop } = (e.target as Document).documentElement

            const hiddenNum = Math.floor(Math.max(scrollTop, 0) / MEASURE_HEIGHT)

            start.value = hiddenNum + catchNum
            if (ul.value) {
                ul.value.style.setProperty('margin-top', hiddenNum * MEASURE_HEIGHT + 'px')
                ul.value.style.height = total * MEASURE_HEIGHT - hiddenNum * MEASURE_HEIGHT + 'px'
            }
            await nextTick()
            ticker = false
        }
    }

    function setHeight() {
        scrollHeight.value = measureScollHeight
        ul.value && ul.value.style.setProperty('height', measureScollHeight + 'px')
    }

    onMounted(() => {
        document.addEventListener('scroll', listenScroll)
        setHeight()
    })
</script>
<template>
    <div ref="ul" class="vList-wrapper">
        <template v-for="item in vList">
            <DynamicItem :item="item">
                <slot v-bind="item"></slot>
            </DynamicItem>
        </template>
    </div>
</template>
