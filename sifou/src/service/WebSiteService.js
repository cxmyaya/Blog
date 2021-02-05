import axios from './config/axios.default.config'
import defaultConfig from '@/config/config.default'

class WebSiteService{
  async getWebSiteData(params){
    return axios.get(`${defaultConfig.baseApiUrl}/webSiteData/getVisitorData`,{
      params
    })
  }
}

export default new WebSiteService()