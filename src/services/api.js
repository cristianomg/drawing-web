import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://dbe8-2804-1b1-1290-208b-9463-8298-9315-f3a.sa.ngrok.io/api',
});
