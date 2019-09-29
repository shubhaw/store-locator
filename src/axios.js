import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://us-central1-shubhaw-store-locator.cloudfunctions.net/api'
});

export default instance;