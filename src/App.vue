<script setup lang="ts">
import { ref } from 'vue';
import BookShelf from './components/BookShelf.vue';
import ImportBook from './components/ImportBook.vue';
import Reader from './components/Reader.vue'

const readerVisible = ref(false)

function showReader() {
  readerVisible.value = true
}
</script>

<template>
  <Reader v-if="readerVisible" v-model="readerVisible" />
  <div v-show="!readerVisible">
    <ImportBook />
    <BookShelf @pickBook="showReader" />
  </div>
</template>

<style scoped></style>
