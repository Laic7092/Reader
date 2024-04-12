<script setup lang="ts">
import bus, { CRUD, STATUS } from '../modules/pubSub'
import { readAll, remove, Book } from "../modules/indexDb"
import { onBeforeMount, onUnmounted, ref } from 'vue';

const emit = defineEmits<{
  (e: 'pickBook', value: Book): void
}>()

interface SubMap {
  [key: string]: Function
}
const subMap: SubMap = {
  [CRUD.ADD]: (val: any) => {
    books.value.push(val)
  },
  [CRUD.REMOVE]: (id: string) => {
    books.value.splice(books.value.findIndex((book) => book.id === id), 1)
  },
  // [CRUD.UPDATE]: (val: any) => {
  //   console.log(val, 'subMap');
  // },
  [STATUS.READY]: init
}

onBeforeMount(() => {
  for (const key in subMap) {
    if (Object.prototype.hasOwnProperty.call(subMap, key)) {
      const element = subMap[key];
      bus.on(key, element)
    }
  }
})
onUnmounted(() => {
  for (const key in subMap) {
    if (Object.prototype.hasOwnProperty.call(subMap, key)) {
      const element = subMap[key];
      bus.off(key, element)
    }
  }
})

const books = ref<Array<Book>>([])
// CWJ-TO 这里存在隐患，一开始就全部读取，绝对不合理，考虑再单独设一个表？
function init() {
  readAll().then(res => {
    console.log('书架初始化完成', res);
    books.value = res
  })
}

function pickBook(val: Book) {
  emit('pickBook', val)
}

function removeBook(id: string) {
  remove(id)
}
</script>
<template>
  <div class="container">
    <div class="book" v-for="book in books" :key="book.id" @click="pickBook(book)">
      <img src="/vite.svg">
      <div class="auto-Elliptical" :title="book.name">
        {{ book.name }}
      </div>
      <button @click.stop="removeBook(book.id)">remove</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 2fr;
  grid-gap: 1em;

  /* 设置网格间隔 */
  .book {
    background-color: #f0f0f0;
    padding: 1em;
    border: 1px solid #ccc;
    color: #000;
    cursor: pointer;
    overflow: hidden;

    img {
      width: 5em;
      height: 5em;
    }
  }
}
</style>