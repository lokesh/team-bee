import axios from 'axios'

const baseURL = (process.env.NODE_ENV === 'development')
  ? 'http://localhost:3000/api'
  : 'https://teambee.live/api'

export default axios.create({
  baseURL,
}) 