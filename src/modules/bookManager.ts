import library from "./indexDb.js";
import chardet from 'chardet';

let fileTypes = "text/plain";
let currentBookName = '';

let books = new Map();
library.openOrCreatIDB().then((db) => {
  library.readAll().then((res) => {
    console.log("allFiles", res)
  })
})
function renderBookshelf(allBooks) {
  allBooks.forEach(element => {
    books.set(element.id, element.bookData)
  })
  let ul = document.createElement('ul');
  ul.addEventListener('click', e => {
    let id = e.target.id;//需要注意的一点就是,从这里拿到的id已经是string了
    //console.log(id,books.get(id))
    let bookData = books.get(id);
    let { chapterArr, paraArr } = bookData;
    if (Array.isArray(chapterArr) && chapterArr.length > 0) {
      renderCatelog(chapterArr);
      renderContentByChapters(chapterArr, paraArr)
    }
    else {
      renderContentByLines(paraArr)
    }
  })
  let fragment = document.createDocumentFragment();
  allBooks.forEach(element => {
    let li = document.createElement('li');
    li.innerText = element.bookData.bookName;
    li.setAttribute('id', element.id);
    fragment.appendChild(li);
  })
  ul.appendChild(fragment);
  let bookshelf = document.body.querySelector('#bookshelf');
  bookshelf.appendChild(ul)
}


function handleBookChange(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  const fileList = fileInput.files
  if (!fileList || fileList.length <= 0) return;
  let curFile = fileList[0];
  currentBookName = curFile.name;
  if (validBookType(curFile.type)) {
    getCharCode(curFile).then(encoding => {
      getAddedBook(curFile, encoding);
    })
  }
}

function validBookType(type, rules = fileTypes) {
  if (typeof rules === "string")
    return rules.indexOf(type) !== -1;
}

function getAddedBook(addedBook, encode) {
  let fileReader = new FileReader();
  fileReader.onload = function (event) {
    let result = event.target.result;
    divideTxtContent(result);
  };
  fileReader.readAsText(addedBook, encode);
}

function getCharCode(file: File) {
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

function divideTxtContent(txtContent) {
  console.log(`${txtContent}`)
  if (typeof txtContent !== "string")
    return;
  let paraArr = txtContent.split(/[\r\n]+/);
  let chapterArr = []
  if (paraArr.length > 0) {
    //renderContentByLines(paraArr);
    chapterArr = divideByChapter(paraArr);
    addToLibrary({ chapterArr, paraArr, bookName: currentBookName })
  }
}

function divideByChapter(paraArr) {
  const patt = /^\s*第{0,1}[两一二三四五六七八九十零百千万\d壹贰叁肆伍陆柒捌玖拾佰仟萬①②③④⑤⑥⑦⑧⑨⑩]{1,6}[卷篇章回部话集幕册计讲场节]([^\pP]{0,15})$/;
  let chapterArr = [];
  // let startLine = 0, endLine = 0;
  let cnt = 0
  paraArr.forEach((element, idx) => {
    let match = patt.exec(element)
    if (match) {
      // chapterArr.push({ chapterName: element, startLine, endLine, match });
      chapterArr.push({ chapterName: element, });
      cnt += element.length
    }
  });
  let abc = Math.floor(cnt / chapterArr.length)
  return chapterArr.filter(item => {
    let a = Math.abs(item.chapterName.length - abc)
    console.log(a)
    return a <= 7
  })
}

function renderContentByLines(paraArr) {
  let fragment = document.createDocumentFragment()
  for (let index = 0; index < paraArr.length; index++) {
    const element = paraArr[index];
    let p = document.createElement('p');
    p.innerText = element;
    fragment.appendChild(p)
  }
  // }

  let main = document.querySelector('#main')
  main.appendChild(fragment)
}

function renderContentByChapters(chapterArr, paraArr) {
  let fragment = document.createDocumentFragment()
  chapterArr.forEach((element, idx) => {
    let { startLine, endLine, chapterName, match } = element
    let h2 = document.createElement('h2');
    h2.setAttribute('id', `${match[0]}`)
    h2.innerText = chapterName;
    fragment.appendChild(h2);
    for (let index = startLine + 1; index < endLine; index++) {
      const element = paraArr[index];
      let p = document.createElement('p');
      p.innerText = element;
      fragment.appendChild(p)
    }
  })
  let main = document.querySelector('#main')
  main.appendChild(fragment)
}

function renderCatelog(chapterArr) {
  let ul = document.createElement('ul');
  chapterArr.forEach((element, idx) => {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute('href', `#${element.match[0]}`);
    a.setAttribute('class', "catelogEle")
    a.innerText = element.chapterName;
    li.appendChild(a)
    ul.appendChild(li)
  })
  let main = document.querySelector('#main');
  document.body.insertBefore(ul, main);
}

function addToLibrary(bookData) {
  library.add(bookData)
}


export {
  handleBookChange
}