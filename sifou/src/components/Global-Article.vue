<template>
  <div @click='goArticleDetail'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{articleData.title}}</span>
        <el-tag type="warning" v-if='!articleData.approved' style="margin-left:10px;">未审核</el-tag>
      </div>
      <el-row>
        <el-col :span="24">
          <el-image :src='articleData.cover'>
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
</template>

<script>
  export default {
    name: "Global-Article",
    props:{
      articleData:{
        type:Object,
        default(){
          return {
            title:'',
            tags:'',
            description:'',
            cover:'',
            content:'',
            comments:[],
            author:{},
            lastModified:new Date(),
            views:0,
            likes:0,
            blogId:1, //博客 id，一个递增字段，用于标识一个独一无二的博客文章数据
            approved:true
          }
        }
      }
    },
    data(){
      return {

      }
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
      goArticleDetail(){
        this.$router.push(`/articleDetail/${this.articleData.blogId}`)
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-icon::before{
    margin-right: 5px;
  }
</style>