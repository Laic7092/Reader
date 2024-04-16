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
  <template v-if="!readerVisible">
    <ImportBook />
    <BookShelf @pickBook="pickBook" />
  </template>
  <Reader v-else-if="readerVisible && curBook" v-model="readerVisible" :curBook="curBook" />
</template>

<style scoped></style>
