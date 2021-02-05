<template>
  <div>
    <div>
      <el-card style='margin-bottom: 20px;' v-for='(blackListItem, index) in blackList' :key='index'>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-avatar :src='blackListItem.avatar'></el-avatar>
              <br>
              <span style="font-size: 12px;">{{blackListItem.userName}}</span>
            </el-col>
            <el-col :span="14">
              {{blackListItem.introduction}}
            </el-col>
            <el-col :span="4">
              <el-button 
              v-if='!(blackListItem.userName === userData.userName)'
              type="danger"
              icon="el-icon-s-custom" 
              size='medium'
              @click='switchBlackList(blackListItem.userName)'>
              {{userData.userDetail.blackList.includes(blackListItem.userName) ? '已拉黑':'拉黑'}}
            </el-button>
            </el-col>
          </el-row>
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
    name: "MyBlackList",
    data(){
      return {
        blackList:[],
        total:0,
        params:{
          limit:5,
          pageNum:1
        }
      }
    },
    created(){
      this.userData = JSON.parse(sessionStorage.getItem('userData'))
      this.getMyBlackList()
    },
    methods:{
      getMyBlackList(){
        UserDetailService.getMyBlackList(this.params).then(res => {
          console.log(res)
          this.blackList = res.data.data.blackList
          this.total = res.data.data.total
        })
      },
      handleSizeChange(val){
        this.params.limit = val
        this.getMyBlackList()
      },
      handleCurrentChange(val){
        this.params.pageNum = val
        this.getMyBlackList()
      },
      switchBlackList(userName){
        if(this.userData.userDetail.blackList.includes(userName)){
          //取消拉黑
          UserDetailService.deleteBlackList({userName}).then(res => {
            if(res.data.status === 200){
              this.userData.userDetail.blackList.splice(this.userData.userDetail.blackList.indexOf(userName),1)
              sessionStorage.setItem('userData',JSON.stringify(this.userData))
              this.getMyBlackList()
            }
            this.$message.success(res.data.message)
          })
        }else{
          //拉黑
          UserDetailService.setBlackList({userName}).then(res => {
            if(res.data.status === 200){
              this.userData.userDetail.blackList.push(userName)
              sessionStorage.setItem('userData',JSON.stringify(this.userData))
              this.getMyBlackList()
            }
            this.$message.success(res.data.message)
          })
        }
      },
    }
  }
</script>

<style scoped>
  /deep/ .el-pagination{
    float:right;
    padding:20px;
  }
</style>