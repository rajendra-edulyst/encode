import AxiosBase from './axios/AxiosBase'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import NodeBase from './axios/NodeBase'

const ApiService = {
    /**
     * `Request` types the request `data` field (Axios). Default `any` so JSON, FormData, etc. all work.
     * Do not use `Record<string, unknown>` here — it rejects `FormData`.
     */
    fetchDataWithAxios<Response = unknown, Request = any>(param: AxiosRequestConfig<Request>) {
        return new Promise<Response>((resolve, reject) => {
            AxiosBase(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response.data)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },


    fetchDataWithNode<Response = unknown, Request = any>(param: AxiosRequestConfig<Request>) {
        return new Promise<Response>((resolve, reject) => {
            NodeBase(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response.data)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },
}

export default ApiService
