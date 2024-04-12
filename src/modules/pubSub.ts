import mitt from "mitt";

export enum CRUD {
    ADD = 'add',
    REMOVE = 'remove',
    UPDATE = 'update',
    SEARCH = 'search'
}

export enum STATUS {
    READY = 'ready'
}

const bus = mitt();

export default bus;
