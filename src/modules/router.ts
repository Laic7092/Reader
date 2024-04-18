const hashStack: Array<string> = []

export function routeTo(path: string) {
    hashStack.push(window.location.hash)
    window.location.hash = '#' + path
}

export function routeBack() {
    window.location.hash = hashStack.pop() || '#/'
}