<template>
  <div style="padding:20px">
    <el-page-header @back='goBack' :content='blogData.title'></el-page-header>
    <el-card class="box-card" style="margin-top:20px">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="1">
            <el-avatar
              :src='blogData.author.avatar'
            >

            </el-avatar>
          </el-col>
          <el-col :span="6">
            <span>{{blogData.author.userName}}</span>
            <br>
            <span>{{blogData.lastModified | transformTime}}</span>
          </el-col>
          <el-col :span="8" :offset='8'>
            <el-button
             type="warning" 
             circle 
             :icon="userData.userDetail.likes.includes(blogId) ? 'el-icon-star-on' :'el-icon-star-off '" 
             size='medium'
             @click='switchLike'
             >
            </el-button>
            <el-button
              v-if='!(blogData.author.userName === userData.userName)'
              type="primary"
              :icon="userData.userDetail.attentions.includes(blogData.author.userName) ? 'el-icon-check' :'el-icon-plus '" 
              size='medium'
              @click='switchAttention'>
               关注
            </el-button>
            <el-button 
              v-if='!(blogData.author.userName === userData.userName)'
              type="danger"
              icon="el-icon-s-custom" 
              size='medium'
              @click='switchBlackList'>
              {{userData.userDetail.blackList.includes(blogData.author.userName) ? '已拉黑':'拉黑'}}
            </el-button>
            <el-button 
            v-if='!(blogData.author.userName === userData.userName)' 
            type="danger"
            icon="el-icon-thumb"
            size='medium'
            @click='switchTipOff'>举报</el-button>
          </el-col>
        </el-row>
      </div>
      <div> 
        <div class="main" v-html='blogData.content'></div>
        <div>
          <el-tag v-for='(tag,index) in blogData.tags' :key='index' style='margin-right:20px' type="success">{{tag}}</el-tag>
        </div>
        <div style="margin-top: 20px;">
          <el-row>
            <el-col :span="1"><i class="el-icon-star-on"></i>{{blogData.likes}}</el-col>
            <el-col :span="1"><i class="el-icon-view"></i>{{blogData.views}}</el-col>
            <el-col :span="1"><i class="el-icon-s-comment"></i>{{blogData.comments.length}}</el-col>
          </el-row>
        </div>
      </div>
      <el-divider><i class="el-icon-s-comment"></i></el-divider>
      <GlobalComment :blogId='blogId' :comments="blogData.comments"></GlobalComment>
    </el-card>
    <el-dialog
      title="举报文章"
      :visible.sync = 'isShowTipOff'
      width=30%>
      <el-input v-model='tipOffReason' placeholder="举报原因" type="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click='isShowTipOff = false'>取消</el-button>
        <el-button @click='switchTipOff' type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
  import BlogService from '@/service/BlogService'
  import UserDetailService from '@/service/UserDetailService'
  import TipOffService from '@/service/TipOffService'
  import GlobalComment from '@/components/Global-Comment'
  export default {
    name: "articleDetail",
    components:{
      GlobalComment
    },
    data(){
      return {
        blogId:'',
        blogData:{
          author:{
            userName:'',
            avatar:''
          },
          lastModified:'',
          content:'',
          comments:[],
          likes:'',
          views:''
        },
        userData:{},
        tipOffReason:'',
        isShowTipOff:false
      }
    },
    created(){
      this.blogId = Number(this.$route.params.id)
      this.userData = JSON.parse(sessionStorage.getItem('userData'))
    },
    mounted(){
      this.getBlogById(1)
    },
    filters:{
      transformTime(time){
        let blogCreateTime = new Date(time)
        let currentTime = new Date()
        let offsetTime = currentTime - blogCreateTime
        let offsetST = offsetTime / 1000
        let offsetMT = offsetST / 60
        let offsetHT = offsetMT / 60
        let offsetDT = offsetHT / 24
        if(offsetDT >= 365){
          return `发表于 ${Math.floor(offsetDT / 365)} 年之前`
        }else if(offsetDT >= 30){
          return `发表于 ${Math.floor(offsetDT / 30)} 个月之前`
        }else if(offsetDT >= 7){
          return `发表于 ${Math.floor(offsetDT / 7)} 周之前`
        }else if(offsetDT >= 1){
          return `发表于 ${Math.floor(offsetDT)} 天之前`
        }else if(offsetHT >= 1){
          return `发表于 ${Math.floor(offsetHT)} 小时之前`
        }
        else if(offsetMT >= 1){
          return `发表于 ${Math.floor(offsetMT)} 分钟之前`
        }
        else if(offsetST >= 1){
          return `发表于 ${Math.floor(offsetST)} 秒钟之前`
        }
      }
    },
    methods:{
      getBlogById(firstView){
        BlogService.getBlogById({blogId:this.blogId,firstView}).then(res => {
          if(res.data.status === 200){
            this.blogData = res.data.data.blogData
          }
        })
      },
      goBack(){
        this.$router.go(-1)
      },
      switchLike(){
        if(this.userData.userDetail.likes.includes(this.blogId)){
          //取消点赞
          UserDetailService.deleteLike({blogId:this.blogId}).then(res => {
            if(res.data.status === 200){
              this.userData.userDetail.likes.splice(this.userData.userDetail.likes.indexOf(this.blogId),1)
              sessionStorage.setItem('userData',JSON.stringify(this.userData))
              this.getBlogById(0)
            }
            this.$message.success(res.data.message)
          })
        }else{
          //点赞
          UserDetailService.setLike({blogId:this.blogId}).then(res => {
            if(res.data.status === 200){
              this.userData.userDetail.likes.push(this.blogId)
              sessionStorage.setItem('userData',JSON.stringify(this.userData))
              this.getBlogById(0)
            }
            this.$message.success(res.data.message)
          })
        }
      },
      switchAttention(){
        if(this.userData.userDetail.attentions.includes(this.blogData.author.userName)){
          //取消关注
          UserDetailService.deleteAttention({userName:this.blogData.author.userName}).then(res => {
            if(res.data.status === 200){
              this.userData.userDetail.attentions.splice(this.userData.userDetail.attentions.indexOf(this.blogId),1)
              sessionStorage.setItem('userData',JSON.stringify(this.userData))
              // this.getBlogById(0)
            }
            this.$message.success(res.data.message)
          })
        }else{
          //关注
          UserDetailService.setAttention({userName:this.blogData.author.userName}).then(res => {
            if(res.data.status === 200){
              this.userData.userDetail.attentions.push(this.blogData.author.userName)
              sessionStorage.setItem('userData',JSON.stringify(this.userData))
              // this.getBlogById(0)
            }
            this.$message.success(res.data.message)
          })
        }
      },
      switchBlackList(){
        if(this.userData.userDetail.blackList.includes(this.blogData.author.userName)){
          //取消拉黑
          UserDetailService.deleteBlackList({userName:this.blogData.author.userName}).then(res => {
            if(res.data.status === 200){
              this.userData.userDetail.blackList.splice(this.userData.userDetail.blackList.indexOf(this.blogId),1)
              sessionStorage.setItem('userData',JSON.stringify(this.userData))
              // this.getBlogById(0)
            }
            this.$message.success(res.data.message)
          })
        }else{
          //拉黑
          UserDetailService.setBlackList({userName:this.blogData.author.userName}).then(res => {
            if(res.data.status === 200){
              this.userData.userDetail.blackList.push(this.blogData.author.userName)
              sessionStorage.setItem('userData',JSON.stringify(this.userData))
              // this.getBlogById(0)
            }
            this.$message.success(res.data.message)
          })
        }
      },
      switchTipOff(){
        this.isShowTipOff = !this.isShowTipOff
        if(!this.isShowTipOff){
          let data = {
            blogId:this.blogId,
            description:this.blogData.description,
            cover:this.blogData.cover,
            title:this.blogData.title,
            reason:this.tipOffReason
          }
          TipOffService.tipOffArticle(data).then(res => {
            if(res.data.status === 200){
              this.$message.success(res.data.message)
            }else{
              this.$message.error(res.data.message)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>