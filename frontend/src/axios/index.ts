import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

// const token = '';

// instance.defaults.headers.common['Authorization'] = `Token ${token}`;
instance.defaults.headers.common['Content-Type'] = 'application/json';

export default instance;