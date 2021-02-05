<template>
  <div>
    <el-page-header @back='goBack'></el-page-header>
    <div style="display: flex;flex-wrap: wrap;justify-content: center;">
      <el-card class="box-card" v-for='(articleData, index) in blogList' :key='index'>
        <div slot="header" class="clearfix"  @click='goArticleDetail(articleData.blogId)'>
          <span>{{articleData.title}}</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-image :src='articleData.cover' style="height:200px" fit='contain'>
              <div slot="placeholder" class="image-slot">
                加载中<span class="'dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p>{{articleData.description}}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='2'>
            <el-avatar :src='articleData.author.avatar'></el-avatar>
          </el-col>
          <el-col :span='4'>
            <P>{{articleData.author.userName}}</P>
          </el-col>
          <el-col :span="6">
            <p>{{articleData.lastModified | transformTime}}</p>
          </el-col>
          <el-col :span="8"></el-col>
          <el-col :span='4' style="float:right; display:flex;justify-content: space-evenly;">
            <p class="el-icon-star-on el-icon">{{articleData.likes}}</p>
            <p class="el-icon-view el-icon">{{articleData.views}}</p>
            <p class="el-icon-s-comment el-icon">{{articleData.comments.length}}</p>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <el-pagination
      layout='total, prev, pager, next'
      :total='total'
      :current-page.sync='searchParams.pageNum'
      :page-size.sync='searchParams.limit'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
  </el-pagination>
  </div>
</template>

<script>
  import BlogService from '@/service/BlogService'
  export default {
    name: "BlogList",
    data(){
     return {
      searchParams:{
        limit:10,
        pageNum:1,
        searchKey:''
      },
      total:0,
      blogList:[]
     }
    },
    mounted(){
      this.searchParams.searchKey = this.$route.params.searchKey
      this.getPublicBlog()
    },
    filters:{
      transformTime(time){
        let blogCreateTime = new Date(time)
        let currentTime = new Date()
        let offsetTime = currentTime - blogCreateTime
        let offsetST = offsetTime / 1000
        let offsetMT = offsetST / 60
        let offsetHT = offsetMT / 60
        let offsetDT = offsetHT / 24
        if(offsetDT >= 365){
          return `发表于 ${Math.floor(offsetDT / 365)} 年之前`
        }else if(offsetDT >= 30){
          return `发表于 ${Math.floor(offsetDT / 30)} 个月之前`
        }else if(offsetDT >= 7){
          return `发表于 ${Math.floor(offsetDT / 7)} 周之前`
        }else if(offsetDT >= 1){
          return `发表于 ${Math.floor(offsetDT)} 天之前`
        }else if(offsetHT >= 1){
          return `发表于 ${Math.floor(offsetHT)} 小时之前`
        }
        else if(offsetMT >= 1){
          return `发表于 ${Math.floor(offsetMT)} 分钟之前`
        }
        else if(offsetST >= 1){
          return `发表于 ${Math.floor(offsetST)} 秒钟之前`
        }
      }
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      getPublicBlog(){
        BlogService.getPublicBlog(this.searchParams).then(res => {
          this.blogList = res.data.data.blogList
          this.total = res.data.data.total
        })
      },
      goArticleDetail(blogId){
        console.log(111)
        this.$router.push(`/articleDetail/${blogId}`)
      },
      handleSizeChange(val){
        this.searchParams.limit = val
        this.getPublicBlog()
      },
      handleCurrentChange(val){
        this.searchParams.pageNum = val
        this.getPublicBlog()
      }
    }
  }
</script>

<style scoped>
  .el-page-header{
    margin:10px
  }
  .el-pagination{
    display: flex;
    justify-content: center;
  }
  .box-card{
    width:50%;
    margin-bottom:10px
  }
</style>