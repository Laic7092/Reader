import { ref } from 'vue'
import { BookUtils, ClientBook } from '../core/declare'

const curBook = ref<ClientBook>()

export function getCurBook() {
    return curBook.value
}

export function setCurBook(book: ClientBook) {
    curBook.value = book
}

const curBookUtils = ref<BookUtils>()

export function getCurBookUtils() {
    return curBookUtils.value
}

export function setCurBookUtils(bookUtils: BookUtils) {
    curBookUtils.value = bookUtils
}

export const curChapterIdx = ref(0)

