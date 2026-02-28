import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

const instance = axios.create({
  baseURL: 'https://mini.techx-world.com/',
  timeout: 10000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status !== 200 || response.data.code !== 200) {
      throw new Error(response.data.message || '请求失败')
    }
    return response.data
  },
  (error) => {
    const message = error.response?.data?.msg || error.message || '请求失败'
    console.error('Request Error:', message)
    return Promise.reject(error)
  }
)

// 通用请求方法，支持泛型
export async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  const data = await instance(config)
  return data.data as T
}

// 导出 instance 以便需要时可以直接使用
export default instance
