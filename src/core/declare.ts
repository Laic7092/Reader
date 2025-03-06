export interface BookUtils {
    closeReader: () => void
    changeFontSize: (param: string) => void
    getCurBook: () => ClientBook
    jumpChapter: (index: number) => void
    getChapterIdx: () => number
}

export interface Chapter {
    idx: number
    content: string
    startLine: number
    endLine: number
}

export interface BookMark {
    bookId: string
    chapterId: string
    paraId: string
}

export interface Book {
    id: string
    name: string
    chapterArr: Array<Chapter>
    createTm: number
    chunkNum: number
    updateTm?: number
    lineArr?: Array<string>
    charSet?: Set<string>
    heightArr?: Array<number>
    bookMarks?: Array<BookMark>
}

export type ClientBook = Required<Omit<Book, 'bookMarks'>>

export enum CRUD {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
}

export enum STATUS {
    READY = 'READY'
}

export enum Origin {
    client,
    server
}

export interface Msg {
    height: number,
    width: number,
    canvas: OffscreenCanvas,
    lineArr: string[],
    charSet: Set<string>
}

export interface Chunk {
    id: string
    chunk: string
    chunkIndex: number
}

export interface Log {
    type: "CREATE" | "DELETE" | "UPDATE";
    collection: string;
    id_ref: string;
    id: string;
    timestamp: string;
    details: string | null;
}

// interface MetaData {
//     title: string
//     author: string
//     id: any
//     [key: string]: any
// }

// interface Section {
//     load: () => string
//     unload: () => void
//     size: number
//     linear: string
//     cfi: string
//     id: any
// }