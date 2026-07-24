import { useSessionUser, useToken } from '@/store/authStore'
import type { AxiosError } from 'axios'
import { mixpanelService } from '@/services/mixpanel/MixpanelService'

const unauthorizedCode = [401, 419, 440, 403]

const AxiosResponseIntrceptorErrorCallback = (error: AxiosError) => {
    const { response } = error
    const { setToken } = useToken()

    mixpanelService.track('API Request Failed', {
        url: error.config?.url,
        method: error.config?.method,
        status: response?.status,
        message: error.message
    })

    if (response && unauthorizedCode.includes(response.status)) {
        setToken('')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        useSessionUser.getState().setUser({} as any)
        useSessionUser.getState().setSessionSignedIn(false)
    }
}

export default AxiosResponseIntrceptorErrorCallback
