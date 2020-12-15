<template>
  <div style="width:100vw;height: 100vh; background-color: rgb(226,229,248);">
    <el-row  style="position:relative;width:100%;height: 100%;">
      <el-col :span="10" class="col-class">
        <div class="login-wrapper" v-if='isLogin' :key='1'>
          <el-form :model="loginForm" ref='loginForm' :rules="rules" size="mini" label-width="65px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username" clearable ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password" clearable type="password"></el-input>
            </el-form-item>
            <el-form-item style="text-align: end;">
              <el-button type="primary" plain @click="reset('loginForm')">重置</el-button>
              <el-button type="primary" @click='submitForm("loginForm")'>登录</el-button>
            </el-form-item>
            <el-form-item style="text-align: end;">
              <span style="color:#606266">没有账号？点击</span><el-button style="font-size: 14px;" type='text' @click='switchStatus("loginForm")' size="mini">注册</el-button>
            </el-form-item>
          </el-form>
          
        </div>

        <div class="register-wrapper" v-else :key='2'>
          <el-form :model="registerForm" ref='registerForm' :rules="rules" size="mini" label-width="80px">
            <el-form-item label="头像" prop="avatar">
              <el-upload
                class="avatar-uploader"
                :action="`${defaultConfig.baseApiUrl}/uploadImg`"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                name='blogIllustrations'
                >
                <img v-if="registerForm.avatar" :src="registerForm.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username" clearable ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="registerForm.password" clearable type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="registerForm.confirmPassword" clearable type="password"></el-input>
            </el-form-item>
            <el-form-item style="text-align: end;">
              <el-button type="primary" plain @click="reset('registerForm')">重置</el-button>
              <el-button type="primary" @click='submitForm("registerForm")'>注册</el-button>
            </el-form-item>
            <el-form-item style="text-align: end;">
              <span style="color:#606266">有账号？点击</span><el-button style="font-size: 14px;" type='text' @click='switchStatus("registerForm")' size="mini">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="14" class="bg-img">

      </el-col>
    </el-row>
  </div>
</template>

<script>
  import defaultConfig from '@/config/config.default'
  import AuthorService from '@/service/AuthorService'
  export default {
    name: "Login",
    data(){
      let checkPassword = (rule, value, cb) => {
        if(this.registerForm.confirmPassword){
          this.$refs.registerForm.validateField('checkSecPassword')
        }
        cb()
      }
      let checkSecPassword = (rule, value, cb) => {
        if(value !== this.registerForm.password){
          cb(new Error('两次密码输入不一致'))
        }
        cb()
      }
      return {
        defaultConfig,
        isLogin:true,
        registerForm:{
          avatar:'',
          username:'',
          password:'',
          confirmPassword:''
        },
        loginForm:{
          username:'',
          password:''
        },
        rules:{
          username:[{
            required:true,
            message:'请输入用户名',
            trigger:'blur'
          },{
            min:6,
            max:10,
            message:'用户名长度为6~10个字符之间',
            trigger:'blur'
          }],
          password:[{
            required:true,
            message:'请输入密码',
            trigger:'blur'
          },{
            min:6,
            max:10,
            message:'密码长度为6~10个字符之间',
            trigger:'blur'
          },{
            validator:checkPassword,
            trigger:'blur'
          }],
          confirmPassword:[{
            required:true,
            message:'请再次输入密码',
            trigger:'blur'
          },{
            validator:checkSecPassword,
            trigger:'blur'
          }],
        },
        avatarUrl:'',
      }
    },
    methods:{
      switchStatus(formName){
        this.$nextTick(() => {
          this.$refs[formName].resetFields()
        })
        this.isLogin = !this.isLogin
      },
      reset(formName){
        this.$refs[formName].resetFields()
      },
      submitForm(formName){
        this.$refs[formName].validate(valid => {
          if(valid){
            if(formName === 'loginForm'){
              AuthorService.loginUser(this.loginForm).then(res => {
                if(res.data.status === 200){
                  this.$message.success(res.data.message)
                  sessionStorage.removeItem('Authorization')
                  sessionStorage.setItem('Authorization',res.headers.authorization) //保存令牌
                  window.location.replace('http://localhost:8080/home.html')
                }else{
                  this.$message.error(res.data.message || '登录失败')
                }
              })
            }else{
              AuthorService.registerUser(this.registerForm).then(res => {
                if(res.data.status === 200){
                  this.$message.success(res.data.message)
                  sessionStorage.removeItem('Authorization')
                  sessionStorage.setItem('Authorization',res.headers.authorization) //保存令牌
                  window.location.replace('http://localhost:8080/login.html')
                }else{
                  this.$message.error('注册失败')
                }
              })
            }
          }
        })
        
      },
      handleAvatarSuccess(res, file) {
        console.log(res,file)
        this.registerForm.avatar = res.data.imgList[0]
        // this.avatarUrl = URL.createObjectURL(file.raw);
      },
    }
  }
</script>

<style scoped>
  .bg-img{
    position: absolute;
    right:0;
    height: 100%;
    background-image: url('./assets/bg.jpg');
    background-size: cover;
    background-position: center;
    box-shadow: 10px 10px 10px 8px inset rgb(226 229 248);
  }
  .login-wrapper,
  .register-wrapper{
    width: 70%;
    margin: 100px auto;
  }
  /deep/ .avatar-uploader .el-upload {
    border: 2px dashed #fff;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/ .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #fff;
    width: 150px;
    height: 150px;
    line-height: 150px;
    tex