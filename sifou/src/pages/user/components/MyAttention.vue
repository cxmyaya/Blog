<template>
  <div>
    <div>
      <el-card style='margin-bottom: 20px;' v-for='(attentionItem, index) in attentionsList' :key='index'>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-avatar :src='attentionItem.avatar'></el-avatar>
              <br>
              <span style="font-size: 12px;">{{attentionItem.userName}}</span>
            </el-col>
            <el-col :span="14">
              {{attentionItem.introduction}}
            </el-col>
            <el-col :span="4">
              <el-button
              type="primary"
              :icon="userData.userDetail.attentions.includes(attentionItem.userName) ? 'el-icon-check' :'el-icon-plus '" 
              size='medium'
              @click='switchAttention(attentionItem.userName)'>
               关注
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
    name: "MyAttention",
    data(){
      return {
        attentionsList:[],
        total:0,
        params:{
          limit:5,
          pageNum:1
        }
      }
    },
    created(){
      this.userData = JSON.parse(sessionStorage.getItem('userData'))
      this.getMyAttentions()
    },
    methods:{
      getMyAttentions(){
        UserDetailService.getMyAttentions(this.params).then(res => {
          this.attentionsList = res.data.data.attentionsList
          this.total = res.data.data.total
        })
      },
      handleSizeChange(val){
        this.params.limit = val
        this.getMyAttentions()
      },
      handleCurrentChange(val){
        this.params.pageNum = val
        this.getMyAttentions()
      },
      switchAttention(userName){
        if(this.userData.userDetail.attentions.includes(userName)){
          //取消关注
          UserDetailService.deleteAttention({userName}).then(res => {
            if(res.data.status === 200){
              this.userData.userDetail.attentions.splice(this.userData.userDetail.attentions.indexOf(userName),1)
              sessionStorage.setItem('userData',JSON.stringify(this.userData))
              this.getMyAttentions()
            }
            this.$message.success(res.data.message)
          })
        }else{
          //关注
          UserDetailService.setAttention({userName}).then(res => {
            if(res.data.status === 200){
              this.userData.userDetail.attentions.push(userName)
              sessionStorage.setItem('userData',JSON.stringify(this.userData))
              this.getMyAttentions()
            }
            this.$message.success(res.data.message)
          })
        }
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