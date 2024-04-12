<script setup lang="ts">
import bus, { CRUD, STATUS } from '../modules/pubSub'
import { readAll, Book } from "../modules/indexDb"
import { onBeforeMount, onUnmounted, ref } from 'vue';

const emit = defineEmits<{
  (e: 'pickBook', value: Book): void
}>()

interface SubMap {
  [key: string]: Function
}
const subMap: SubMap = {
  [CRUD.ADD]: (val: any) => {
    console.log(val, 'subMap');
  },
  // [CRUD.REMOVE]: (val: any) => {
  //   console.log(val, 'subMap');
  // },
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

function pickBook(val) {
  emit('pickBook', val)
}
</script>
<template>
  <div class="container">
    <div class="book" v-for="book in books" :key="book.id" @click="pickBook(book)">
      <img src="/vite.svg">
      <div>
        {{ book.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 2fr;
  grid-gap: 10px;

  /* 设置网格间隔 */
  .book {
    background-color: #f0f0f0;
    padding: 20px;
    border: 1px solid #ccc;
    color: #000;
    cursor: pointer;

    img {
      width: 100px;
      height: 100px;
    }
  }
}
</style>