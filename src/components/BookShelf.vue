<script setup lang="ts">
import ImportBook from '../components/ImportBook.vue';
import bus from '../utils/pubSub'
import { CRUD, Origin, STATUS } from '../core/declare';
import { readAll, remove, read } from "../modules/indexDb"
import { Book } from '../core/declare';
import { computed, onBeforeMount, onUnmounted, ref } from 'vue';
import { setCurBook } from '../modules/store';
import { routeTo } from '../modules/router';
// import { setBaseUrl } from '../server/index'

interface SubMap {
  [key: string]: any
}
const subMap: SubMap = {
  [CRUD.CREATE]: (val: any) => {
    books.value.push(val)
  },
  [CRUD.DELETE]: (id: string) => {
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

interface BookInShelf extends Book {
  selected: boolean
}

const books = ref<Array<BookInShelf>>([])
function init() {
  readAll().then(res => {
    console.log('书架初始化完成', res);
    books.value = res.map((book) => ({
      ...book,
      selected: false
    }) as BookInShelf)
  })
}

async function pickBook(book: BookInShelf) {
  setCurBook(await read(book.id))
  routeTo('/read')
}

function removeBook(id: string) {
  remove(id, Origin.client)
}

const curMode = ref('normal')
function changeMode(mode: string) {
  curMode.value = mode
}

function changeSelect(book: BookInShelf) {
  book.selected = !book.selected
}

const selection = computed(() => {
  return books.value.filter(book => book.selected)
})

function removeSelection() {
  selection.value.forEach(book => removeBook(book.id));
  changeMode('normal')
}
</script>
<template>
  <div class="top-right flex-r-sbc no-touch">
    <button v-if="curMode === 'normal'" @click="changeMode('manage')">Manage Books</button>
    <template v-else>
      <button class="mr1" @click="changeMode('normal')">cancel</button>
      <img @click="removeSelection" src="../assets/Delete.svg" class="svg-btn">
    </template>
    <!-- <button @click="setBaseUrl">同步</button>/ -->
    <ImportBook />
  </div>
  <template v-if="books.length > 0">
    <div class="container no-touch">
      <div class="book" v-for="book in books" :key="book.id"
        @click="() => curMode === 'normal' ? pickBook(book) : changeSelect(book)">
        <div class="post">
          <img src="/vite.svg" class="post-img">
          <div class="flex-r-sb full-width">
            <input type="checkbox" class="checkbox" v-if="curMode === 'manage'" v-model="book.selected" />
          </div>
        </div>

        <div class="auto-Elliptical name" :title="book.name">
          {{ book.name }}
        </div>
      </div>
    </div>
  </template>
  <div v-else>
    There doesn't seem to be a single book here, so try importing the basic books!
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1em;
  row-gap: 2em;
  padding: 2rem;
  margin-top: 3rem;

  /* 设置网格间隔 */
  .book {
    cursor: pointer;
    overflow: hidden;

    .post {
      background-color: var(--fill-color);
      padding: 1em;

      .post-img {
        width: 5em;
        height: 5em;
      }
    }

    .name {
      margin: 0.5em 0;
    }

    .checkbox {
      width: 2em;
      height: 2em;
      border-radius: 50%;
    }
  }
}

.top-right {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
}
</style>