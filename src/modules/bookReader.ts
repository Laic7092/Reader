function renderBookshelf(allBooks) {
    allBooks.forEach(element => {
        books.set(element.id, element.bookData)
    })
    let ul = document.createElement('ul');
    ul.addEventListener('click', e => {
        let id = e.target.id;//需要注意的一点就是,从这里拿到的id已经是string了
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
    main && main.appendChild(fragment)
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