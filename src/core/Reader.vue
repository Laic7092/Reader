<script setup lang="ts">
import { ref } from 'vue';
import { Book } from '../modules/indexDb';
import ReaderUI from './ReaderUI.vue';
import { routeBack } from '../modules/router';
import DynamicHeightVList from '../components/DynamicHeightVList.vue';

// 使 v-model 必填
const props = defineProps<{
    curBook: Book
}>()

// 提供一个默认值
function closeReader() {
    routeBack()
}

function changeFontSize(type: string) {
    style.value['font-size'] = parseInt(style.value['font-size'] || '16') + (type === 'add' ? 2 : -2) + 'px'
}
const style = ref({
    'font-size': '',
})

const UIRef = ref<typeof ReaderUI | null>(null)
function ChangeUI() {
    UIRef.value?.ChangeUI()
}

const UIVisible = ref(false)

const DVList = ref<InstanceType<typeof DynamicHeightVList> | null>(null)
const jumpChapter = (index: number) => {
    DVList.value && DVList.value.jump(index)
}


const utils = {
    curBook: () => props.curBook,
    changeFontSize,
    closeReader,
    jumpChapter
}

defineExpose({
    showUI() {
        UIVisible.value = true
    },
    hideUI() {
        UIVisible.value = false
    },
})
</script>
<template>
    <article class="reader" @click="ChangeUI">
        <Teleport to="body">
            <ReaderUI ref="UIRef" v-if="UIVisible" :utils="utils" />
        </Teleport>
        <!-- temp close touch,wait for note & hightlight -->
        <main :style="style" class="no-touch">
            <DynamicHeightVList ref="DVList" :list="curBook.paraArr" :height-list="curBook.heightArr">
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
}

:deep(.vList-wrapper) p {
    margin: 0;
    text-indent: 2em;
    text-align: justify;
    word-break: break-all;
    word-wrap: anywhere;
    line-break: anywhere;
}
</style>