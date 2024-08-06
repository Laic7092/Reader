<script setup lang="ts">
import { ref } from 'vue';
import { Book } from '../core/declare';
import { routeBack } from '../modules/router';
import DynamicHeightVList from './ScrollMode.vue';
import { useTxtBook } from './book';
import { setCurBookUtils } from '../modules/store';
// import { useViewPortSize } from '../modules/composables';
// import { debounced } from '../modules/utils';

// 使 v-model 必填
const props = defineProps<{
    curBook: Book
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

// expose to ui
setCurBookUtils({
    getCurBook: () => props.curBook,
    changeFontSize,
    closeReader,
    jumpChapter
})
</script>
<template>
    <article class="reader">
        <!-- temp close touch,wait for note & hightlight -->
        <main :style="style">
            <DynamicHeightVList ref="DVList" :list="curBook.paraArr.map((text, key) => ({ text, key }))"
                :height-list="curBook.heightArr">
                <template v-slot="slotProps">
                    <p>
                        {{ slotProps.text }}
                    </p>
                </template>
            </DynamicHeightVList>
        </main>
    </article>
</template>

<style scoped>
.reader {
    --bar-width: 250px;
    background-color: var(--background-color);
    padding: 0 2rem;
    max-width: 720px;
    margin: auto;
}

:deep(.vList-wrapper) p {
    font-size: 20px;
    margin: 0.5em 0;
    text-indent: 2em;
    text-align: justify;
    word-break: break-all;
    word-wrap: anywhere;
    /* line-break: anywhere; */
}
</style>