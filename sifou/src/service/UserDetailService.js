import axios from './config/axios.default.config'
import defaultConfig from '@/config/config.default'

class UserDetailService{
  //点赞
  async setLike(params){
    return axios.post(`${defaultConfig.baseApiUrl}/userDetail/likes`,params)
  }

  //取消点赞
  async deleteLike(params){
    return axios.delete(`${defaultConfig.baseApiUrl}/userDetail/likes/${params.blogId}`)
  }

   //关注
   async setAttention(params){
    return axios.post(`${defaultConfig.baseApiUrl}/userDetail/attentions`,params)
  }

  //取消关注
  async deleteAttention(params){
    return axios.delete(`${defaultConfig.baseApiUrl}/userDetail/attentions/${params.userName}`)
  }

   //拉黑
   async setBlackList(params){
    return axios.post(`${defaultConfig.baseApiUrl}/userDetail/blackList`,params)
  }

  //取消拉黑
  async deleteBlackList(params){
    return axios.delete(`${defaultConfig.baseApiUrl}/userDetail/blackList/${params.userName}`)
  }

  //获取我的所有评论
  async getMyComment(params){
    return axios.get(`${defaultConfig.baseApiUrl}/userDetail/comment`,{
      params
    })
  }

  //获取我的关注
  async getMyAttentions(params){
    return axios.get(`${defaultConfig.baseApiUrl}/userDetail/attentions`,{
      params
    })
  }

   //获取我的黑名单
   async getMyBlackList(params){
    return axios.get(`${defaultConfig.baseApiUrl}/userDetail/blackList`,{
      params
    })
  }
}

export default new UserDetailService()