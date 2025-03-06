<script setup lang="ts">
import { ref } from 'vue';
import { ClientBook } from '../core/declare';
import { routeBack } from '../modules/router';
import DynamicHeightVList from './ScrollMode.vue';
import { useTxtBook } from '../core/book';
import { setCurBookUtils } from '../modules/store';
// import { useViewPortSize } from '../modules/composables';
// import { debounced } from '../modules/utils';

// 使 v-model 必填
const props = defineProps<{
    curBook: ClientBook
}>()

// 提供一个默认值
function closeReader() {
    routeBack()
}

function changeFontSize(type: string) {
    style.value['font-size'] = parseInt(style.value['font-size'] || '18') + (type === 'add' ? 2 : -2) + 'px'
}
const style = ref({
    'font-size': '',
})

const DVList = ref<InstanceType<typeof DynamicHeightVList> | null>(null)
const jumpChapter = (index: number) => {
    DVList.value && DVList.value.jump(index)
}

// txt implement
useTxtBook(DVList, props.curBook.id)

// watch reader container size to recalc height
// const resizeHandler = (DOMRect: DOMRectReadOnly) => {
//     const { width, height } = DOMRect
//     console.log(width, height)
// }

// const DOMRect = useViewPortSize('#reader-overlay', debounced(resizeHandler, 200))

// calc cur chapter
const chapterIdxArr = props.curBook.chapterArr.map(chapter => chapter.idx)

// expose to ui
setCurBookUtils({
    getCurBook: () => props.curBook,
    changeFontSize,
    closeReader,
    jumpChapter,
    getChapterIdx: () => 0
})
</script>
<template>
    <div class="reader-wrapper" :style="style">
        <DynamicHeightVList class="reader" ref="DVList" :list="curBook.lineArr.map((text, id) => ({ text, id }))"
            :height-list="curBook.heightArr">
            <template v-slot="{ text, id, style }">
                <p :class="{ 'chapter': chapterIdxArr.includes(id) }" :style="style">
                    {{ text }}
                </p>
            </template>
        </DynamicHeightVList>
    </div>
</template>

<style scoped>
.reader {
    --bar-width: 250px;
    background-color: var(--background-color);
    padding: 0 2rem;
    max-width: 720px;
    margin: auto;

    .chapter {
        font-weight: 600;
        text-indent: 0;
        /* font-size: 1.5em; */
    }

    p {
        font-size: 20px;
        margin: 0;
        margin-bottom: 0.5em;
        /* color: black; */
        text-indent: 2em;
        text-align: justify;
        word-break: break-all;
        word-wrap: anywhere;
        line-break: loose;
    }
}

.reader-wrapper {
    overflow-y: auto;
    height: 100%;
}
</style>