<template>
  <div>
    <div>
      <el-card style='margin-bottom: 20px;' v-for='(commentItem, index) in commentList' :key='index'>
        <div slot="header" class="clearfix">
          <el-row :gutter="10">
            <el-col :span="20">
              <h3 @click='goBlogDetail(commentItem.blogId)' style="cursor: pointer;">{{commentItem.blogData.title}}</h3>
            </el-col>
            <el-col :span="4">
              <el-avatar :src='commentItem.blogData.author.avatar'></el-avatar>
              <br>
              <span style='font-size: 12px;'>{{commentItem.blogData.author.userName}}</span>
            </el-col>
          </el-row>
        </div>
        <div v-for="(item, index) in commentItem.commentData" :key="index" style="margin-bottom: 20px;">
          <el-row :gutter="10">
            <el-col :span="2">
              <el-avatar :src='item.userData.avatar'></el-avatar>
            </el-col>
            <el-col :span="22" style="padding:10px;box-shadow: 0 0 10px 2px #ccc;">
              {{item.content}}
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <el-pagination
      :hide-on-single-page="true"
      layout='total, prev, pager, next'
      :total='total'
      :current-page.sync='params.pageNum'
      :page-size.sync='params.limit'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >

    </el-pagination>
  </div>
</template>

<script>
  import UserDetailService from '@/service/UserDetailService'
  export default {
    name: "MyComment",
    components:{
    },
    data(){
      return {
        commentList:[],
        total:0,
        params:{
          limit:5,
          pageNum:1
        }
      }
    },
    created(){
      this.getMyComment()
    },
    methods:{
      getMyComment(){
        UserDetailService.getMyComment(this.params).then(res => {
          this.commentList = res.data.data.commentList
          this.total = res.data.data.total
        })
      },
      handleSizeChange(val){
        this.params.limit = val
        this.getMyComment()
      },
      handleCurrentChange(val){
        this.params.pageNum = val
        this.getMyComment()
      },
      goBlogDetail(blogId){
        this.$router.push(`/articleDetail/${blogId}`)
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-pagination{
    float:right;
    padding:20px;
  }
  /* .box-card {
    width: 480px;
  } */
</style>