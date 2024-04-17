<script setup lang="ts">
import { ref } from 'vue';
import BookShelf from './components/BookShelf.vue';
import ImportBook from './components/ImportBook.vue';
import Reader from './components/Reader.vue'
import { Book } from './modules/indexDb';
import Drawer from './components/Drawer.vue';
import VList from './components/VList.vue';

const readerVisible = ref(false)

const curBook = ref<Book>()
function pickBook(book: Book) {
  curBook.value = book
  readerVisible.value = true
}

const vListVisible = ref(false)

const readerRef = ref<typeof Reader | null>(null)
function onAfterEnter() {
  readerRef.value?.showUI()
}
function onBeforeLeave() {
  readerRef.value?.hideUI()
}
</script>

<template>
  <Transition name="slide-fade" @after-enter="onAfterEnter" @before-leave="onBeforeLeave">
    <Reader ref="readerRef" v-if="readerVisible && curBook" v-model="readerVisible" :curBook="curBook" />
  </Transition>
  <div v-show="!readerVisible">
    <ImportBook />
    <BookShelf @pickBook="pickBook" />
    <button @click="vListVisible = true">Show VList</button>
    <Drawer v-model="vListVisible" title="vList" height="80vh">
      <VList />
    </Drawer>
  </div>
</template>

<style scoped></style>
