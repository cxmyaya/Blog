<template>
  <el-container>
    <el-header style="border-bottom: 1px solid #ccc;margin: 20px 10px">
      <el-row :gutter="10">
        <el-col
          :offset="3"
          :span="18"
          style="display: flex; align-items: center;justify-content:space-between;" >
          <img src="@/assets/logo.png" alt="思否" width="80" height="40">
          <el-input
            v-model='searchStr'
            placeholder="请输入博客的标题"
            style="width: 60%;">
            <el-button type="primary" slot="append" class="el-icon-search" @click='searchBlog'></el-button>
          </el-input>
            <el-dropdown v-if='hasPermission' @command="handleCommand">
              <el-avatar
              :src="userData.avatar"
              :title='userData.userName'
              fit='contain'
              >
              </el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item disabled command='userName'>{{userData.userName}}</el-dropdown-item>
                <el-dropdown-item command='setting'>设置</el-dropdown-item>
                <el-dropdown-item command='loginOut'>退出</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
          <el-link type='primary' href='login.html' v-if='!hasPermission'>登录</el-link>
          <div v-if='hasPermission'>
            <el-button type="text" icon="el-icon-s-home" @click='goChatHome' >小树洞</el-button>
            <el-button type="text" icon="el-icon-edit" @click='goEditArticle'>写文章</el-button>
            <el-button type="text" icon="el-icon-s-data" v-if='isAdmin' @click='goAdmin'>站点管理系统</el-button>
          </div>
          
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width='300px'  v-if='hasPermission'>
        <UserInfo :userData='userData'></UserInfo>
      </el-aside>
      <el-main>
        <el-tabs v-model='activeName' @tab-click='switchTab'>
          <el-tab-pane label="广场" name='article'>
            <Community></Community>
          </el-tab-pane>
          <el-tab-pane label="我的文章" name='myArticle'>
            <MyBlog></MyBlog>
          </el-tab-pane>
          <el-tab-pane label="喜欢" name='like'>
            <MyLike></MyLike>
          </el-tab-pane>
          <el-tab-pane label="评论" name='comment'>
            <MyComment></MyComment>
          </el-tab-pane>
          <el-tab-pane label="关注" name='attension'>
            <my-attention></my-attention>
          </el-tab-pane>
          <el-tab-pane label="黑名单" name='blakclist'>
            <MyBlackList></MyBlackList>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <user-setting ref='userSetting' @updateUserData='updateUserData'></user-setting>
  </el-container>
  
</template>

<script>
  import AuthorService from '@/service/AuthorService'
  import UserInfo from '@/pages/user/components/UserInfo'
  import Community from '@/pages/user/components/Community'
  import MyBlog from '@/pages/user/components/MyBlog'
  import MyLike from '@/pages/user/components/MyLike'
  import MyComment from '@/pages/user/components/MyComment'
  import MyAttention from '@/pages/user/components/MyAttention'
  import MyBlackList from '@/pages/user/components/MyBlackList'
  import UserSetting from '@/pages/user/components/UserSetting'
  import defaultConfig from '@/config/config.default'

  export default {
    name: "Home",
    components:{
      UserInfo,
      Community,
      MyBlog,
      MyLike,
      MyComment,
      MyAttention,
      MyBlackList,
      UserSetting
    },
    data(){
      return {
        searchStr:'',
        hasPermission:false,
        isAdmin:false,
        userData:{
          avatar:'',
          introduction:''
        },
        activeName:'',
        articleData:{}
      }
    },
    created(){
     this.checkPermission()
     this.activeName = this.$route.params.module
    },
    methods:{
      checkPermission(){
        AuthorService.checkPermission().then(res => {
          if(res.data.status === 200){
            this.hasPermission = true
            this.isAdmin = res.data.data.userData.isAdmin
            this.userData = res.data.data.userData
            sessionStorage.removeItem('userData')
            sessionStorage.setItem('userData',JSON.stringify(this.userData))
          }else{
            window.location.replace(`${defaultConfig.hostname}/login.html`)
          }
        })
      },
      goEditArticle(){
        this.$router.push('/articleEdit')
      },
      switchTab(tab){
        this.$router.push(`/home/${tab.name}`)
      },
      handleCommand(command){
        if(command === 'loginOut'){
          sessionStorage.removeItem('userData')
          sessionStorage.removeItem('Authorization')
          window.location.replace(`${defaultConfig.hostname}/login.html`)
        }else if(command === 'setting'){
          this.$refs.userSetting.getData()
          this.$refs.userSetting.userSettingDialog = true
        }
      },
      updateUserData(data){
        this.userData.avatar = data.avatar
        this.userData.introduction = data.introduction
        sessionStorage.setItem('userData',JSON.stringify(this.userData))
      },
      goChatHome(){
        this.$router.push('/chatHome')
      },
      searchBlog(){
        this.$router.push(`/blogList/${this.searchStr}`)
      },
      goAdmin(){
        window.location.replace(`${defaultConfig.hostname}/admin.html`)
      }
    }
  }
</script>

<style scoped>

</style>