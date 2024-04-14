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

const patt = /^第?[两一二三四五六七八九十零百千万\d壹贰叁肆伍陆柒捌玖拾佰仟萬①②③④⑤⑥⑦⑧⑨⑩]{1,9}[卷篇章回部话集幕册计讲场节](?:\s|$)/;

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
                    <span>Contents - 100%</span>
                    <img src="../assets/Bars3.svg" class="svg1">
                </div>
                <div class="malou flex-r-sbc">
                    <span>Search Book</span>
                    <img src="../assets/Search.svg" class="svg1">
                </div>
                <div class="malou flex-r-sbc">
                    <span>Theme & Setting</span>
                    <img src="../assets/Setting.svg" class="svg1">
                </div>
                <div class="malou flex-r-sbc hh">
                    <img src="../assets/Search.svg" class="louma svg1">
                    <img src="../assets/Search.svg" class="louma svg1">
                    <img src="../assets/Search.svg" class="louma svg1">
                </div>
            </div>
        </template>
        <main @click="() => operatePanelVisible ? changeOperatePanelVisible() : changeHeaderVisible()"
            @scroll="() => operatePanelVisible && changeOperatePanelVisible()">
            <!-- <p v-for="(line, idx) in curBook.chapterArr.slice(0, 500)" :key="idx">{{ false || new
                Array(10).fill(line.content).toString()
                }}
            </p> -->
            <template v-for="(para, idx) in curBook.paraArr.slice(0, 500)" :key="idx">
                <h3 v-if="para.search(patt) !== -1">{{ para }}</h3>
                <p v-else>{{ para }}</p>
            </template>
        </main>
        <!-- <footer>footer</footer> -->
    </article>
</template>

<style scoped>
article {
    min-width: 320px;
    max-width: 1280px;
    margin: 0 100px;
    --bar-width: 250px;

    .svgBtn {
        height: 1.5em;
        width: 1.5em;
        cursor: pointer;
        position: fixed;
        right: 1em;
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
        font-size: 1.2em;
        line-height: unset;
        word-spacing: unset;
        letter-spacing: unset;
        text-align: left;
    }
}

.operatePanel {
    position: fixed;
    right: 0;
    bottom: 3em;
    /* padding-right: 3em; */

    .malou {
        border-radius: 0.75em;
        margin: 0.25em 2em;
        padding: 0.5em 1em;
        background-color: darkgray;
        cursor: pointer;
        width: var(--bar-width);

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
        width: calc(var(--bar-width) + 2em);
        padding: 0;
        background-color: unset;
    }

    .louma {
        background-color: darkgray;
        flex: 1;
        margin: 0 0.25em;
        padding: 0.5em;
        border-radius: 1em;

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }
    }

}

@media(max-width: 1280px) {
    article {
        margin-left: 4em;
        margin-right: 4em
    }
}

@media(max-width: 949px) {
    article {
        margin-left: 3em;
        margin-right: 3em
    }
}

@media(max-width: 719px) {
    article {
        margin-left: 1.5em;
        margin-right: 1.5em
    }
}
</style>