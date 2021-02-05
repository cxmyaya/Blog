<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label='文章' name='article'>
        <el-table :data='blogList' size='mini'>
          <el-table-column type="expand" align="center">
            <template slot-scope='scope'>
              <div v-html='scope.row.content'></div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="title" label='标题' min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="blogId" label='博客ID' min-width='80' show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="author.userName" label='作者' min-width='80' show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="cover" label='封面' min-width='100'>
            <template slot-scope='scope'>
              <el-image
                fit='fill'
                :src='scope.row.cover'
                style="width:100px"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" prop='lastModified' label='发布时间' min-width='120' show-overflow-tooltip>
            <template slot-scope='scope'>
              <span>{{scope.row.lastModified | transformTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="description" label='简介' min-width='150' show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label='tags' width='200'>
            <template slot-scope='scope'>
             <el-tag
              type='success'
              v-for='(tag, index) in scope.row.tags'
              :key='index'
              style="margin-right:5px; margin-bottom:5px"
             >
              {{tag}}
            </el-tag>
            </template>
          </el-table-column>
          <el-table-column  prop="approved" label='是否通过审核' align="center" min-width='100'>
            <template slot-scope='scope'>
              <el-switch v-model="scope.row.approved" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label='操作'>
            <template slot-scope='scope'>
              <el-button type="danger" size="mini" @click='rejectedBlog(scope.row)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout='prev, pager, next'
          :total='blogTotal'
          @current-change="handleBlogCurrentChange"
          :current-page.sync="searchBlogParams.pageNum"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label='用户' name='user'>
        <el-table :data="userList" size='mini'>
          <el-table-column prop="userName" label='用户名' align="center"></el-table-column>
          <el-table-column prop="avatar" label='头像' align="center">
            <template slot-scope='scope'>
                <el-avatar :src='scope.row.avatar'></el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="introduction" label='简介' align="center"></el-table-column>
          <el-table-column  prop="approved" label='是否通过审核' align="center">
            <template slot-scope='scope'>
              <el-switch v-model="scope.row.approved" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column  prop="isAdmin" label='是否是管理员' align="center">
            <template slot-scope='scope'>
              <el-switch v-model="scope.row.isAdmin" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column label='操作' align="center">
            <template slot-scope='scope'>
              <el-button type="danger" size="mini" @click='rejectedUser(scope.row)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout='prev, pager, next'
          :total='userTotal'
          @current-change="handleUserCurrentChange"
          :current-page.sync="searchUserParams.pageNum"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import AuthorService from '@/service/AuthorService'
  import BlogService from '@/service/BlogService'
  export default {
    name: "DBManager",
    data(){
      return {
        searchUserParams:{
          pageNum:1,
          limit:10
        },
        searchBlogParams:{
          pageNum:1,
          limit:10
        },
        userTotal:0,
        blogTotal:0,
        blogList:[],
        userList:[],
        activeName:'article',
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
    mounted(){
      this.getUserList()
      this.getBlogList()
    },
    methods:{
      getUserList(){
        AuthorService.getAllUser(this.searchUserParams).then(res => {
          if(res.data.status === 200){
            this.userTotal = res.data.data.total
            this.userList = res.data.data.userList
          }else{
            this.$message.error(res.data.message)
          }
        })
      },
      getBlogList(){
        BlogService.getAllBlog(this.searchBlogParams).then(res => {
          if(res.data.status === 200){
            this.blogTotal = res.data.data.total
            this.blogList = res.data.data.blogList
          }else{
            this.$message.error(res.data.message)
          }
        })
      },
      handleClick(e){
        this.activeName = e.name
      },
      handleUserCurrentChange(val){
        this.searchUserParams.pageNum = val
        this.getUserList()
      },
      rejectedUser(row){
        this.$confirm('此操作将永久删除该用户及其所有文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          AuthorService.deleteUser({key:row.key}).then(res => {
          if(res.data.status === 200){
            this.$message.success(res.data.message)
            this.searchUserParams.pageNum = 1
            this.getUserList()
          }else{
            this.$message.error(res.data.message)
          }
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      },
      handleBlogCurrentChange(val){
        this.searchBlogParams.pageNum = val
        this.getBlogList()
      },
      rejectedBlog(row){
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BlogService.deleteBlog({blogId:row.blogId}).then(res => {
          if(res.data.status === 200){
            this.$message.success(res.data.message)
            this.searchBlogParams.pageNum = 1
            this.getBlogList()
          }else{
            this.$message.error(res.data.message)
          }
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-pagination{
    text-align: right;
  }
</style>