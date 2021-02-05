<template>
  <div style="width:100vw;height: 100vh;   background-image: linear-gradient(to bottom right, rgb(114, 135, 254), rgb(130, 88, 186));">
    <el-row  style="position:relative;width:100%;height: 100%;">
      <el-col :span="24" class="col-class">
        <div class="login-wrapper" v-if='isLogin' :key='1'>
          <div class="login">
            <el-form :model="loginForm" ref='loginForm' :rules="rules" size="mini" class="left">

              <div class="title">
                  <span>登录</span>
              </div>
              <div class="input">
                <el-form-item prop="username">
                  <input type="text" placeholder="用户名" v-model='loginForm.username'>
                </el-form-item>
                <el-form-item prop="password">
                  <input type="password" placeholder="密码" v-model='loginForm.password' />
                </el-form-item>
              </div>
              <!-- <a href="#">忘记密码？</a> -->
            </el-form>
        
            <div class="right">
                <div class="register">
                    <span @click='switchStatus("loginForm")' style='color:#fff;cursor: pointer;'> 注册</span>
                </div>
               <div class="submit">
                    <a href="#" @click='submitForm("loginForm")'>登录</a>
               </div>
                
            </div>
        </div>
          
        </div>

        <div class="register-wrapper" v-else :key='2'>
          <div class="login">
            <el-form :model="registerForm" ref='registerForm' :rules="rules" size="mini" class="left">

              <div class="title">
                  <span>注册</span>
              </div>
              <el-form-item  prop="avatar" style='text-align: center;margin-top: 20px;'>
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
              <div class="input">
                <el-form-item prop="username">
                  <input type="text" placeholder="用户名" v-model='registerForm.username'>
                  <div class="tips">用户名长度为6~10个字符之间</div>
                </el-form-item>
                <el-form-item prop="password">
                  <input type="password" placeholder="密码" v-model='registerForm.password' />
                  <div class="tips">密码长度为6~10个字符之间</div>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                  <input type="password" placeholder="确认密码" v-model='registerForm.confirmPassword' />
                </el-form-item>
              </div>
            </el-form>
        
            <div class="right">
                <div class="register">
                    <span @click='switchStatus("registerForm")' style='color:#fff;cursor: pointer;'> 登录</span>
                </div>
               <div class="submit">
                    <a href="#" @click='submitForm("registerForm")'>注册</a>
               </div>
                
            </div>
        </div>
        </div>
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
        leftTitle:'登录',
        rightTitle:'注册',
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
          // let temp = this.leftTitle
          // this.leftTitle = this.rightTitle
          // this.rightTitle = temp
          // console.log(temp,this.rightTitle)
          this.$refs[formName].resetFields()
        })
        this.isLogin = !this.isLogin
      },
      reset(formName){
        this.$refs[formName].resetFields()
      },
      submitForm(formName){
        console.log(formName)
        this.$refs[formName].validate(valid => {
          if(valid){
            if(formName === 'loginForm'){
              AuthorService.loginUser(this.loginForm).then(res => {
                if(res.data.status === 200){
                  this.$message.success(res.data.message)
                  sessionStorage.removeItem('Authorization')
                  sessionStorage.setItem('Authorization',res.headers.authorization) //保存令牌
                  window.location.replace(`${defaultConfig.hostname}/index.html`)
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
                  window.location.replace(`${defaultConfig.hostname}/login.html`)
                }else{
                  this.$message.error(res.data.message)
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
    border-color: rgb(237, 221, 22);
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #fff;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
  .col-class{
    position: absolute;
    top: 50%;
    margin: 0 auto;
    transform: translateY(-50%);
  }

  a{
      text-decoration: none;
      color: #000;
  }
  .login{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 600px;
      /* height: 300px; */
      border-radius: 15px;
      box-shadow: 0 10px 50px 0 rgb(59, 45, 159);
      background-color:rgb(95, 76, 194);
  }
  .login > .left{
      box-sizing: border-box;
      float: left;
      width: 400px;
      height: 100%;
      padding: 60px;
      border-radius: 15px 0 0 15px;
      background-image: linear-gradient(to bottom right, rgb(118, 76, 163), rgb(92, 103, 211));
  }
  .login > .left > .title > span{
      font-size: 18px;
      font-weight: bold;
      color:#fff;
      border-bottom: 3px solid rgb(237, 221, 22);
  }
  .login > .right > .register > span{
    border-bottom: 3px solid transparent;
    font-size: 18px; 
    font-weight: bold;
  }
  .login > .right > .register > span:hover{
    border-bottom-color: yellow;
    transition: 1s;
  }
  .login > .left > .input{
      /* padding: 20px 0; */
  }
  ::-webkit-input-placeholder{
      color: rgb(199, 191, 219);
  }
  .login  .left  .input{
      position: relative;
  }
  .login  .left  .input input{
      display: block;
      border: none;
      outline: none;
      background:none;
      width: 100%;
      padding:4px 0;
      margin:20px 0;
      color:#fff;
      border-bottom:1px solid rgb(199, 191, 219) ;
  }
  .login  .left  .input input:hover{
      border-bottom-color: rgb(237, 221, 22);;
      transition: .6s;
  }
  .login  .left  .input input:hover + .tips{
      opacity: 1; 
  }
  .login  .left  .input  input + .tips{
      position: absolute;
      top: 20px;
      left:284px;
      white-space: nowrap;
      color: #fff;
      border-radius: 6px;
      background-image: linear-gradient(to bottom right, rgb(118, 76, 163), rgb(92, 103, 211));
      transition: .6s;
      opacity: 0;
  }
  .login > .left > a{
      color:rgb(199, 191, 219);
      margin-bottom: 0px;
  }
  .login > .left > a:hover{
      color:#fff;
  }
  .login > .right{
      /* box-sizing: border-box;
      float: left;
      width: calc(100% - 400px);
      height: 100%;
      padding: 60px 0; 
      text-align:center; */
  
      position: absolute;
      right: 13%;
      box-sizing: border-box;
      float: left;
      /* width: calc(100% - 400px); */
      height: 100%;
      padding: 60px 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
  }
  .login > .right > .register > a{
      color:#fff;
  }
  .login > .right > .submit > a{
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      color:#fff;
      font-size: 12px;
      border-radius: 50%;
      border: 1px solid rgb(237, 221, 22) ;
  }
  /* .login > .right > .submit {
      margin-top: 130px;
  } */
  .login > .right > .submit > a:hover{
      background-color: rgb(237, 221, 22);
  }
  /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 0;
  }
  /deep/ .el-form-item__error{
    top:80%
  }
</style>