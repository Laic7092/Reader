window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
})

function disableIosSafariCallout(this: Window, event: any) {
    const s = this.getSelection();
    if ((s?.rangeCount || 0) > 0) {
        const r = s?.getRangeAt(0);
        s?.empty()
        setTimeout(() => {
            s?.addRange(r!);
        }, 50);
    }
}
document.ontouchend = disableIosSafariCallout.bind(window);