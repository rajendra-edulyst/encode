import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type {
    PaymentCreateRequest,
    PaymentCreateResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse
} from '@/@types/payment'

export async function apiCreatePayment(data: PaymentCreateRequest) {
    const formData = new FormData()
    formData.append('gateway', data.gateway)
    formData.append('amount', data.amount.toString())
    formData.append('firstname', data.firstname)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('productinfo', data.productinfo)
    if (data.surl) formData.append('surl', data.surl)
    if (data.furl) formData.append('furl', data.furl)

    return ApiService.fetchDataWithAxios<PaymentCreateResponse>({
        url: endpointConfig.paymentCreate,
        method: 'post',
        data: formData as any,
    })
}

export async function apiVerifyPayment(data: PaymentVerifyRequest) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });

    return ApiService.fetchDataWithAxios<PaymentVerifyResponse>({
        url: endpointConfig.paymentVerify,
        method: 'post',
        data: formData as any,
    })
}

export async function apiPaymentHistory() {
    return ApiService.fetchDataWithAxios<any>({
        url: endpointConfig.paymentHistory,
        method: 'post'
    })
}
