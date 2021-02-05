import axios from './config/axios.default.config'
import defaultConfig from '@/config/config.default'

class TipOffService {
  //举报文章
  async tipOffArticle(data){
    return axios.post(`${defaultConfig.baseApiUrl}/tipOff/article`,data)
  }

  //获取被举报的文章
  async getTipOffData(params){
    return axios.get(`${defaultConfig.baseApiUrl}/tipOff/article`,{params})
  }

  
  //忽略举报
  async ignoreTipOff(params){
    return axios.delete(`${defaultConfig.baseApiUrl}/tipOff/tipOffData/${params.tipOffId}`)
  }

   //删除举报的文章
   async deleteTipOff(params){
    return axios.delete(`${defaultConfig.baseApiUrl}/tipOff/article/${params.tipOffId}`)
  }
}

export default new TipOffService