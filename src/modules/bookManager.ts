import { add as addToLibrary } from "./indexDb";
import { Chapter } from "../core/declare";
import chardet from 'chardet';
import worker from './worker.js?worker'

const fileTypes = "text/plain";

let fileList: FileList | null = null
function handleBookChange(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  fileList = fileInput.files
  if (!fileList) return;
  const length = fileList.length
  let allPromise: Array<Promise<number>> = []
  for (let index = 0; index < length; index++) {
    const file = fileList[index]
    if (validBookType(file.type)) {
      getCharCode(file).then(encoding => {
        allPromise.push(readFile(file, encoding))
      })
    }
  }
  // for future
  Promise.all(allPromise).then(() => {
    fileInput.value = ''
  })
}


function validBookType(type: string, rules = fileTypes) {
  if (typeof rules === "string")
    return rules.indexOf(type) !== -1;
}

function readFile(textFile: File, encode: string | undefined): Promise<number> {
  return new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.readAsText(textFile, encode);
    fileReader.onload = function (event) {
      const result = event.target?.result;
      if (typeof result === 'string') {
        divideTxtContent(result, textFile.name);
      }
      resolve(1)
    };
  })

}

function getCharCode(file: File): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const buffer = event.target?.result;
      if (buffer instanceof ArrayBuffer) {
        const analyse = chardet.analyse(new Uint8Array(buffer.byteLength > 1024 ? buffer.slice(0, 1024) : buffer))
        resolve(analyse.length > 0 ? analyse[0].name : undefined)
      } else {
        resolve(undefined)
      }
    };
    fileReader.onerror = (event) => {
      reject(event)
    }
    fileReader.readAsArrayBuffer(file)
  })

}

function divideTxtContent(txtContent: string, name: string) {
  const charSet: Set<string> = new Set()
  const len = txtContent.length
  for (let index = 0; index < len; index++) {
    charSet.add(txtContent[index])
  }
  if (typeof txtContent !== "string") return;
  let paraArr = txtContent.split(/[\r\n]+/).map(para => para.replace("<br />", '').trim()).filter(para => para);
  let chapterArr = []
  if (paraArr.length > 0) {
    chapterArr = divideByChapter(paraArr);
    useWorker({ chapterArr, paraArr, charSet, name, id: '' })
  }
}

function divideByChapter(paraArr: Array<string>) {
  const patt = /^第?[两一二三四五六七八九十零百千万\d壹贰叁肆伍陆柒捌玖拾佰仟萬①②③④⑤⑥⑦⑧⑨⑩]{1,9}[卷篇章回部话集幕册计讲场节\.、](?:\s|$)/;
  const chapterArr: Array<Chapter> = [];
  if (paraArr[0].search(patt) === -1) {
    paraArr.unshift("Preface")
  }
  let cnt = 0
  paraArr.forEach((para, idx) => {
    const content = para
    if (content.search(patt) !== -1) {
      chapterArr.push({ content, idx, startLine: idx, endLine: -1 });
      cnt += content.length
    }
  });
  if (paraArr[0].search(patt) === -1) {
    chapterArr.unshift({ content: 'Preface', idx: 0, startLine: 0, endLine: -1 })
    // CWJ-TODO JS bigArr unshift performance?
  }
  chapterArr.forEach((chapter, idx) => {
    chapter.endLine = chapterArr[idx + 1]?.idx - 1
  })
  chapterArr[chapterArr.length - 1].endLine = paraArr.length - 1
  return chapterArr
}


function useWorker(book: any) {
  const myWorker = new worker();
  myWorker.onmessage = (ev) => {
    console.log('msg-from-worker', ev.data)
    const { key, val } = ev.data
    if (key === 'msHeightArr') {
      addToLibrary({ ...book, heightArr: val })
    }
    if (key)
      window[key] = val
  }

  const width = window.innerWidth
  const height = window.innerHeight
  const htmlCanvas = document.createElement("canvas");
  const offscreen = htmlCanvas?.transferControlToOffscreen();

  myWorker.postMessage({
    width,
    height,
    canvas: offscreen,
    book
  }, [offscreen]);
}

export {
  handleBookChange
}