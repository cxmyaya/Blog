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

   //用户更新信息
   async updateUserInfo(userData){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/updateUserInfo`,userData)
  }

  //获取用户信息
  async getUserInfo(){
    return axios.get(`${defaultConfig.baseApiUrl}/authentication/getUserInfo`)
  }

  //获取未审核的用户
  async getUnapprovedUserList(params){
    return axios.get(`${defaultConfig.baseApiUrl}/authentication/getUnapprovedUsers`,{params})
  }

  
  //获取所有用户
  async getAllUser(params){
    return axios.get(`${defaultConfig.baseApiUrl}/authentication/getAllUser`,{params})
  }

  //审核通过用户注册申请
  async approvedUser(data){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/approvedUser`,data)
  }

   //不通过用户注册申请
   async deleteUser(data){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/deleteUser`,data)
  }

   //设置/取消管理员权限
   async setAdmin(data){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/setAdmin`,data)
  }

    //是否冻结账号
    async setApproved(data){
      return axios.post(`${defaultConfig.baseApiUrl}/authentication/setApproved`,data)
    }

    //获取用户注册信息
    async getUserRegisterInfo(){
      return axios.get(`${defaultConfig.baseApiUrl}/authentication/getUserRegisterInfo`)
    }

    //获取文章发布数据
    async getBlogInfo(){
      return axios.get(`${defaultConfig.baseApiUrl}/authentication/getBlogInfo`)
    }
}

export default new AuthorService()