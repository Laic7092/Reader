<script setup lang="ts">
import Reader from '../core/Reader.vue';
import ReaderUI from '../core/ReaderUI.vue';
import { getCurBook } from '../modules/store';
import { onActivated, onDeactivated, ref } from 'vue';
import { Book } from '../core/declare';
import { useLockBody } from '../modules/composables';

useLockBody()

const curBook = ref<Book>()
onActivated(() => {
    curBook.value = getCurBook()
})
onDeactivated(() => {
    curBook.value = undefined
})

const UIVisible = ref(false)

function onAfterEnter() {
    UIVisible.value = true
}
function onBeforeLeave() {
    UIVisible.value = false
}

const UIRef = ref<typeof ReaderUI | null>(null)
function ChangeUI() {
    UIRef.value?.ChangeUI()
}
</script>
<template>
    <Transition name="slide-fade" @after-enter="onAfterEnter" @before-leave="onBeforeLeave">
        <div v-if="curBook" class="overlay" id="reader-overlay" style="overflow-y: auto;" @click="ChangeUI">
            <Teleport to="body">
                <ReaderUI ref="UIRef" v-if="UIVisible" />
            </Teleport>
            <Reader ref="readerRef" :curBook="curBook" />
        </div>
    </Transition>
</template>