<script setup lang="ts">
import { computed, ref } from 'vue';
import { Book } from '../modules/indexDb';
import ReaderUI from './ReaderUI.vue';

// 使 v-model 必填
const model = defineModel({ required: true })
const props = defineProps<{
    curBook: Book
}>()

// 提供一个默认值
function closeReader() {
    model.value = false
}

const init = 300
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
    style.value['font-size'] = parseFloat(style.value['font-size']) + (type === 'add' ? 0.1 : -0.1) + 'em'
}
const style = ref({
    'font-size': '1em'
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
</script>
<template>
    <ReaderUI ref="UIRef" :utils="utils" />
    <article class="reader" @click="ChangeUI">
        <main :style="style">
            <template v-for="para in vList">
                <p>{{ para }}</p>
            </template>
        </main>
    </article>
</template>

<style scoped>
.reader {
    min-width: 320px;
    max-width: 1280px;
    margin: 0 100px;
    --bar-width: 250px;

    main {
        font-size: 1em;
        line-height: unset;
        word-spacing: unset;
        letter-spacing: unset;
        text-align: left;
    }
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