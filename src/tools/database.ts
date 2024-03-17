import type { user } from '../types/user';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';

async function add_user(user: user) {
    try {
        const response = await axios.post('/users', user);
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function get_user(id: string) {
    try {
        const response = await axios.get(`/users/${id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function update_user(id: string, user: user) {
    try {
        const response = await axios.post(`/users/${id}`, user);
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function delete_user(id: string) {
    try {
        const response = await axios.delete(`/users/${id}/delete`);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export { add_user, get_user, update_user, delete_user };
