<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Book } from '../modules/indexDb';
import Drawer from './Drawer.vue';

// 使 v-model 必填
const model = defineModel({ required: true })
const props = defineProps<{
    curBook: Book
}>()

// 提供一个默认值
function back() {
    model.value = false
}

// const catelog = ref<Array<string>>([])
// const catelogVisible = ref(false)
// function showCatelog() {
//     catelogVisible.value = true
// }
const limit = ref(false)
onMounted(() => {
    console.log('阅读页加载中', props.curBook)
    autoHide()
    document.addEventListener('scroll', () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement
        if (scrollTop + clientHeight === scrollHeight) {
            aa('next')
        } else if (scrollTop === 0 && start.value !== 0) {
            aa('pre')
        }
    })

    const intersectionObserver = new IntersectionObserver((entries) => {
        // 如果 intersectionRatio 为 0，则目标在视野外，
        // 我们不需要做任何事情。
        // what if pre & next exist in a viewport?
        if (entries[0].intersectionRatio <= 0) {
            console.log('trigger,out')
            return
        };
        console.log("Loaded new items", entries);
    });
    // 开始监听
    const anchor = document.querySelector('#anchor')
    anchor && intersectionObserver.observe(anchor);
    setInterval(() => {
        // alert(intersectionObserver.root)
    }, 5000)
})

const init = 300
const gap = 50

const start = ref(0)
const vList = computed(() => props.curBook.paraArr.slice(start.value, start.value + init))

function aa(type: string) {
    if (limit.value) return
    limit.value = true
    if (type === 'next') {
        start.value += gap
    } else {
        start.value = gap > start.value ? 0 : start.value - gap
    }
    console.log(vList.value)
    setTimeout(() => {
        limit.value = false
        console.log(vList.value)
    }, 0)
}

const headerVisible = ref(true)

const endSecond = ref(4)
const curInterval = ref(0)
function resetEndSecond() {
    clearInterval(curInterval.value)
    endSecond.value = 4
}
function autoHide() {
    curInterval.value = setInterval(() => {
        if (endSecond.value > 0) {
            endSecond.value -= 1
        }
        if (endSecond.value === 0) {
            changeHeaderVisible()
        }
    }, 1000)
}
function changeHeaderVisible() {
    headerVisible.value = !headerVisible.value
    if (headerVisible.value) {
        autoHide()
    } else {
        resetEndSecond()
    }
}

const operatePanelVisible = ref(false)
function changeOperatePanelVisible() {
    operatePanelVisible.value = !operatePanelVisible.value
    if (operatePanelVisible.value) {
        resetEndSecond()
    } else {
        autoHide()
    }
}

const drawerVisible = ref(false)
function showDrawer() {
    drawerVisible.value = true
}

// const chapterIdxArr = computed(() => props.curBook.chapterArr.map(chapter => chapter.idx))

function changeFontSize(type: string) {
    style.value['font-size'] = parseFloat(style.value['font-size']) + (type === 'add' ? 0.1 : -0.1) + 'em'
}
const style = ref({
    'font-size': '1em'
})
</script>
<template>
    <article id="reader">
        <template v-if="headerVisible">
            <!-- <div></div> -->
            <img src="../assets/Close.svg" @click="back" v-if="!operatePanelVisible" class="svg-btn-small border close">
            <img src="../assets/Operate.svg" v-if="!operatePanelVisible" @click="changeOperatePanelVisible"
                class="svg-btn-small border operate">
            <div v-if="operatePanelVisible" class="operatePanel">
                <div class="menu-item flex-r-sbc">
                    <span class="menu-name">Contents - 100%</span>
                    <img src="../assets/Bars3.svg" class="svg-btn">
                </div>
                <div class="menu-item flex-r-sbc">
                    <span class="menu-name">Search Book</span>
                    <img src="../assets/Search.svg" class="svg-btn">
                </div>
                <div class="menu-item flex-r-sbc" @click=showDrawer>
                    <span class="menu-name">Themes & Settings</span>
                    <img src="../assets/Setting.svg" class="svg-btn">
                </div>
                <div class="menu-item flex-r-sbc none-decoration">
                    <img src="../assets/Search.svg" class="louma svg-btn">
                    <img src="../assets/Search.svg" class="louma svg-btn">
                    <img src="../assets/Search.svg" class="louma svg-btn">
                </div>
            </div>
        </template>
        <Drawer v-model="drawerVisible" title="Themes & Settings" height="50dvh">
            <div class="fontsize-adjust-btn flex-r-sbc">
                <span class="left-letter" @click="changeFontSize('sub')">A</span>
                <span class="divide"></span>
                <span class="right-letter" @click="changeFontSize('add')">A</span>
            </div>
        </Drawer>
        <main :style="style" @click="() => operatePanelVisible ? changeOperatePanelVisible() : changeHeaderVisible()"
            @scroll="() => operatePanelVisible && changeOperatePanelVisible()">
            <template v-for="(para, idx) in vList">
                <!-- <h3 v-if="chapterIdxArr.indexOf(idx) !== -1">{{ para }}</h3> -->
                <!-- <p v-else>{{ para }}</p> -->
                <p>{{ para }}</p>
                <div v-if="idx === vList.length / 2" id="anchor">
                </div>
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

    .svg-btn-small {
        height: 1.5em;
        width: 1.5em;
        cursor: pointer;

        &.close {
            position: fixed;
            right: 1em;
            top: 2em;
        }

        &.operate {
            position: fixed;
            right: 1em;
            bottom: 2em;
            border-radius: 25%;
        }

        &.border {
            border: 0.25rem solid #CFD3DC;
            border-radius: 50%;
            background-color: #CFD3DC;
        }
    }



    main {
        font-size: 1em;
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

    .menu-item {
        border-radius: 0.75em;
        margin: 0.25em 2em;
        padding: 0.5em 1em;
        background-color: darkgray;
        cursor: pointer;
        width: var(--bar-width);

        .menu-name {
            font-size: 1.2em;
            font-weight: bold;
            color: #242424;
        }

        .svg-btn {
            width: 2em;
            height: 2em;
        }

        &.none-decoration {
            width: calc(var(--bar-width) + 2em);
            padding: 0;
            background-color: unset;

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

    }


}

.fontsize-adjust-btn {
    padding: 0.5em;
    background-color: darkgray;
    border-radius: 1em;

    .divide {
        border: 0.5px solid gray;
        height: 1.5em;
        margin: auto;
    }

    .left-letter {
        font-size: 0.8em;
        flex: 1;
    }

    .right-letter {
        font-size: 1.2em;
        flex: 1;
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