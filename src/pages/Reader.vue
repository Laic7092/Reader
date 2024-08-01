<script setup lang="ts">
import Reader from '../core/Reader.vue';
import { getCurBook } from '../modules/store';
import { onActivated, onDeactivated, ref } from 'vue';
import { Book } from '../modules/indexDb';

const curBook = ref<Book>()
onActivated(() => {
    curBook.value = getCurBook()
})
const readerRef = ref<typeof Reader | null>(null)
function onAfterEnter() {
    readerRef.value?.showUI()
}
function onBeforeLeave() {
    readerRef.value?.hideUI()
}

onActivated(() => {
    document.body.style.overflow = 'hidden'
})
onDeactivated(() => {
    document.body.style.overflow = ''
})
</script>
<template>
    <Transition name="slide-fade" @after-enter="onAfterEnter" @before-leave="onBeforeLeave">
        <Reader ref="readerRef" v-if="curBook" :curBook="curBook" />
    </Transition>
</template>