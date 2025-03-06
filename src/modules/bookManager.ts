import { createMetadata, addFileChunk, addParseData } from "./indexDb";
import type { Chapter } from "../core/declare";
import chardet from 'chardet';
import worker from './worker.js?worker'
import { sha1 } from 'js-sha1';

const DEFAULT_CHARCODE = 'UTF-8'
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
async function clientImport(file: File) {
  return Promise.all([calculateHash(file), getCharCode(file)]).then(([hash, encoding]) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, encoding);
    fileReader.onload = async (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        const lineArr = getLineArrByText(result)
        const chapterArr = getChapterArrByLineArr(lineArr)
        const charSet = getCharSetByText(result)
        const chunks = await splitFileByLinesAndSize(file, 1024 * 32, encoding)
        chunks.forEach((chunk, index) => addFileChunk(hash, chunk, index))
        const heightArr = await getHeightArrByLineArr(lineArr, charSet)
        addParseData(hash, { heightArr, chapterArr, lineArr })
        createMetadata({ id: hash, name: file.name })
      }
    }

  })
}

// 文件分块
async function splitFileByLinesAndSize(file: File, blockSize: number, encoding: string = 'utf-8'): Promise<string[]> {
  console.time('splitFileByLinesAndSize');

  return new Promise((resolve, reject) => {
    const chunks: string[] = [];
    let buffer = '';
    let offset = 0;

    const reader = new FileReader();
    const textDecoder = new TextDecoder(encoding);

    reader.onload = () => {
      if (!(reader.result instanceof ArrayBuffer)) {
        reject(new Error('Failed to read file as ArrayBuffer.'));
        return;
      }

      // 使用 TextDecoder 解码 ArrayBuffer
      const text = textDecoder.decode(reader.result, { stream: true });
      buffer += text;

      // 检查缓冲区是否超过块大小
      while (buffer.length >= blockSize) {
        // 查找最后一个换行符的位置
        let lastNewlineIndex = buffer.lastIndexOf('\n', blockSize);
        if (lastNewlineIndex === -1) {
          lastNewlineIndex = buffer.lastIndexOf('\r\n', blockSize);
        }

        // 如果找到换行符，切割并生成一个块
        if (lastNewlineIndex !== -1) {
          const validChunk = buffer.slice(0, lastNewlineIndex + 1);
          chunks.push(validChunk);
          buffer = buffer.slice(lastNewlineIndex + 1); // 保留剩余部分
        } else {
          // 如果没有找到换行符，直接按块大小切割（可能破坏行完整性）
          const validChunk = buffer.slice(0, blockSize);
          chunks.push(validChunk);
          buffer = buffer.slice(blockSize);
        }
      }

      // 继续读取下一块
      offset += blockSize;
      if (offset < file.size) {
        const blob = file.slice(offset, offset + blockSize);
        reader.readAsArrayBuffer(blob);
      } else {
        // 返回剩余的缓冲区内容
        if (buffer) {
          chunks.push(buffer);
        }
        resolve(chunks);
        console.timeEnd('splitFileByLinesAndSize');
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    // 开始读取第一块
    const blob = file.slice(offset, offset + blockSize);
    reader.readAsArrayBuffer(blob);
  });
}

// 计算文件hash
async function calculateHash(file: File): Promise<string> {
  console.time('hash')
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        try {
          const hash = sha1(reader.result)
          resolve(hash);
        } catch (error) {
          console.error(error)
          reject(new Error('Failed to calculate SHA-1 hash.'));
        }
      } else {
        reject(new Error('Failed to read file as ArrayBuffer.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    // 读取整个文件为 ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
}

async function getCharCode(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const buffer = event.target?.result;
      if (buffer instanceof ArrayBuffer) {
        const analyse = chardet.analyse(new Uint8Array(buffer.byteLength > 1024 ? buffer.slice(0, 1024) : buffer))
        resolve(analyse.length > 0 ? analyse[0].name : DEFAULT_CHARCODE)
      } else {
        resolve(DEFAULT_CHARCODE)
      }
    };
    fileReader.onerror = (event) => {
      reject(event)
    }
    fileReader.readAsArrayBuffer(file)
  })

}

// 从text获取所有line
function getLineArrByText(text: string) {
  return text.split(/[\r\n]+/).map(para => para.replace("<br />", '').trim()).filter(para => para);
}

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
async function getHeightArrByLineArr(lineArr: string[], charSet: Set<string>): Promise<number[]> {
  return new Promise((resolve) => {
    const width = window.innerWidth - 4 * REM_PX
    const height = window.innerHeight
    const htmlCanvas = document.createElement("canvas");
    const offscreen = htmlCanvas?.transferControlToOffscreen();

    const myWorker = new worker();
    myWorker.onmessage = (ev) => {
      const { key, val } = ev.data
      key === 'msHeightArr' && resolve(val)
      key && (window[key] = val)
      console.log('msg-from-worker', ev.data)
    }

    myWorker.postMessage({
      width,
      height,
      canvas: offscreen,
      lineArr,
      charSet
    }, [offscreen]);
  })
}