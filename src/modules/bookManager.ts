import { createMetadata, addFileChunk, addParseData } from "./indexDb";
import { Origin, type Book, type Chapter } from "../core/declare";
// import worker from './worker.js?worker'
import { getCharCode, calculateHash, splitTextFileByLine } from "../utils/utils";
import { getChunk } from "../server/book";
import { createHeightCalculator } from "./calc";

const REM_PX = 16

let fileList: FileList | null = null
export function handleBookChange(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  fileList = fileInput.files
  if (!fileList) return;
  const length = fileList.length
  let allPromise: Array<Promise<number>> = []
  for (let index = 0; index < length; index++) {
    const file = fileList[index]
    clientImport(file)
  }
  // for future
  Promise.all(allPromise).then(() => {
    fileInput.value = ''
  })
}

// 客户端导入-全部解析并且存库
async function clientImport(file: File, origin = Origin.client) {
  const buffer = await file.arrayBuffer()
  return Promise.all([calculateHash(buffer), getCharCode(buffer)]).then(([hash, encoding]) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, encoding);
    fileReader.onload = async (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        const lineArr = getLineArrByText(result)
        const chapterArr = getChapterArrByLineArr(lineArr)
        const charSet = getCharSetByText(result)
        const chunks = splitTextFileByLine(buffer, 1024 * 256, encoding)
        chunks.forEach((chunk, index) => addFileChunk(hash, chunk, index))
        const chapterIdxSet = new Set(chapterArr.map(chapter => chapter.idx))
        // const heightArr = await getHeightArrByLineArr(lineArr, charSet, chapterIdxSet)
        const heightArr = await getHeightArrByLineArr(lineArr, charSet, chapterIdxSet)
        addParseData(hash, { heightArr, lineArr })
        createMetadata({ id: hash, name: file.name, createTm: Date.now(), chapterArr, chunkNum: chunks.length }, origin)
      }
    }

  })
}

export async function serverImport(metadata: Book) {
  const { chunkNum, id } = metadata
  const buffers = []
  for (let index = 0; index < chunkNum; index++) {
    const buffer = await getChunk(id, index)
    buffers.push(buffer)
  }
  clientImport(new File(buffers, metadata.name), Origin.server)
}

const linehandler = (line: string) =>
  line.replace(/<br\s*\/?>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

// 从 text 获取所有 line
const getLineArrByText = (text: string) =>
  text.split(/[\r\n]+/)
    .map(linehandler)
    .filter(para => para)

// 从text获取charSet
function getCharSetByText(text: string): Set<string> {
  const charSet: Set<string> = new Set()
  const len = text.length
  for (let index = 0; index < len; index++) {
    charSet.add(text[index])
  }
  for (const element of "Preface") {
    charSet.add(element)
  }
  return charSet
}

// 从lineArr获取chapterArr
function getChapterArrByLineArr(lineArr: Array<string>) {
  const patt = /^第?[两一二三四五六七八九十零百千万\d壹贰叁肆伍陆柒捌玖拾佰仟萬①②③④⑤⑥⑦⑧⑨⑩]{1,9}[卷篇章回部话集幕册计讲场节\.、](?:\s|$)/;
  const chapterArr: Array<Chapter> = [];
  if (lineArr[0].search(patt) === -1) {
    lineArr.unshift("Preface")
  }
  let cnt = 0
  lineArr.forEach((para, idx) => {
    const content = para
    if (content.search(patt) !== -1) {
      chapterArr.push({ content, idx, startLine: idx, endLine: -1 });
      cnt += content.length
    }
  });
  if (lineArr[0].search(patt) === -1) {
    chapterArr.unshift({ content: 'Preface', idx: 0, startLine: 0, endLine: -1 })
    // CWJ-TODO JS bigArr unshift performance?
  }
  chapterArr.forEach((chapter, idx) => {
    chapter.endLine = chapterArr[idx + 1]?.idx - 1
  })
  chapterArr[chapterArr.length - 1].endLine = lineArr.length - 1
  return chapterArr
}

// 根据设备宽度以及默认样式计算每行的渲染高度
async function getHeightArrByLineArr(lineArr: string[], charSet: Set<string>, chapterIdxSet: Set<number>): Promise<number[]> {
  return new Promise((resolve) => {
    console.log(charSet, chapterIdxSet);

    const width = getComputedStyle(document.documentElement).width
    const maxWidth = Math.min(parseFloat(width) - 4 * REM_PX, 720)
    const height = window.innerHeight

    createHeightCalculator({
      lineArray: lineArr,
      chapterIdxSet,
      styleConfig: {
        fontSize: 20,
        lineHeight: 1.5
      },
      deviceSize: {
        width: maxWidth,
        height
      }
    }).then(resolve)

    // const htmlCanvas = document.createElement("canvas");
    // const offscreen = htmlCanvas?.transferControlToOffscreen();

    // const myWorker = new worker();
    // myWorker.onmessage = (ev) => {
    //   const { key, val } = ev.data
    //   key === 'msHeightArr' && resolve(val)
    // }
    // myWorker.postMessage({
    //   width: maxWidth,
    //   height,
    //   canvas: offscreen,
    //   lineArr,
    //   chapterIdxSet,
    //   charSet
    // }, [offscreen]);
  })
}