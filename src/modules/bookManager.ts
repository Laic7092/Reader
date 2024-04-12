import { add as addToLibrary } from "./indexDb.js";
import { Chapter } from "./indexDb.js";
import chardet from 'chardet';

let fileTypes = "text/plain";
let curBookName = '';

function handleBookChange(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  const fileList = fileInput.files
  if (!fileList || fileList.length <= 0) return;
  let curFile = fileList[0];
  curBookName = curFile.name;
  if (validBookType(curFile.type)) {
    getCharCode(curFile).then(encoding => {
      readFile(curFile, encoding);
    })
  }
}

function validBookType(type: string, rules = fileTypes) {
  if (typeof rules === "string")
    return rules.indexOf(type) !== -1;
}

function readFile(textFile: File, encode: string | undefined) {
  let fileReader = new FileReader();
  fileReader.onload = function (event) {
    const result = event.target?.result;
    if (typeof result === 'string')
      divideTxtContent(result);
  };
  fileReader.readAsText(textFile, encode);
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

function divideTxtContent(txtContent: string) {
  if (typeof txtContent !== "string") return;
  let paraArr = txtContent.split(/[\r\n]+/);
  let chapterArr = []
  if (paraArr.length > 0) {
    chapterArr = divideByChapter(paraArr);
    addToLibrary({ chapterArr, paraArr, name: curBookName, id: '' })
  }
}

function divideByChapter(paraArr: Array<string>) {
  const patt = /^第?[两一二三四五六七八九十零百千万\d壹贰叁肆伍陆柒捌玖拾佰仟萬①②③④⑤⑥⑦⑧⑨⑩]{1,9}[卷篇章回部话集幕册计讲场节](?:\s|$)/;
  let chapterArr: Array<Chapter> = [];
  let cnt = 0
  paraArr.forEach((para, idx) => {
    const content = para.trim()
    if (content.search(patt) !== -1) {
      chapterArr.push({ content, idx });
      cnt += content.length
    }
  });
  let abc = Math.floor(cnt / chapterArr.length)
  return chapterArr.filter(chapter => {
    let a = Math.abs(chapter.content.length - abc)
    return a <= 7
  })
}

export {
  handleBookChange
}