<template>
  <div>
    <GlobalArticle
      v-for='(item,index) in blogList'
      :key='index'
      :articleData='item'
    ></GlobalArticle>
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
  import GlobalArticle from '@/components/Global-Article'
  import BlogService from '@/service/BlogService'

  export default {
    name: "Community",
    components:{
      GlobalArticle
    },
    data(){
      return {
        blogList:[],
        total:0,
        params:{
          limit:1,
          pageNum:1
        }
      }
    },
    created(){
      this.getPublicBlog()
    },
    methods:{
      getPublicBlog(){
        BlogService.getPublicBlog(this.params).then(res => {
          this.blogList = res.data.data.blogList
          this.total = res.data.data.total
        })
      },
      handleSizeChange(val){
        this.params.limit = val
        this.getPublicBlog()
      },
      handleCurrentChange(val){
        this.params.pageNum = val
        this.getPublicBlog()
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-pagination{
    float:right;
    padding:20px;
  }
</style>