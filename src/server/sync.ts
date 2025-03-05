import bus from '../utils/pubSub'
import { Book, CRUD, Origin, STATUS } from '../core/declare';
import { createBook, deleteBook, readBook, readAllBook } from './book'
import { checkConfig, getOperateLog } from './index'
import { readAll, read, remove } from '../modules/indexDb';
import { createMetaBook } from '../modules/bookManager';

const SYNC_RATE = 15 * 1000

let isOnline = window.navigator.onLine
let timer = setInterval(sync, SYNC_RATE)
isOnline || clearInterval(timer)

window.ononline = () => {
    isOnline = true
    timer = setInterval(sync, SYNC_RATE)
    console.log("You are now connected to the network.", isOnline);
};

window.onoffline = () => {
    isOnline = false
    timer && clearInterval(timer)
    console.log("You are now unconnected to the network.", isOnline);
}


async function sync() {
    if (!isOnline) return
    let serverBooks: Book[]
    try {
        serverBooks = await readAllBook()
    } catch (error) {
        timer && clearInterval(timer)
        isOnline = false
        window.ononline = () => { }
        window.onoffline = () => { }
        return
    }
    checkConfig()
    const localBooks = await readAll()
    const serverIds = serverBooks.map(book => book.id)
    const localIds = localBooks.map(book => book.id)

    console.log('server', serverIds);
    console.log('client', localIds);


    const logs = (await getOperateLog()).map(log => ({ ...log, id: log.id_ref }))

    const createId = new Set(logs.filter(log => log.type === 'CREATE').map(log => log.id))
    const deleteId = new Set(logs.filter(log => log.type === 'DELETE').map(log => log.id))
    const updateId = new Set(logs.filter(log => log.type === 'UPDATE').map(log => log.id))

    console.log('create', createId);
    console.log('delete', deleteId);
    console.log('update', updateId);


    localIds.forEach(async (id) => {
        if (!createId.has(id) && !deleteId.has(id)) {
            // c有s没有没删除
            const bookData = await read(id)
            createBook(bookData)
        } else if (deleteId.has(id)) {
            // c有s已删除
            remove(id, Origin.server)
        }
    })
    serverIds.forEach(async (id) => {
        if (!deleteId.has(id) && !localIds.includes(id)) {
            // s有c没有没删除
            const bookData = await readBook(id)
            console.log(bookData);
            createMetaBook(bookData, Origin.server)
        }
    })
}

bus.on(STATUS.READY, sync)

bus.on(CRUD.CREATE, (bookData, origin) => {
    if (origin === Origin.client) {
        const { id, name, paraArr } = bookData
        createBook({ id, name, paraArr })
    }
})
bus.on(CRUD.DELETE, (id, origin) => {
    origin === Origin.client && deleteBook(id)
})