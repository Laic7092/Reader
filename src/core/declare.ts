interface Book {
    sections: Array<Section>
    metaData: MetaData
}

interface MetaData {
    title: string
    author: string
    id: any
    [key: string]: any
}

interface Section {
    load: () => string
    unload: () => void
    size: number
    linear: string
    cfi: string
    id: any
}