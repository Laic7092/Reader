import bus from '../utils/pubSub'
import { CRUD, STATUS } from '../core/declare';
import { createBook, deleteBook, readBook, readAllBook } from './book'
import { checkConfig, getOperateLog } from './index'
import { readAll, read, remove } from '../modules/indexDb';
import { parseParasAndImportBook } from '../modules/bookManager';

// const SYNC_RATE = 10 * 1000

// let isOnline = window.navigator.onLine
// let timer = setInterval(sync, SYNC_RATE)
// isOnline || clearInterval(timer)

// window.ononline = () => {
//     isOnline = true
//     timer = setInterval(sync, SYNC_RATE)
//     console.log("You are now connected to the network.", isOnline);
// };

// window.onoffline = () => {
//     isOnline = false
//     timer && clearInterval(timer)
//     console.log("You are now unconnected to the network.", isOnline);
// }

async function sync() {
    if (!isOnline) return
    checkConfig()
    const serverBooks = await readAllBook()
    const localBooks = await readAll()
    const serverIds = serverBooks.map(book => book.id)
    const localIds = localBooks.map(book => book.id)

    const logs = await getOperateLog()
    const createId = new Set(logs.filter(log => log.type === 'CREATE').map(log => log.id))
    const deleteId = new Set(logs.filter(log => log.type === 'DELETE').map(log => log.id))

    localIds.forEach(async (id) => {
        if (!createId.has(id) && !deleteId.has(id)) {
            // c有s没有没删除
            const bookData = await read(id)
            createBook(bookData)
        } else if (deleteId.has(id)) {
            // c有s已删除
            remove(id)
        }
    })
    serverIds.forEach(async (id) => {
        if (createId.has(id) && !deleteId.has(id)) {
            // s有c没有没删除
            const bookData = await readBook(id)
            parseParasAndImportBook(bookData)
        }
    })
}

bus.on(STATUS.READY, sync)

bus.on(CRUD.CREATE, (bookData) => {
    const { id, name, paraArr } = bookData
    createBook({ id, name, paraArr })
})
bus.on(CRUD.DELETE, (id) => {
    deleteBook(id)
})