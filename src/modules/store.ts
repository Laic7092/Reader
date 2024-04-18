import { ref } from 'vue'
import { Book } from './indexDb'

const curBook = ref<Book>()

export function getCurBook() {
    return curBook.value
}

export function setCurBook(book: Book) {
    curBook.value = book
}
