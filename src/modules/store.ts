import { ref } from 'vue'
import { Book, BookUtils } from '../core/declare'

const curBook = ref<Book>()

export function getCurBook() {
    return curBook.value
}

export function setCurBook(book: Book) {
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

