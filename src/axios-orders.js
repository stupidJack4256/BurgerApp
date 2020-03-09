import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-burger-app-98849.firebaseio.com/'
});

export default instance;
