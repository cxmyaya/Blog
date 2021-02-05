<template>
  <div>
    <div
      v-for='(commentItem, index) in localComment'
      :key='index'
      class="comment-card"
      style="margin-bottom: 20px;"
    >
      <el-row :gutter="10" >
        <el-col :span="2">
          <el-avatar :src='commentItem.userData.avatar' size='large'></el-avatar>
        </el-col>
        <el-col :span="6" style="font-size: 12px;">
          <span>{{commentItem.userData.userName}}</span>
          <br>
          <span>{{commentItem.lastModified | transformTime}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24" style="text-indent:2em;">
          {{commentItem.content}}
        </el-col>
        <el-col :span="24" style="border-left:2px solid #ccc">
          <div
            v-for='(sonCommentItem, index) in commentItem.comments'
            :key='index'
            style="margin: 20px; border-bottom: 1px dashed #ccc;"
          >
            <el-row :gutter="10" >
              <el-col :span="2">
                <el-avatar :src='sonCommentItem.userData.avatar'  size='large'></el-avatar>
              </el-col>
              <el-col :span="6" style="color:#409EFF;font-size: 12px;">
                <span>{{sonCommentItem.userData.userName}}</span>
                <br>
                <span>{{sonCommentItem.lastModified | transformTime}}</span>
              </el-col>
              <el-col :span="16" style="text-indent:2em;">
                {{sonCommentItem.content}}
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="text" icon="el-icon-s-comment" @click='switchComment(commentItem)'>回复</el-button>
        </el-col>
      </el-row>
      <el-row :gutter='10' v-if='commentItem.isComment'>
        <el-col :span="24">
          <el-input v-model='commentStr' placeholder="说点什么吧~"></el-input>
        </el-col>
        <el-col :span="24" style="text-align: right; margin-top: 10px;">
          <el-button type='primary' size="mini" @click='cancelComment(commentItem,"son")'>取消</el-button>
          <el-button type='primary' size="mini" @click='addComment(commentItem,"son")'>回复</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter='10' v-if='isComment'>
      <el-col :span="24">
        <el-input v-model='articleCommentStr' placeholder="说点什么吧~"></el-input>
      </el-col>
      <el-col :span="24" style="text-align: right; margin-top: 10px;">
        <el-button type='primary' size="mini" @click='cancelComment(localComment,"father")'>取消</el-button>
        <el-button type='primary' size="mini" @click='addComment(localComment,"father")'>回复</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import BlogService from '@/service/BlogService'
  export default {
    name: "GlobalComment",
    props:{
      blogId:{
        type:Number,
        default:0
      },
      comments:{
        type:Array,
        default(){
          return []
        }
      }
    },
    watch:{
      comments:{
        handler(){
          this.localComment = this.comments.slice(0)
        },
        immediate:true
      }
    },
    data(){
      return {
        articleCommentStr:'',
        commentStr:'',
        localComment:[],
        isComment:true,
        userData:JSON.parse(sessionStorage.getItem('userData')),

      }
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
        else if(offsetST >= 0){
          // return `发表于 ${Math.floor(offsetST)} 秒钟之前`
          return '刚刚'
        }
      }
    },
    methods:{
      switchComment(commentItem){
        this.localComment.forEach(item => {
          if(item != commentItem){
            item.isComment = false
          }
        })
        commentItem.isComment = !commentItem.isComment
          if(!commentItem.isComment){
            this.isComment = true
          }else{
            this.isComment = false
          }
      },
      cancelComment(target,type){
        switch(type){
          case 'father':
            this.articleCommentStr = ''
            break;
          case 'son':
            this.commentStr = ''
            target.isComment = false
            this.isComment = true
            break;
        }
      },
      addComment(target, type){
        let commentData = {
          fatherId:'',
          blogId:this.blogId,
          comment:{}
        }
        switch(type){
          case 'father':
            commentData.comment = {
              userData:{
                userName:this.userData.userName,
                avatar:this.userData.avatar
              },
              content:this.articleCommentStr,
              isComment:false,
              comments:[]
            }
            this.articleCommentStr = ''
            break;
          case 'son':
            commentData.fatherId = target.commentId
            commentData.comment = {
              userData:{
                userName:this.userData.userName,
                avatar:this.userData.avatar
              },
              content:this.commentStr,
            }
            this.commentStr = ''
            target.isComment = false
            this.isComment = true
            break;
        }
        BlogService.createBlogComment(commentData).then(res => {
          if(res.data.status === 200){
            switch(type){
              case 'father':
                target.push(res.data.data.commentData)
                break;
              case 'son':
                target.comments.push(res.data.data.commentData)
                break;
            }
            this.$message.success(res.data.message)
          }else{
            this.$message.err(res.message)
          }
        })

      }
    }
  }
</script>

<style scoped>
  .comment-card{
    padding:20px;
    box-shadow: 0 2px 4px rgba(0,0,0,.5);
  }
</style>