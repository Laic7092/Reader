import { ref } from 'vue'
import { Book } from '../core/declare'

const curBook = ref<Book | null>(null)

export function getCurBook() {
    return curBook.value
}

export function setCurBook(book: Book) {
    curBook.value = book
}
