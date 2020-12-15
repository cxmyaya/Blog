import axios from 'axios'

if(sessionStorage.getItem('Authorization')){
  axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('Authorization') //添加令牌
}

export default axios