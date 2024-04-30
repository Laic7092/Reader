<script setup lang="ts">
    import { computed, nextTick, onMounted, ref } from 'vue';
    const props = defineProps<{
        list: Array<any>
    }>()
    const ITEM_HEIGHT = 50
    const { catchNum, displayNum } = { catchNum: 10, displayNum: 20 }

    const start = ref(catchNum)
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

            const { scrollTop } = (e.target as Document).documentElement

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


    document.addEventListener('scroll', listenScroll)
</script>
<template>
    <div ref="ul" class="vList-wrapper">
        <template v-for="item in vList">
            <slot :text="item"></slot>
        </template>
    </div>
</template>
