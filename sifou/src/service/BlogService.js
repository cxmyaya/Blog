import axios from './config/axios.default.config'
import defaultConfig from '@/config/config.default'

class BlogService{

  //写文章
  async createBlog(blogData){
    return axios.post(`${defaultConfig.baseApiUrl}/blog/create`,blogData)
  }

  //博客列表查询
  async getPublicBlog(params){
    return axios.get(`${defaultConfig.baseApiUrl}/blog/getPublicBlog`,{
      params
    })
  }

  //获取我的博客
  async getMyBlog(params){
    return axios.get(`${defaultConfig.baseApiUrl}/blog/getMyBlog`,{
      params
    })
  }

  //获取我点赞的博客
  async getMyLike(params){
    return axios.get(`${defaultConfig.baseApiUrl}/blog/getMyLike`,{
      params
    })
  }

  //根据博客 id 获取博客详情
  async getBlogById(params){
    return axios.get(`${defaultConfig.baseApiUrl}/blog/getBlogById`,{
      params
    })
  }

  //创建评论
  async createBlogComment(data){
    return axios.post(`${defaultConfig.baseApiUrl}/blog/comment/create`,data)
  }

  //获取未审核的文章
  async getUnapprovedBlogList(params){
    return axios.get(`${defaultConfig.baseApiUrl}/blog/getUnapprovedBlogs`,{params})
  }

   //获取所有文章
   async getAllBlog(params){
    return axios.get(`${defaultConfig.baseApiUrl}/blog/getAllBlog`,{params})
  }

  //审核通过文章
  async approvedBlog(data){
    return axios.post(`${defaultConfig.baseApiUrl}/blog/approvedBlog`,data)
  }

   //删除文章
   async deleteBlog(data){
    return axios.post(`${defaultConfig.baseApiUrl}/blog/deleteBlog`,data)
  }
}

export default new BlogService()