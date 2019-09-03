/**
 * axios拦截器
 */
import axios from 'axios'
// 判断开发模式
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = process.env.VUE_APP_URL;
}
else if (process.env.NODE_ENV === 'debug') {
  axios.defaults.baseURL = process.env.VUE_APP_URL;
}
else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = process.env.VUE_APP_URL;
}

// 全局设置头部信息
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.headers.post['token'] = '123456789';

// 全局设置超时时间
axios.defaults.timeout = 10000;

// 请求拦截
axios.interceptors.request.use(function (config) {
  // 判断那些接口需要添加token，那些接口需要添加请求类型，判断token是否存在
  if (!(config.url.includes('/login'))) {
    config.headers.post['token'] = '456';
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 响应拦截
axios.interceptors.response.use(function (response){
  // 处理响应数据
  if (response.status === 200) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
}, function (error){
  // 处理响应失败
  return Promise.reject(error);
});

// 封装get请求
export function get(url, params){
  return new Promise((resolve, reject) =>{
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data);
    }).catch(err =>{
      reject(err.data)
    })
  });
}

// 封装post请求
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err =>{
        reject(err.data)
      })
  });
}
