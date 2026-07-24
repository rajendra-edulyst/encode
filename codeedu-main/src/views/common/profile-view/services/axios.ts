import axios from 'axios'
import { SVC_API_BASE_URL, getFrontendKey } from '../config'

const PortfolioApiService = axios.create({
  baseURL: SVC_API_BASE_URL,
  timeout: 10000,
})

// Request interceptor to attach headers
PortfolioApiService.interceptors.request.use((config) => {
  const editKey = localStorage.getItem('editKey')
  const { FRONTEND_KEY } = getFrontendKey()

  if (config.headers) {
    if (FRONTEND_KEY) {
      config.headers['x-frontend-key'] = FRONTEND_KEY
    }
    if (editKey) {
      config.headers['editKey'] = editKey
    }
  }

  return config
})

export default PortfolioApiService
