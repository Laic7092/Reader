import { add as addToLibrary } from "./indexDb.js";
import { Chapter } from "./indexDb.js";
import chardet from 'chardet';

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
  if (typeof txtContent !== "string") return;
  let paraArr = txtContent.split(/[\r\n]+/).map(para => para.replace("<br />", '').trim()).filter(para => para);
  let chapterArr = []
  if (paraArr.length > 0) {
    chapterArr = divideByChapter(paraArr);
    addToLibrary({ chapterArr, paraArr, name, id: '' })
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
  const average = Math.floor(cnt / chapterArr.length)
  const res = chapterArr.filter(chapter => Math.abs(chapter.content.length - average) <= 7)
  if (paraArr[0].search(patt) === -1) {
    res.unshift({ content: 'Preface', idx: 0, startLine: 0, endLine: -1 })
    // CWJ-TODO JS bigArr unshift performance?
  }
  res.forEach((chapter, idx) => {
    chapter.endLine = res[idx + 1]?.idx - 1
    // jsu a try ,may be useful?
    // paraArr[chapter.idx] = "wait for catelog!"
  })
  return res
}

export {
  handleBookChange
}