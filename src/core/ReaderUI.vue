<script setup lang="ts">
import Drawer from '../components/Drawer.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import VList from '../components/VList.vue';
import { BookUtils } from './declare';

const props = defineProps<{
    utils: BookUtils
}>()

const { closeReader, changeFontSize, curBook } = props.utils

const curTimeoutID = ref(-1)

function terminate() {
    curTimeoutID.value > 0 && clearTimeout(curTimeoutID.value)
    curTimeoutID.value = -1
}
function startTimeout() {
    curTimeoutID.value = setTimeout(() => {
        curTimeoutID.value = -1
        subLayer()
    }, 5000)
}

enum UILayer {
    Blank = -1,
    baseBtns = 0,
    operatePanel = 1
}
const curUILayer = ref<UILayer>(0)

function addLayer() {
    curUILayer.value += 1
    judgeLayer(curUILayer.value)
}

function subLayer() {
    curUILayer.value -= 1
    judgeLayer(curUILayer.value)
}

function judgeLayer(value: UILayer) {
    // before nextick,so i can terminate timeout if curuilayer !== basebtns
    // or,start timeout before basebtns been render
    if (value === UILayer.baseBtns) {
        startTimeout()
    } else {
        terminate()
    }
}

interface DrawerMap {
    settingsDrawer: boolean
    contensDrawer: boolean
    searchDrawer: boolean
}
const drawerMap = ref<DrawerMap>({
    settingsDrawer: false,
    contensDrawer: false,
    searchDrawer: false
})
function showDrawer(key: keyof DrawerMap) {
    drawerMap.value[key] = true
}


let intervalId = -1
onMounted(() => {
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
})



onMounted(() => {
    startTimeout()
})

onUnmounted(() => {
    clearInterval(intervalId)
})

function ChangeUI() {
    curUILayer.value > UILayer.Blank ? subLayer() : addLayer()
}

defineExpose({
    ChangeUI
})
</script>
<template>
    <template v-if="curUILayer === UILayer.baseBtns">
        <img src="../assets/Close.svg" @click="closeReader" class="svg-btn small border close">
        <img src="../assets/Operate.svg" @click="addLayer" class="svg-btn small border operate">
    </template>
    <div v-else-if="curUILayer === UILayer.operatePanel" class="operatePanel no-touch">
        <div>
            <div class="menu-item flex-r-sbc" @click="showDrawer('contensDrawer')">
                <span class="menu-name">Contents - 100%</span>
                <img src="../assets/Bars3.svg" class="svg-btn">
            </div>
            <div class="menu-item flex-r-sbc" @click="showDrawer('searchDrawer')">
                <span class=" menu-name">Search Book</span>
                <img src="../assets/Search.svg" class="svg-btn">
            </div>
            <div class="menu-item flex-r-sbc" @click="showDrawer('settingsDrawer')">
                <span class="menu-name">Themes & Settings</span>
                <img src="../assets/Setting.svg" class="svg-btn">
            </div>
            <div class="menu-item flex-r-sbc none-decoration">
                <img src="../assets/Bars3.svg" class="louma svg-btn">
                <img src="../assets/Search.svg" class="louma svg-btn">
                <img src="../assets/Setting.svg" class="louma svg-btn">
            </div>
        </div>
        <div class="chapter-bar">

        </div>

    </div>
    <Teleport to="body">
        <Drawer v-model="drawerMap.contensDrawer" title="Contents" height="80vh" class="content-drawer"
            close-icon-offset="-0.5em" @close="curUILayer = UILayer.Blank">
            <VList :list="curBook().chapterArr" :config="{ catchNum: 8, displayNum: 15, wrapperClass: 'content' }">
                <template #item="{ content, idx }">
                    <div @click="drawerMap.contensDrawer = false; curUILayer = UILayer.Blank; utils.jumpChapter(idx)">
                        <a style="color: unset;">{{ content }}</a>
                    </div>
                </template>
            </VList>
        </Drawer>
        <Drawer v-model="drawerMap.searchDrawer" title="Search Book" height="80vh">
            <!-- <input> -->
            <div>
                Coming soon...
            </div>
        </Drawer>
        <Drawer v-model="drawerMap.settingsDrawer" title="Themes & Settings">
            <div>
                Coming soon...
            </div>
            <div class="fontsize-adjust-btn flex-r-sbc" v-if="false">
                <span class="left-letter" @click="changeFontSize('sub')">A</span>
                <span class="divide"></span>
                <span class="right-letter" @click="changeFontSize('add')">A</span>
            </div>
        </Drawer>
    </Teleport>
</template>

<style scoped>
.svg-btn {
    &.small {
        width: 1.5em;
        height: 1.5em;
    }

    &.border {
        border: 0.25rem solid var(--border-color);
        border-radius: 50%;
        background-color: var(--border-color);
    }

    &.close {
        position: fixed;
        right: 1.5em;
        top: 2em;
    }

    &.operate {
        position: fixed;
        right: 1.5em;
        bottom: 2em;
        border-radius: 25%;
    }

}

.operatePanel {
    position: fixed;
    right: 0;
    bottom: 3em;
    --bar-width: 260px;

    display: flex;

    .menu-item {
        border-radius: 0.75em;
        margin: 0.25em 0;
        padding: 0.5em 1em;
        background-color: var(--fill-color);
        /* box-shadow: var(--box-shadow); */
        cursor: pointer;
        width: var(--bar-width);

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

    .chapter-bar {
        width: 50px;
        background-color: var(--fill-color);
        border-radius: 0.75em;
        margin: 0 1em;
    }

}

.fontsize-adjust-btn {
    padding: 0.5em;
    background-color: var(--border-color);
    border-radius: 0.75em;
    cursor: pointer;
    text-align: center;
    width: 60%;
    line-height: 1;
    font-weight: 500;

    .divide {
        border: 0.5px solid;
        height: 1.2em;
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

.content-drawer> :deep(.drawer)>.drawer-body {
    padding: 0;
}

.vList-wrapper :deep(.item) {
    height: 50px;
    box-sizing: border-box;
    padding: 1em 1.5em;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
}
</style>