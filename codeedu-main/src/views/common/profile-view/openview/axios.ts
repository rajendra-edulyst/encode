import axios from 'axios'
import { SVC_API_BASE_URL } from '../config'

const OpenPortfolioApiService = axios.create({
  baseURL: SVC_API_BASE_URL,
  timeout: 10000,
})

// Request interceptor to attach headers
OpenPortfolioApiService.interceptors.request.use((config) => {
  return config
})

export default OpenPortfolioApiService
