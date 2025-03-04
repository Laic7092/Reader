import bus from "../utils/pubSub";
import { ClientBook, CRUD, STATUS } from '../core/declare';
import { Book, Chapter } from "../core/declare";

function busEmit(eventType: string | number, val?: any) {
  bus.emit(eventType, val);
}

const databaseName = 'library';
let db: IDBDatabase | null = null;

(function openOrCreatIDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, 2); // 升级版本号
    request.onerror = function () {
      console.log('数据库打开报错');
      reject();
    };
    request.onsuccess = function () {
      db = request.result;
      console.log('数据库打开成功');
      resolve(db);
      busEmit(STATUS.READY);
    };
    request.onupgradeneeded = function (event) {
      db = (event.target as any)?.result as IDBDatabase;
      if (!db.objectStoreNames.contains('book_metadata')) {
        // 创建 metadata store
        const metadataStore = db.createObjectStore('book_metadata', { keyPath: 'id' });
        metadataStore.createIndex('name', 'name', { unique: false }); // 为 name 字段创建索引
      }
      if (!db.objectStoreNames.contains('book_files')) {
        // 创建 files store
        db.createObjectStore('book_files', { keyPath: 'id' });
      }
    };
  });
})();

function create(bookData: Book) {
  if (!db) return;
  let id = bookData.id || getRandomBookId();
  bookData.id = id;
  const { name, heightArr, chapterArr, charSet, paraArr } = bookData;

  // 将 metadata 和 files 分开存储
  const transaction = db.transaction(['book_metadata', 'book_files'], 'readwrite');
  const metadataStore = transaction.objectStore('book_metadata');
  const filesStore = transaction.objectStore('book_files');

  // 存储 metadata
  metadataStore.add({ id, name });

  // 存储 files
  filesStore.add({ id, heightArr, chapterArr, charSet, paraArr });

  transaction.oncomplete = () => {
    console.log('数据写入成功');
    busEmit(CRUD.CREATE, bookData);
  };

  transaction.onerror = () => {
    console.log('数据写入失败');
  };
}

function read(id: string): Promise<ClientBook> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('数据库未初始化'));
      return;
    }

    const transaction = db.transaction(['book_metadata', 'book_files']);
    const metadataStore = transaction.objectStore('book_metadata');
    const filesStore = transaction.objectStore('book_files');

    // 读取 metadata
    const metadataRequest = metadataStore.get(id);
    const filesRequest = filesStore.get(id);

    metadataRequest.onsuccess = () => {
      if (!metadataRequest.result) {
        reject(new Error('未找到书籍'));
        return;
      }

      filesRequest.onsuccess = () => {
        if (!filesRequest.result) {
          reject(new Error('未找到书籍文件'));
          return;
        }

        // 合并 metadata 和 files
        resolve({
          id: metadataRequest.result.id,
          name: metadataRequest.result.name,
          heightArr: filesRequest.result.heightArr,
          chapterArr: filesRequest.result.chapterArr,
          charSet: filesRequest.result.charSet,
          paraArr: filesRequest.result.paraArr,
        });
      };

      filesRequest.onerror = () => {
        reject(new Error('读取书籍文件失败'));
      };
    };

    metadataRequest.onerror = () => {
      reject(new Error('读取书籍失败'));
    };
  });
}

function readAll(): Promise<Array<{ id: string; name: string }>> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('数据库未初始化'));
      return;
    }

    const transaction = db.transaction('book_metadata', 'readonly');
    const metadataStore = transaction.objectStore('book_metadata');
    const allBooks: Array<{ id: string; name: string }> = [];

    const openCursor = metadataStore.openCursor();
    openCursor.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        allBooks.push({
          id: cursor.value.id,
          name: cursor.value.name,
        });
        cursor.continue();
      } else {
        resolve(allBooks);
      }
    };

    openCursor.onerror = () => {
      reject(new Error('遍历数据失败'));
    };
  });
}

function update(id: string, bookData: Book) {
  if (!db) return;

  const transaction = db.transaction(['book_metadata', 'book_files'], 'readwrite');
  const metadataStore = transaction.objectStore('book_metadata');
  const filesStore = transaction.objectStore('book_files');

  // 更新 metadata
  metadataStore.put({ id, name: bookData.name });

  // 更新 files
  filesStore.put({
    id,
    heightArr: bookData.heightArr,
    chapterArr: bookData.chapterArr,
    charSet: bookData.charSet,
    paraArr: bookData.paraArr,
  });

  transaction.oncomplete = () => {
    console.log('数据更新成功');
  };

  transaction.onerror = () => {
    console.log('数据更新失败');
  };
}

function remove(id: string) {
  if (!db) return;

  const transaction = db.transaction(['book_metadata', 'book_files'], 'readwrite');
  const metadataStore = transaction.objectStore('book_metadata');
  const filesStore = transaction.objectStore('book_files');

  // 删除 metadata
  metadataStore.delete(id);

  // 删除 files
  filesStore.delete(id);

  transaction.oncomplete = () => {
    console.log('数据删除成功');
    busEmit(CRUD.DELETE, id);
  };

  transaction.onerror = () => {
    console.log('数据删除失败');
  };
}

function getRandomBookId() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] + '';
}

export { create, read, update, readAll, remove };
export type { Book, Chapter };