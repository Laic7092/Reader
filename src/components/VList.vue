<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const total = 500000

const list = new Array(total).fill(0).map((item, idx) => ({ item, idx }))

const catchNum = 5
const displayNum = 10

const start = ref(0)
const end = computed(() => start.value + displayNum)

const _scrollHeight = ref(0)
const _scrollTop = ref(0)

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
    // 300|60
    const height = total * 60 + 'px'
    _scrollHeight.value = parseInt(height)
    ul.value && ul.value.style.setProperty('height', height)
}


function listenScroll(e: Event) {
    const el = e?.target as HTMLElement
    if (!el) return
    const { scrollHeight, scrollTop } = el
    _scrollHeight.value = scrollHeight
    _scrollTop.value = scrollTop

    const hiddenNum = Math.floor(scrollTop / 60)
    const sub = hiddenNum - start.value
    if (sub !== 0) {
        start.value += sub
        if (ul.value) {
            ul.value.style.setProperty('margin-top', hiddenNum * 60 + 'px')
            ul.value.style.height = total * 60 - hiddenNum * 60 + 'px'
        }
    }
}

const vList = computed(() => list.slice(Limit(start.value - catchNum), Limit(end.value + catchNum)))

const hiddenNum = computed(() => Math.floor(_scrollTop.value / 60))

</script>
<template>
    <div class="fix">
        <div>
            <span style="margin-right: 20px;">scrollHeight&scrollTop</span>{{ _scrollHeight }}|{{ _scrollTop }}
        </div>
        <div>
            <span style="margin-right: 20px;">start&end</span>{{ start }}|{{ end }}
        </div>
        <div>
            <span style="margin-right: 20px;">hiddenNum</span>{{ hiddenNum }}
        </div>
    </div>
    <div class="wrapper" @scroll="listenScroll">
        <ul ref="ul" class="vList">
            <li class="item" v-for="item in vList" :key="item.idx">
                <span class="a">
                    {{ item.idx + ' start' }}
                </span>
                <span class="b">
                    {{ item.idx + ' end' }}
                </span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.fix {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    background-color: black;

    div {
        font-size: 1.2em;
        text-align: left;

        span {
            display: inline-block;
            text-align: left;
            width: 200px;
        }
    }
}

.wrapper {
    height: 90%;
    overflow-y: auto;
    contain: layout;

    .vList {
        margin: 0;
        padding: 0;
        .item {
            height: 60px;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            /* margin-bottom: 10px; */
            .a {
                background-color: #000;
                color: orange;
                width: fit-content;
            }

            .b {
                background-color: orange;
                color: black;
                width: fit-content;
            }
        }
    }
}
</style>