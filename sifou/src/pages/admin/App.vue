<template>
  <el-container>
    <el-header style="height:50px;border-bottom: 1px solid #ccc;">
      <el-row :gutter="10">
        <el-col
          :offset="3"
          :span="18"
          style="display: flex; align-items: center;justify-content:space-between;" >
          <img src="@/assets/logo.png" alt="思否" width="80" height="40" @click='goHome' style="cursor: pointer;">
            <el-dropdown @command="handleCommand">
              <el-avatar
              :src="userData.avatar"
              :title='userData.userName'
              fit='contain'
              >
              </el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item disabled command='userName'>{{userData.userName}}</el-dropdown-item>
                <el-dropdown-item command='loginOut'>退出</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside style="width: auto;">
        <el-menu 
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        @select='handleSelect'
        active-text-color='#E6A23C'
        >
          <el-menu-item index='0'>
            <i class="el-icon-date"></i>
            <span>数据总览</span>
          </el-menu-item>
          <el-menu-item index='1'>
            <i class="el-icon-s-check"></i>
            <span>审核</span>
          </el-menu-item>
          <el-menu-item index='2'>
            <i class="el-icon-warning"></i>
            <span>举报处理</span>
          </el-menu-item>
          <el-menu-item index='3'>
            <i class="el-icon-user-solid"></i>
            <span>用户权限处理</span>
          </el-menu-item>
          <el-menu-item index='4'>
            <i class="el-icon-s-data"></i>
            <span>数据库管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import defaultConfig from '@/config/config.default'
  export default {
    name: "Admin",
    data(){
      return {
        userData:JSON.parse(sessionStorage.getItem('userData')),
        defaultActive:'0'
      }
    },
    mounted(){
    },
    watch:{
      $route(){
        switch(this.$route.path){
          case '/dataView':
            this.defaultActive = '0'
            break;
          case '/review':
            this.defaultActive = '1'
            break;
          case '/tipOff':
            this.defaultActive = '2'
            break;
          case '/permission':
            this.defaultActive = '3'
            break;
          case '/dbmanager':
            this.defaultActive = '4'
            break;
        }
      }
    },
    methods:{
      handleCommand(command){
        if(command === 'loginOut'){
          sessionStorage.removeItem('userData')
          sessionStorage.removeItem('Authorization')
          window.location.replace(`${defaultConfig.hostname}/login.html`)
        }
      },
      goHome(){
        window.location.replace(`${defaultConfig.hostname}/index.html`)
      },
      handleSelect(index){
        if(this.defaultActive ===  index)
          return
        switch(index){
          case '0':
            this.defaultActive = '0'
            this.$router.push('/dataView')
            break;
          case '1':
            this.defaultActive = '1'
            this.$router.push('/review')
            break;
          case '2':
            this.defaultActive = '2'
            this.$router.push('/tipOff')
            break;
          case '3':
            this.defaultActive = '3'
            this.$router.push('/permission')
            break;
          case '4':
            this.defaultActive = '4'
            this.$router.push('/dbmanager')
            break;
        }
      }
    }
  }
</script>

<style scoped>

</style>