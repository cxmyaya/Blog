<template>
  <div>
    <el-card class="box-card">
      <el-image 
        :src='userData.avatar'
        style="width:100%;margin:auto"
        fit='cover'
      ></el-image>
      <el-row :gutter="10">
        <el-col :span="24" style="text-align: center;">
          <span>{{userData.userName}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24" style="text-align: center;">
          <span>{{userData.introduction}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="10"  style="text-align: center;  margin-top: 10px;">
        <el-col :span="8">
          <el-badge :value="userData.userDetail.articles.length" class="item">
            <el-button size="mini"  plain>我的文章</el-button>
          </el-badge>
        </el-col>
        <el-col :span="8">
          <el-badge :value="userData.views" class="item">
            <el-button size="mini"  plain>浏览数</el-button>
          </el-badge>
        </el-col>
        <el-col :span="8">
          <el-badge :value="userData.likes" class="item">
            <el-button size="mini"  plain>点赞数</el-button>
          </el-badge>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "UserInfo",
    props:{
      userData:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data(){
      return{

      }
    }
  }
</script>

<style scoped>
  .item {
    margin-top: 10px;
  }
</style>