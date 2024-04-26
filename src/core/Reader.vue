<script setup lang="ts">
import { computed, ref } from 'vue';
import { Book } from '../modules/indexDb';
import ReaderUI from './ReaderUI.vue';
import { routeBack } from '../modules/router';

// 使 v-model 必填
const props = defineProps<{
    curBook: Book
}>()

// 提供一个默认值
function closeReader() {
    routeBack()
}

const init = 1000
const gap = 50

const start = ref(0)
const vList = computed(() => props.curBook.paraArr.slice(start.value, start.value + init))

function moveWindow(type: string) {
    if (type === 'next') {
        start.value += gap
    } else {
        start.value = gap > start.value ? 0 : start.value - gap
    }
}

function changeFontSize(type: string) {
    style.value['font-size'] = parseFloat(style.value['font-size'] || '1') + (type === 'add' ? 0.1 : -0.1) + 'em'
}
const style = ref({
    'font-size': ''
})

const utils = {
    curBook: props.curBook,
    moveWindow,
    changeFontSize,
    closeReader
}

const UIRef = ref<typeof ReaderUI | null>(null)
function ChangeUI() {
    UIRef.value?.ChangeUI()
}

const UIVisible = ref(false)

defineExpose({
    showUI() {
        UIVisible.value = true
    },
    hideUI() {
        UIVisible.value = false
    }
})
</script>
<template>
    <article class="reader" @click="ChangeUI">
        <Teleport to="body">
            <ReaderUI ref="UIRef" v-if="UIVisible" :utils="utils" />
        </Teleport>
        <!-- temp close touch,wait for note & hightlight -->
        <main :style="style" class="no-touch">
            <template v-for="para in vList">
                <p>{{ para }}</p>
            </template>
        </main>
    </article>
</template>

<style scoped>
.reader {
    --bar-width: 250px;
    background-color: var(--background-color);

    main>p {
        margin: 0.25em 0;
        word-break: break-all;
        word-wrap: break-word;
        text-indent: 2em;
        text-align: justify;
    }
}
</style>