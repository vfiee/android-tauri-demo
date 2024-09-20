import { useAppStore } from '@/store'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { get, set } from 'lodash-es'
import type { UseAxiosOptions } from './useAxios'
import { useAxios as vueUseAxios } from './useAxios'

interface CustomAxiosRequestConfig<D = any>
  extends Partial<InternalAxiosRequestConfig<D>> {
  module?: string
  showFailToast?: boolean
}

export const instance = axios.create({
  timeout: 10000,
  adapter: 'fetch',
  timeoutErrorMessage: '请求超时',
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // @ts-expect-error 导入module字段
  const { module: requestModule = 'common', url } = config ?? {}
  const { currentEnv, isLogin, userHeader } = useAppStore()
  const envModule = get(currentEnv, `modules.${requestModule}`)
  if (isLogin) {
    set(config.headers, 'Authorization', userHeader)
  }
  // 如果请求地址以 http 开头,默认不处理(和 axios 保持一致)
  if (url && url.startsWith('http')) return config
  config.url = `${envModule.url}${url}`
  return config
})

function onRejected(error: any) {
  if (error?.name === 'CanceledError') return error
  const isShowFailToast = get(error, 'config.showFailToast', true)
  const { data, statusText } = error?.response || error || {}
  const { code, message: businessMessage } = data || {}
  let messageText = businessMessage || statusText || '发生错误'
  if (code === 401) {
    const appStore = useAppStore()
    messageText = '登录超时,请重新登录'
    appStore.setUserInfo()
  }
  showDialog({ message: JSON.stringify(error) })
  isShowFailToast && showFailToast(messageText)
  return Promise.reject(error)
}

instance.interceptors.response.use(
  (response: any) => {
    const data = get(response, 'data')
    if (data?.code !== 1) {
      return onRejected(response)
    }
    return data
  },
  (error) => {
    showDialog({ message: `报错了：` + JSON.stringify(error) })
    return onRejected(error.response || error)
  }
)

export function useAxios<T = any, R = AxiosResponse<T>, D = any>(
  config: CustomAxiosRequestConfig<D>,
  options?: UseAxiosOptions
) {
  return vueUseAxios<T, R, D>(config?.url!, config, instance, {
    immediate: false,
    ...(options || {})
  })
}
