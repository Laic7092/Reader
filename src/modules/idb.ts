const databaseName = 'library';
let db: IDBDatabase | null = null;

interface Chapter {
    idx: number
    content: string
    startLine: number
    endLine: number
}
interface Book {
    id: string
    name: string
    chapterArr: Array<Chapter>
    paraArr: Array<string>
}

(function openOrCreatIDB() {
    return new Promise((resolve, reject) => {
        const request = globalThis.indexedDB.open(databaseName);
        request.onerror = function () {
            console.log('数据库打开报错');
            reject();
        };
        request.onsuccess = function () {
            db = request.result;
            //通过request对象的result属性拿到数据库对象。
            console.log('数据库打开成功');
            resolve(db);
        };
        request.onupgradeneeded = function (event) {
            //新建数据库也会触发,因为版本从无到有,而且是先触发升级版本,再触发打开成功
            console.log("升级咯")
            //如果要修改数据库结构（新增或删除表、索引或者主键），只能通过升级数据库版本完成。
            db = (event.target as any)?.result as IDBDatabase;
            //这时通过事件对象的target.result属性，拿到数据库实例。
            if (!db.objectStoreNames.contains('books')) {
                let objectStore = null;
                objectStore = db.createObjectStore('books', { keyPath: 'id' });
                console.log(objectStore)
                //主键也可以指定为下一层对象的属性{id:1,foo:{bar:1}} foo.bar
                // let objectStore = db.createObjectStore(
                //   'books',
                //   { autoIncrement: true }
                // );自动生成主键,递增数

                // objectStore.createIndex('name', 'name', { unique: false });
                // objectStore.createIndex('email', 'email', { unique: true });
                //三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
            }
        }
    })

})()


function readAll(): Promise<Array<Book>> {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject()
            return
        }
        let objectStore = db.transaction('books').objectStore('books');
        let allBooks: Array<Book> = [];
        const openCursor = objectStore.openCursor();
        openCursor.onsuccess = function (event) {//新建指针对象的openCursor()方法是一个异步操作
            const target = event.target as IDBRequest
            let cursor = target.result;
            if (cursor) {
                //console.log(cursor);
                //  console.log('Id: ' + cursor.key);
                //  console.log('bookData',cursor.value.bookData)
                allBooks.push(cursor.value.bookData)
                cursor.continue();
            } else {
                // console.log('没有更多数据了！');
                resolve(allBooks)
            }
        };
        openCursor.onerror = function () {
            console.log('迭代失败');
            reject()
        };
    })

}
