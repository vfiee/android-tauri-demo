// @ts-nocheck

import _axios from 'axios'
import { get } from 'lodash-es'

export { _axios }

export const axios = _axios.create({
  timeout: 10000,
  baseURL: `https://sun-platform.vfiee.cn`,
  adapter: 'fetch',
  timeoutErrorMessage: '请求超时',
  headers: {
    'Content-Type': 'application/json'
  }
})

// @ts-ignore
function onRejected(error) {
  const msg = get(error, 'data.msg') || '请求错误'
  closeToast()
  showFailToast({ message: msg })
}

axios.interceptors.response.use(
  (response) => {
    const runInterceptor = get(response, 'config.interceptor')
    const data = get(response, 'data')
    if (runInterceptor === false) return data
    if (get(response, 'data.code') !== 1) {
      onRejected(response)
      return Promise.reject(response)
    }
    return data
  },
  (error) => {
    console.log(`error:`, error)
    onRejected(get(error, 'response') || error)
    return Promise.reject(error)
  }
)
