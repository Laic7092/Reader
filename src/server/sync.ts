import bus from '../utils/pubSub'
import { Book, CRUD, Log, Origin, STATUS } from '../core/declare';
import { createBook, deleteBook, readBook, readAllBook, uploadChunks } from './book'
import { checkConfig, getOperateLog } from './index'
import { readAllMetadata, deleteMetadata, readMetadata, createMetadata, readFileChunk } from '../modules/indexDb';

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



function deduplicateRecords(records: Log[]): Log[] {
    const recordMap = new Map<string, Log>();

    for (const record of records) {
        const existingRecord = recordMap.get(record.id_ref);

        // 如果当前记录比已存在的记录更新，则替换
        if (
            !existingRecord ||
            new Date(record.timestamp) > new Date(existingRecord.timestamp)
        ) {
            recordMap.set(record.id_ref, record);
        }
    }

    // 将 Map 转换为数组并返回
    return Array.from(recordMap.values());
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
    const localBooks = await readAllMetadata()
    const serverIds = serverBooks.map(book => book.id)
    const localIds = localBooks.map(book => book.id)

    console.log('server', serverIds);
    console.log('client', localIds);


    const logs = deduplicateRecords(await getOperateLog())

    const createId = new Set(logs.filter(log => log.type === 'CREATE').map(log => log.id_ref || log.id))
    const deleteId = new Set(logs.filter(log => log.type === 'DELETE').map(log => log.id_ref || log.id))
    const updateId = new Set(logs.filter(log => log.type === 'UPDATE').map(log => log.id_ref || log.id))

    console.log('create', createId);
    console.log('delete', deleteId);
    console.log('update', updateId);


    localIds.forEach(async (id) => {
        if (!createId.has(id) && !deleteId.has(id)) {
            // c有s没有没删除
            const bookData = await readMetadata(id)
            createBook(bookData)
            const chunks = await readFileChunk(id)
            uploadChunks(id, chunks)
        } else if (deleteId.has(id)) {
            // c有s已删除
            debugger
            deleteMetadata(id, Origin.server)
        }
    })
    serverIds.forEach(async (id) => {
        if (!deleteId.has(id) && !localIds.includes(id)) {
            // s有c没有没删除
            const bookData = await readBook(id)
            console.log(bookData);
            createMetadata(bookData, Origin.server)
        }
    })
}

bus.on(STATUS.READY, sync)

bus.on(CRUD.CREATE, (bookData, origin) => {
    if (origin === Origin.client) {
        const { id, name } = bookData
        createBook({ id, name })
        readFileChunk(id).then(chunks => uploadChunks(id, chunks))
    }
})
bus.on(CRUD.DELETE, (id, origin) => {
    origin === Origin.client && deleteBook(id)
})