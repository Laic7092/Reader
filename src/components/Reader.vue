<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Book } from '../modules/indexDb';

// 使 v-model 必填
const model = defineModel({ required: true })
const props = defineProps<{
    curBook: Book
}>()

// 提供一个默认值
function back() {
    model.value = false
}

const catelog = ref<Array<string>>([])
const catelogVisible = ref(false)
function showCatelog() {
    catelogVisible.value = true
}
onMounted(() => {
    console.log('阅读页加载中', props.curBook)
})

const preLine = ref(5)
const viewPortLine = ref(10)
const sufLine = ref(5)

const vList = computed(() => {

})

const headerVisible = ref(true)
function changeHeaderVisible() {
    headerVisible.value = !headerVisible.value
}

const operatePanelVisible = ref(false)
function changeOperatePanelVisible() {
    operatePanelVisible.value = !operatePanelVisible.value
}
</script>
<template>
    <article>
        <template v-if="headerVisible">
            <!-- <div></div> -->
            <img src="../assets/Close.svg" @click="back" class="svgBtn close">
            <img src="../assets/Operate.svg" v-if="!operatePanelVisible" @click="changeOperatePanelVisible"
                class="svgBtn operate">
            <div v-if="operatePanelVisible" class="operatePanel">
                <div class="malou flex-r-sbc">
                    <span>contents - 100%</span>
                    <img src="../assets/Bars3.svg" class="svg1">
                </div>
                <div class="malou flex-r-sbc">
                    <span>search book</span>
                    <img src="../assets/Search.svg" class="svg1">
                </div>
                <div class="malou flex-r-sbc">
                    <span>theme & setting</span>
                    <img src="../assets/Setting.svg" class="svg1">
                </div>
                <div class="malou flex-r-sbc hh">
                    <div class="louma flex-r-cc">
                        <img src="../assets/Search.svg" class="svg1">
                    </div>
                    <div class="louma flex-r-cc">
                        <img src="../assets/Search.svg" class="svg1">
                    </div>
                    <div class="louma flex-r-cc">
                        <img src="../assets/Search.svg" class="svg1">
                    </div>
                </div>
            </div>
        </template>
        <main @click="() => operatePanelVisible ? changeOperatePanelVisible() : changeHeaderVisible()"
            @scroll="() => operatePanelVisible && changeOperatePanelVisible()">
            <p v-for="(line, idx) in curBook.chapterArr.slice(0,500)" :key="idx">{{ line.content || new
                Array(10).fill(line.content).toString()
                }}
            </p>
        </main>
        <!-- <footer>footer</footer> -->
    </article>
</template>

<style scoped>
article {
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--pc-width);
    height: 100vh;
    height: 100dvh;
    /* height: calc(var(--vh, 1vh) * 100); */

    .svgBtn {
        height: 1.5em;
        width: 1.5em;
        cursor: pointer;
        position: fixed;
        right: calc(20vw + 2em);
        border: 0.25rem solid #CFD3DC;
        border-radius: 50%;
        background-color: #CFD3DC;
    }

    .close {
        top: 2em;
    }

    .operate {
        bottom: 2em;
        border-radius: 25%;
    }

    main {
        flex: content;
        overflow-y: auto;
        background-color: black;
        padding: 1em;
        font-size: inherit;
        line-height: normal;
        line-height: 1.5em;
        word-spacing: normal;
        letter-spacing: normal;
        text-align: left;
    }
}

.operatePanel {
    position: fixed;
    width: var(--pc-width);
    bottom: 4em;
    padding-right: 3em;
    box-sizing: border-box;

    .malou {
        border-radius: 0.75em;
        border: 0.5em solid darkgray;
        margin: 0.25em 2em;
        background-color: darkgray;
        cursor: pointer;

        span {
            font-size: 1.2em;
            font-weight: bold;
            color: #242424;
        }

        .svg1 {
            width: 2em;
            height: 2em;
        }
    }

    .hh {
        background-color: unset;
        border: none;
    }

    .louma {
        background-color: darkgray;
        margin: 0 0.25em;
        padding: 0.5em;
        flex: 1;
        border-radius: 1em;

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }
    }

}

/* @media (719px < width <=949px) and (orientation: landscape) {
    article {
        width: var(--pad-width);

        .svgBtn {
            right: calc(10vw + 2em);
        }

        header {
            width: var(--pad-width);
        }
    }

    .operatePanel {
        width: var(--pad-width);
    }
} */

@media (width <=949px) or (orientation: portrait) {
    article {
        width: var(--full-width);

        .svgBtn {
            right: 2em;
        }

        header {
            width: var(--full-width);
        }
    }

    .operatePanel {
        width: var(--full-width);
    }
}
</style>