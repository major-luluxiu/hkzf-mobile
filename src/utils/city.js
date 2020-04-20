import axios from 'axios'

// 定义个常量 将current_city存入 避免手残
const CURRENT_CITY = 'current_city'

// 把城市存入本地的方法
export function setCity(city) {
  localStorage.setItem(CURRENT_CITY, JSON.stringify(city))
}

// 这个方法是个异步的 所以需要回调函数或者封装成promise,这两者可以封装在一起
export function getCurrentCity(callback) {
  return new Promise((resolve, reject) => {
    // 优先从本地获取
    const city = JSON.parse(localStorage.getItem(CURRENT_CITY))
    if (city) {
      resolve(city)
      // 如果传了回调函数就用回调函数
      callback && callback(city)
    } else {
      // 如果本地没有 就要百度定位获取
      const positionCity = new window.BMap.LocalCity()
      positionCity.get((result) => {
        axios
          .get(`http://localhost:8080/area/info?name=${result.name}`)
          .then((res) => {
            // 把成功的结果存入本地
            const { body } = res.data
            setCity(body)
            resolve(body)
            callback && callback(body)
          })
          .catch((err) => {
            reject(err)
            callback && callback(err)
          })
      })
    }
  })
}
