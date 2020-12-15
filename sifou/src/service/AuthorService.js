import axios from './config/axios.default.config'
import defaultConfig from '@/config/config.default'

class AuthorService{

  //用户注册
  async registerUser(userData){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/registerUser`,userData)
  }

   //用户登录
   async loginUser(userData){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/loginUser`,userData)
  }

  //用户令牌验证
  async checkPermission(){
    return axios.get(`${defaultConfig.baseApiUrl}/authentication/checkPermission`)
  }
}

export default new AuthorService()