<template>
  <el-container>
    <el-header style="border-bottom: 1px solid #ccc;margin: 20px 10px">
      <el-row :gutter="10">
        <el-col
          :offset="3"
          :span="18"
          style="display: flex; align-items: center;justify-content:space-between;" >
          <img src="@/assets/logo.jpg" alt="思否" width="50" height="30">
          <el-input
            v-model='searchStr'
            placeholder="请输入博客人的标题"
            style="width: 60%;">
            <el-button type="primary" slot="append" class="el-icon-search"></el-button>
          </el-input>
            <el-dropdown v-if='hasPermission'>
            <el-avatar
            :src="'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607620507438&di=fe9dfcb5fe6cabde9ef060f2e4247870&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3De35999c10424ab18e016e13f05fbe69a%2Fb9014a90f603738d184870c5be1bb051f919ecd3.jpg'"
            title='cxm'
            fit='contain'
            >
            </el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>cxm</el-dropdown-item>
              <el-dropdown-item >设置</el-dropdown-item>
              <el-dropdown-item >退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-link type='primary' href='login.html' v-if='!hasPermission'>登录</el-link>
          <div v-if='hasPermission'>
            <el-button type="text" icon="el-icon-s-home" >小树洞</el-button>
            <el-button type="text" icon="el-icon-edit">写文章</el-button>
            <el-button type="text" icon="el-icon-s-data" v-if='isAdmin'>站点管理系统</el-button>
          </div>
          
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width='300px' style="background-color: pink;" v-if='hasPermission'>

      </el-aside>
      <el-main style="background-color:royalblue;">

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import AuthorService from '@/service/AuthorService'
  export default {
    name: "Home",
    data(){
      return {
        searchStr:'',
        hasPermission:false,
        isAdmin:false,
      }
    },
    created(){
      AuthorService.checkPermission().then(res => {
        if(res.data.status === 200){
          this.hasPermission = true
          this.isAdmin = res.data.userData.isAdmin
        }else{
          // window.location.replace('http://localhost