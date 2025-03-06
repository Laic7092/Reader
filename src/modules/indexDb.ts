import bus from "../utils/pubSub";
import type { Book, Chapter, ClientBook, Chunk } from "../core/declare";
import { CRUD, Origin, STATUS } from "../core/declare"

const databaseName = 'library';
let db: IDBDatabase | null = null;

// 初始化 IndexedDB
(function openOrCreateIDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName);
    request.onerror = function () {
      console.log('数据库打开报错');
      reject();
    };
    request.onsuccess = function () {
      db = request.result;
      console.log('数据库打开成功');
      resolve(db);
      bus.emit(STATUS.READY);
    };
    request.onupgradeneeded = function (event) {
      db = (event.target as any)?.result as IDBDatabase;
      if (!db.objectStoreNames.contains('book_metadata')) {
        // 创建 metadata store
        db.createObjectStore('book_metadata', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('book_files')) {
        // 创建 files store
        const filesStore = db.createObjectStore('book_files', { autoIncrement: true });
        filesStore.createIndex('id', 'id', { unique: false }); // 添加 id 索引
      }
      if (!db.objectStoreNames.contains('book_parseData')) {
        // 创建 parseData store
        db.createObjectStore('book_parseData', { keyPath: 'id' });
      }
    };
  });
})();

// 创建书籍 metadata
function createMetadata(bookData: Book, origin: Origin = Origin.client) {
  if (!db) return;
  const id = bookData.id || getRandomBookId();
  bookData.id = id;

  const transaction = db.transaction('book_metadata', 'readwrite');
  const metadataStore = transaction.objectStore('book_metadata');

  // 存储 metadata
  metadataStore.add({ id, name: bookData.name });

  transaction.oncomplete = () => {
    console.log('metadata 写入成功');
    bus.emit(CRUD.CREATE, bookData, origin);
  };

  transaction.onerror = () => {
    console.log('metadata 写入失败');
  };
}

// 读取书籍 metadata
function readMetadata(id: string): Promise<ClientBook> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('数据库未初始化'));
      return;
    }

    const transaction = db.transaction(['book_metadata', 'book_parseData'], 'readonly');
    const metadataStore = transaction.objectStore('book_metadata');
    const parseDataStore = transaction.objectStore('book_parseData');

    const book: any = {}

    // 读取 metadata
    const metadataRequest = metadataStore.get(id);
    metadataRequest.onsuccess = () => {
      if (!metadataRequest.result) {
        reject(new Error('未找到书籍 metadata'));
        return;
      }
      book.metadata = metadataRequest.result;
    };

    // 读取 parseData
    const parseDataRequest = parseDataStore.get(id);
    parseDataRequest.onsuccess = () => {
      if (!parseDataRequest.result) {
        reject(new Error('未找到书籍 parseData'));
        return;
      }
      book.parseData = parseDataRequest.result;
    };

    transaction.oncomplete = () => {
      resolve({
        ...book.metadata,
        ...book.parseData
      });
    };

    transaction.onerror = () => {
      reject(new Error('读取书籍数据失败'));
    };
  });
}

// 读取所有书籍 metadata
function readAllMetadata(): Promise<Array<{ id: string; name: string }>> {
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

// 更新书籍 metadata
function updateMetadata(id: string, name: string) {
  if (!db) return;

  const transaction = db.transaction('book_metadata', 'readwrite');
  const metadataStore = transaction.objectStore('book_metadata');

  // 更新 metadata
  metadataStore.put({ id, name });

  transaction.oncomplete = () => {
    console.log('metadata 更新成功');
  };

  transaction.onerror = () => {
    console.log('metadata 更新失败');
  };
}

// 删除书籍 metadata
function deleteMetadata(id: string, origin: Origin = Origin.client) {
  if (!db) return;

  const transaction = db.transaction(['book_metadata', 'book_files', 'book_parseData'], 'readwrite');
  const metadataStore = transaction.objectStore('book_metadata');
  const filesStore = transaction.objectStore('book_files');
  const parseDataStore = transaction.objectStore('book_parseData');

  // 删除 metadata
  const metadataRequest = metadataStore.delete(id);
  metadataRequest.onsuccess = () => {
    console.log('metadata 删除成功');
  };
  metadataRequest.onerror = () => {
    console.log('metadata 删除失败');
  };

  // 删除 files
  const filesRequest = filesStore.index('id').openCursor(IDBKeyRange.only(id));
  filesRequest.onsuccess = (event) => {
    const cursor = (event.target as IDBRequest).result;
    if (cursor) {
      cursor.delete();
      cursor.continue();
    }
  };
  filesRequest.onerror = () => {
    console.log('files 删除失败');
  };

  // 删除 parseData
  const parseDataRequest = parseDataStore.delete(id);
  parseDataRequest.onsuccess = () => {
    console.log('parseData 删除成功');
  };
  parseDataRequest.onerror = () => {
    console.log('parseData 删除失败');
  };

  transaction.oncomplete = () => {
    console.log('书籍数据删除成功');
    bus.emit(CRUD.DELETE, id, origin);
  };

  transaction.onerror = () => {
    console.log('书籍数据删除失败');
  };
}

// 添加书籍文件分块
function addFileChunk(id: string, chunk: string, chunkIndex: number) {
  if (!db) return;

  const transaction = db.transaction('book_files', 'readwrite');
  const filesStore = transaction.objectStore('book_files');

  // 存储文件分块
  filesStore.add({ id, chunk, chunkIndex });

  transaction.oncomplete = () => {
    console.log('文件分块写入成功');
  };

  transaction.onerror = () => {
    console.log('文件分块写入失败');
  };
}

// 读取书籍文件分块
function readFileChunk(id: string, chunkIndex: number): Promise<Chunk>;
function readFileChunk(id: string): Promise<Chunk[]>;
function readFileChunk(id: string, chunkIndex?: number): Promise<Chunk | Chunk[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('数据库未初始化'));
      return;
    }

    const transaction = db.transaction('book_files', 'readonly');
    const filesStore = transaction.objectStore('book_files');

    const index = filesStore.index('id');
    const request = index.getAll(IDBKeyRange.only(id));

    request.onsuccess = () => {
      resolve(chunkIndex
        ? request.result.find(chunk => chunk.chunkIndex === chunkIndex)
        : request.result
      );
    };

    request.onerror = () => {
      reject(new Error('读取文件分块失败'));
    };
  });
}

// 添加解析数据
function addParseData(id: string, parseData: { lineArr: string[], heightArr: number[], chapterArr: Chapter[] }) {
  if (!db) return;

  const transaction = db.transaction('book_parseData', 'readwrite');
  const parseDataStore = transaction.objectStore('book_parseData');

  // 存储解析数据
  parseDataStore.add({ ...parseData, id });

  transaction.oncomplete = () => {
    console.log('解析数据写入成功');
  };

  transaction.onerror = () => {
    console.log('解析数据写入失败');
  };
}

// 读取解析数据
function readParseData(id: string): Promise<ClientBook> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('数据库未初始化'));
      return;
    }

    const transaction = db.transaction('book_parseData', 'readonly');
    const parseDataStore = transaction.objectStore('book_parseData');

    const request = parseDataStore.get(id);
    request.onsuccess = () => {
      if (!request.result) {
        reject(new Error('未找到解析数据'));
        return;
      }
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('读取解析数据失败'));
    };
  });
}

// 生成随机书籍 ID
function getRandomBookId() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] + '';
}

export {
  createMetadata,
  readMetadata,
  updateMetadata,
  deleteMetadata,
  readAllMetadata,
  addFileChunk,
  readFileChunk,
  addParseData,
  readParseData,
};