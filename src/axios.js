import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://testapi.qeplahore.com'
});

export default instance;