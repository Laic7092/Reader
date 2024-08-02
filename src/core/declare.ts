// interface Book {
//     sections: Array<Section>
//     metaData: MetaData
// }

export interface BookUtils {
    closeReader: () => void
    changeFontSize: (param: string) => void
    curBook: () => Book
    jumpChapter: (index: number) => void
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
    paraArr: Array<string>
    charSet: Set<string>
    heightArr: Array<number>
    bookMarks?: Array<BookMark>
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