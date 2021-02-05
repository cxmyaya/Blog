<template>
  <div>
    <el-table :data="userList" size='mini'>
      <el-table-column prop="userName" label='用户名' align="center"></el-table-column>
      <el-table-column prop="avatar" label='头像' align="center">
        <template slot-scope='scope'>
            <el-avatar :src='scope.row.avatar'></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label='简介' align="center"></el-table-column>
      <el-table-column  prop="approved" label='是否冻结账号' align="center">
        <template slot-scope='scope'>
          <el-switch :value="!scope.row.approved" @change="switchApproved(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column  prop="isAdmin" label='是否设置为管理员' align="center">
        <template slot-scope='scope'>
          <el-switch v-model="scope.row.isAdmin" @change="switchAdmin(scope.row)"></el-switch>
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
      :total='total'
      @current-change="handleCurrentChange"
      :current-page.sync="searchParams.pageNum"
    >
    </el-pagination>
  </div>
</template>

<script>
  import AuthorService from '@/service/AuthorService'
  export default {
    name: "Permission",
    data(){
      return {
        searchParams:{
          pageNum:1,
          limit:10
        },
        total:0,
        userList:[]
      }
    },
    mounted(){
      this.getUserList()
    },
    methods:{
      getUserList(){
        AuthorService.getAllUser(this.searchParams).then(res => {
          if(res.data.status === 200){
            this.total = res.data.data.total
            this.userList = res.data.data.userList
          }else{
            this.$message.error(res.data.message)
          }
        })
      },
      handleCurrentChange(val){
        this.searchParams.pageNum = val
        this.getUserList()
      },
      switchAdmin(row){
        if(!row.approved){
          row.isAdmin = !row.isAdmin
          this.$message.warning('该用户账号还未通过审核')
          return
        }
        this.$confirm('确定更改该用户的管理员权限吗？','警告',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          AuthorService.setAdmin({key:row.key, isAdmin:row.isAdmin}).then(res => {
            if(res.data.status == 200){
              this.$message.success(res.data.message)
            }
          })
        }).catch(() => {
          row.isAdmin = !row.isAdmin
          this.$message.info('已取消更改用户管理权限')
        })
      },
      switchApproved(row){
        row.approved = !row.approved
        this.$confirm('确定更改该用户的账号状态吗？','警告',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          AuthorService.setApproved({key:row.key, approved:row.approved}).then(res => {
            if(res.data.status == 200){
              this.$message.success(res.data.message)
            }
          })
        }).catch(() => {
          row.approved = !row.approved
          this.$message.info('已取消更改用户账号状态')
        })
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
    }
  }
</script>

<style scoped>
  /deep/ .el-pagination{
    text-align: right;
  }
</style>