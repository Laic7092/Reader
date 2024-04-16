window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
})

function disableIosSafariCallout(this: Window) {
    const s = this.getSelection()
    if (!s || s.type === 'None') return
    let r = s.getRangeAt(0);
    s.removeAllRanges()
    this.setTimeout(() => {
        r && s.addRange(r);
    }, 30)
}

if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
    document.ontouchend = disableIosSafariCallout.bind(window);
}