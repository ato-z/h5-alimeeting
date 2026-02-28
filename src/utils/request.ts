import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: 'https://mini.techx-world.com/',
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等请求头
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    // 统一错误处���
    const message = error.response?.data?.message || error.message || '请求失败';
    console.error('Request Error:', message);
    return Promise.reject(error);
  }
);

// 通用请求方法，支持泛型
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return instance(config);
}

// 导出 instance 以便需要时可以直接使用
export default instance;
