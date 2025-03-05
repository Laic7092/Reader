export let API_BASE_URL = localStorage.getItem('API_BASE_URL') || ''
if (!API_BASE_URL) {
    setBaseUrl()
}

export function checkConfig() {
    if (!API_BASE_URL) {
        setBaseUrl()
    }
}

export function setBaseUrl() {
    API_BASE_URL = window.prompt("输入服务器地址", "http://localhost:3000") as string
    localStorage.setItem('API_BASE_URL', API_BASE_URL)
}

interface Log {
    id_ref: string,
    timestamp: number
    type: string
}

export const getOperateLog = async (): Promise<Log[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/operation-log`, {
            credentials: 'include', // 确保浏览器发送认证信息
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