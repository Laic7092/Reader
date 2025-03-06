import type { Log } from "../core/declare"

const AUTH_KEY = 'Authorization'

export let API_BASE_URL = localStorage.getItem('API_BASE_URL') || ''
if (!API_BASE_URL) {
    setBaseUrl()
}

export function checkConfig() {
    if (!API_BASE_URL) {
        setBaseUrl()
    }
}

export const myFetch = (url: string, init?: RequestInit): Promise<Response> => {
    if (localStorage.getItem(AUTH_KEY) === null) {
        const token = window.prompt('请输入Basic ')
        token && localStorage.setItem(AUTH_KEY, token)
    }
    let _init = init || {}
    _init.headers = {
        ...(_init.headers || {}),
    }
    // @ts-ignore
    _init.headers[AUTH_KEY] = localStorage.getItem(AUTH_KEY)
    // @ts-ignore
    delete init.headers.credentials
    return fetch(url, init)
}

export function setBaseUrl() {
    API_BASE_URL = window.prompt("输入服务器地址", "http://localhost:3000") as string
    localStorage.setItem('API_BASE_URL', API_BASE_URL)
}

export const getOperateLog = async (): Promise<Log[]> => {
    try {
        const response = await myFetch(`${API_BASE_URL}/operation-log`, {
            credentials: 'include', // 确保浏览器发送认证信息
            headers: {
                'Authorization': "Basic bGFpeDpjd2o3MDkyLi4u"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};