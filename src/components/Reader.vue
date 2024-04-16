<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
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

let intervalId = -1
const limit = ref(false)
onMounted(() => {
    console.log('阅读页加载中', props.curBook)
    autoHide()

    let scrolling = false;
    document.addEventListener('scroll', () => {
        scrolling = true
    })
    intervalId = setInterval(() => {
        if (scrolling) {
            scrolling = false;

            operatePanelVisible.value && changeOperatePanelVisible()

            const { scrollTop, clientHeight, scrollHeight } = document.documentElement
            if (scrollTop + clientHeight === scrollHeight) {
                aa('next')
            } else if (scrollTop === 0 && start.value !== 0) {
                aa('pre')
            }
        }
    }, 300);

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
onUnmounted(() => {
    clearInterval(intervalId)
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
    setTimeout(() => {
        limit.value = false
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

interface DrawerMap {
    settingsDrawer: boolean
    contensDrawer: boolean
}
const drawerMap = ref<DrawerMap>({
    settingsDrawer: false,
    contensDrawer: false,
})
function showDrawer(key: keyof DrawerMap) {
    drawerMap.value[key] = true
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
    <template v-if="headerVisible && !operatePanelVisible">
        <img src="../assets/Close.svg" @click="back" class="svg-btn-small border close">
        <img src="../assets/Operate.svg" @click="changeOperatePanelVisible" class="svg-btn-small border operate">
    </template>
    <div v-else-if="operatePanelVisible" class="operatePanel">
        <div class="menu-item flex-r-sbc" @click="showDrawer('contensDrawer')">
            <span class="menu-name">Contents - 100%</span>
            <img src="../assets/Bars3.svg" class="svg-btn">
        </div>
        <div class="menu-item flex-r-sbc">
            <span class="menu-name">Search Book</span>
            <img src="../assets/Search.svg" class="svg-btn">
        </div>
        <div class="menu-item flex-r-sbc" @click="showDrawer('settingsDrawer')">
            <span class="menu-name">Themes & Settings</span>
            <img src="../assets/Setting.svg" class="svg-btn">
        </div>
        <div class="menu-item flex-r-sbc none-decoration">
            <img src="../assets/Search.svg" class="louma svg-btn">
            <img src="../assets/Search.svg" class="louma svg-btn">
            <img src="../assets/Search.svg" class="louma svg-btn">
        </div>
    </div>
    <article class="reader">
        <a href="www.baidu.com">clickme</a>
        <main :style="style" @click="() => operatePanelVisible ? changeOperatePanelVisible() : changeHeaderVisible()">
            <template v-for="(para, idx) in vList">
                <!-- <h3 v-if="chapterIdxArr.indexOf(idx) !== -1">{{ para }}</h3> -->
                <!-- <p v-else>{{ para }}</p> -->
                <p>{{ para }}</p>
                <div v-if="idx === vList.length / 2" id="anchor">
                </div>
            </template>
        </main>
        <!-- <footer>footer</footer> -->
        <Drawer v-model="drawerMap.settingsDrawer" title="Themes & Settings">
            <div class="fontsize-adjust-btn flex-r-sbc">
                <span class="left-letter" @click="changeFontSize('sub')">A</span>
                <span class="divide"></span>
                <span class="right-letter" @click="changeFontSize('add')">A</span>
            </div>
        </Drawer>
        <Drawer v-model="drawerMap.contensDrawer" title="Contents" height="80vh">
            <ul class="contents">
                <li v-for="(chapter, idx) in curBook.chapterArr" :key="idx">
                    <a style="color: unset;">{{ chapter.content }}</a>
                </li>
            </ul>
        </Drawer>
    </article>
</template>

<style scoped>
.reader {
    min-width: 320px;
    max-width: 1280px;
    margin: 0 100px;
    --bar-width: 250px;
    -webkit-touch-callout: none;

    main {
        font-size: 1em;
        line-height: unset;
        word-spacing: unset;
        letter-spacing: unset;
        text-align: left;
        -webkit-touch-callout: none;
    }
}

.svg-btn-small {
    height: 1.5em;
    width: 1.5em;
    cursor: pointer;

    &.border {
        border: 0.25rem solid var(--border-color);
        border-radius: 50%;
        background-color: var(--border-color);
    }

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

}

.operatePanel {
    position: fixed;
    right: 0;
    bottom: 3em;
    -webkit-user-select: none;
    user-select: none;

    .menu-item {
        border-radius: 0.75em;
        margin: 0.25em 2em;
        padding: 0.5em 1em;
        background-color: var(--fill-color);
        /* box-shadow: var(--box-shadow); */
        cursor: pointer;
        width: var(--bar-width);

        .menu-name {
            font-size: 1.2em;
            font-weight: bold;
        }

        &.none-decoration {
            width: calc(var(--bar-width) + 2em);
            padding: 0;
            background-color: unset;
            box-shadow: none;

            .louma {
                background-color: var(--fill-color);
                /* box-shadow: var(--box-shadow); */
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
    background-color: var(--border-color);
    border-radius: 1em;

    .divide {
        border: 0.5px solid;
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

.contents {
    text-align: left;
    font-size: 1.3em;
}

@media(max-width: 1280px) {
    .reader {
        margin-left: 4em;
        margin-right: 4em
    }
}

@media(max-width: 949px) {
    .reader {
        margin-left: 3em;
        margin-right: 3em
    }
}

@media(max-width: 719px) {
    .reader {
        margin-left: 1.5em;
        margin-right: 1.5em
    }
}
</style>