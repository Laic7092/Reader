type Handler = (...args: any) => any

type BusKey = string | number

function PubSub(all = new Map<BusKey, Array<Handler>>()) {
    function on(type: BusKey, handler: Handler) {
        const handlers = all.get(type)
        if (handlers) {
            handlers.push(handler)
        } else {
            all.set(type, [handler])
        }
    }
    function off(type: BusKey, handler: Handler) {
        const handlers = all.get(type)
        if (handlers) {
            if (handler) {
                handlers.splice(handlers.indexOf(handler) >>> 0, 1)
            }
        }
    }
    function emit(type: BusKey, ...evt: any) {
        const handlers = all.get(type)
        if (handlers) {
            handlers.slice().map(handler => handler(...evt))
        }
    }

    return {
        all,
        on,
        off,
        emit
    }
}

const bus = PubSub();

export default bus;
