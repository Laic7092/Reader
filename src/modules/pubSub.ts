type Handler = (args?: any) => any

function PubSub(all = new Map<string, Array<Handler>>()) {
    function on(type: string, handler: Handler) {
        const handlers = all.get(type)
        if (handlers) {
            handlers.push(handler)
        } else {
            all.set(type, [handler])
        }
    }
    function off(type: string, handler: Handler) {
        const handlers = all.get(type)
        if (handlers) {
            if (handler) {
                handlers.splice(handlers.indexOf(handler) >>> 0, 1)
            }
        }
    }
    function emit(type: string, evt: any) {
        const handlers = all.get(type)
        if (handlers) {
            handlers.slice().map(handler => handler(evt))
        }
    }

    return {
        all,
        on,
        off,
        emit
    }
}

export enum CRUD {
    ADD = 'add',
    REMOVE = 'remove',
    UPDATE = 'update',
    SEARCH = 'search'
}

export enum STATUS {
    READY = 'ready'
}

const bus = PubSub();

export default bus;
