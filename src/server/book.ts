import { Book } from "../core/declare";
import { API_BASE_URL } from "./index";

const MODULE_NAME = '/books'
const BASE_URL = API_BASE_URL + MODULE_NAME
export const readAllBook = async (): Promise<Book[]> => {
    try {
        const response = await fetch(BASE_URL, {
            credentials: 'include', // 确保浏览器发送认证信息
        });

        if (!response.ok) {
            // 如果状态码是 401，浏览器会自动弹出认证弹窗
            throw new Error(`Failed to fetch books: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const readBook = async (id: string): Promise<Book> => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            credentials: 'include', // 确保浏览器发送认证信息
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch book with ID ${id}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching book:', error);
        throw error;
    }
};

export const createBook = async (book: Book): Promise<Book> => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
            credentials: 'include', // 确保浏览器发送认证信息
        });

        if (!response.ok) {
            throw new Error(`Failed to add book: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
            credentials: 'include', // 确保浏览器发送认证信息
        });

        if (!response.ok) {
            throw new Error(`Failed to update book with ID ${id}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};

export const deleteBook = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            credentials: 'include', // 确保浏览器发送认证信息
        });

        if (!response.ok) {
            throw new Error(`Failed to delete book with ID ${id}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};