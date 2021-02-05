<template>
  <el-dialog title="更改用户信息"  :visible.sync="userSettingDialog" :close-on-click-modal="false">
    <el-form :model="formData" label-width="80px" ref='form'>
      <el-form-item label='头像' prop="avatar" ref='form'>
        <el-upload
          class="avatar-uploader"
          :action="`${defaultConfig.baseApiUrl}/uploadImg`"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          name='blogIllustrations'
          >
        <img v-if="formData.avatar" :src="formData.avatar" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      </el-form-item>
      <el-form-item label='用户简介' prop="introduction">
        <el-input v-model='formData.introduction' clearable placeholder="请输入" style="width:100%"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import defaultConfig from '@/config/config.default'
  import AuthorService from '@/service/AuthorService'
  export default {
    name: "UserSetting",
    data(){
      return {
        formData:{
          avatar:"",
          introduction:""
        },
        userSettingDialog:false,
        defaultConfig
      }
    },
    methods:{
      handleAvatarSuccess(res){
        this.formData.avatar = res.data.imgList[0]
      },
      resetForm(){
        this.userSettingDialog = false
        this.$refs.form.resetFields()
      },
      submitForm(){
        AuthorService.updateUserInfo(this.formData).then(res => {
          if(res.data.status === 200){
            this.$message.success(res.data.message)
            this.$emit('updateUserData',this.formData)
            this.userSettingDialog = false
          }else {
            this.$message.error(res.data.message)
          }
        })
      },
      getData(){
        AuthorService.getUserInfo().then(res => {
          if(res.data.status === 200){
            this.formData.avatar = res.data.data.avatar
            this.formData.introduction = res.data.data.introduction
          }
        })
      }
    }
  }
</script>

<style scoped>
 /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
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
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>