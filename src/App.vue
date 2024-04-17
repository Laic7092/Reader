<script setup lang="ts">
import { ref } from 'vue';
import BookShelf from './components/BookShelf.vue';
import ImportBook from './components/ImportBook.vue';
import Reader from './components/Reader.vue'
import { Book } from './modules/indexDb';

const readerVisible = ref(false)

const curBook = ref<Book>()
function pickBook(book: Book) {
  curBook.value = book
  readerVisible.value = true
}
</script>

<template>
  <Reader v-if="readerVisible && curBook" v-model="readerVisible" :curBook="curBook" />
  <div v-show="!readerVisible">
    <ImportBook />
    <BookShelf @pickBook="pickBook" />
  </div>
</template>

<style scoped></style>
