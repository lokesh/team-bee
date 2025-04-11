import axios from 'axios';

const baseURL = (process.env.NODE_ENV === 'development')
  ? 'http://localhost:3000/api'
  : 'https://team-bee-api.herokuapp.com/api';

export default axios.create({
  baseURL,
});
