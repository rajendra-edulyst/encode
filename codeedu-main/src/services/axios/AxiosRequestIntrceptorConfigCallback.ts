import appConfig from '@/configs/app.config'
import {
    TOKEN_TYPE,
    REQUEST_HEADER_AUTH_KEY,
    TOKEN_NAME_IN_STORAGE,
    CONTENT_TYPE_JSON,
    NLMS_API_KEY,
} from '@/constants/api.constant'
import type { InternalAxiosRequestConfig } from 'axios'
import cookiesStorage from '@/utils/cookiesStorage'

const AxiosRequestIntrceptorConfigCallback = (
    config: InternalAxiosRequestConfig,
) => {
    const storage = appConfig.accessTokenPersistStrategy

    if (config.headers['Content-Type'] == 'undefined') {
        config.headers['Content-Type'] = CONTENT_TYPE_JSON
    }
    config.headers['nlms-api-key'] = NLMS_API_KEY

    if (storage === 'localStorage' || storage === 'sessionStorage' || storage === 'cookies') {
        let accessToken = null;

        if (storage === 'localStorage') {
            accessToken = localStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''
        }

        if (storage === 'sessionStorage') {
            accessToken = sessionStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''
        }

        if (storage === 'cookies') {
            accessToken = cookiesStorage.getItem(TOKEN_NAME_IN_STORAGE);
        }

        if (accessToken) {
            config.headers[REQUEST_HEADER_AUTH_KEY] =
                `${TOKEN_TYPE}${accessToken}`
        }
    }

    return config
}

export default AxiosRequestIntrceptorConfigCallback
