<template>
  <div>
    <el-page-header @back="goBack">
    </el-page-header>
    <div class="chat-wrapper">
      <div class="content-area" ref='contentArea'>
      <div class="msg-box"  v-for='(item, index) in msgList' :key='index'>
        <div
        :style="{
          float:item.type === 'me' ? 'right' : 'left',
          padding:'10px'
        }"
        >
        <div 
        :style="{
          float:item.type === 'me' ? 'right' : 'left'
        }">
          <el-avatar :size="40" :src='item.avatar' style="display: block;margin: 0 auto"></el-avatar>
          <span style='font-size: 12px;'>{{item.userName}}</span>
        </div>
        <el-card
        :style="{
          float:item.type === 'me' ? 'right' : 'left',
          margin:'0 10px'
        }">
          <span v-if="item.msg.type==='text'">{{item.msg.content}}</span>
          <el-image v-else :src="item.msg.content"></el-image>
        </el-card>
        
        </div>
      </div>
      </div>
      <div class="tool-bar">
        <el-row style=" text-align: center;box-shadow: 0 0px 10px 1px #ccc">
          <el-col :span='2' style="line-height: 40px; cursor: pointer;" class="select-img">
            <i class="el-icon-picture-outline" style="cursor: pointer;"></i>
            <input @change='sendImg' type="file" ref='selectImg' style="position: absolute;z-index: 10;top: 0;left: 0;opacity: 0;">
          </el-col>
          <el-col :span='20'>
            <el-input v-model="msgText" @keypress.enter.native='sendText'></el-input>
          </el-col>
          <el-col :span='2'>
            <el-button type="text" icon='el-icon-s-promotion' @click='sendText'></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  async function cutImageBase64(files, width, quality){
    return new Promise((res => {
      const file = files[0]
      let URL = window.URL || Window.webkitURL
      let blob = URL.createObjectURL(file) //获取当前文件的一个内存URL
      let base64
      const img = new Image()
      img.src = blob
      img.onload = function(){
        let w = this.width
        let h = this.height
        let scale = w / h
        w = width || w
        h = w / scale
        const canvas = document.createElement('canvas')
        const canCon = canvas.getContext('2d')
        canvas.width = w 
        canvas.height = h
        canCon.drawImage(this, 0, 0, w, h)
        let ext = this.src.substring(this.src.lastIndexOf(".") + 1).toLowerCase();
        base64 = canvas.toDataURL('image/'+ext, quality || 0.8)
        res(base64)
      }
    }))

  }
  import defaultConfig from '@/config/config.default'
  export default {
    name: "chatHome",
    data(){
      return {
        socket:null,
        msgText:'',
        message:{
          userName:'',
          avatar:'',
          msg:{
            type:'',
            content:' '
          }
        },
        userData:JSON.parse(sessionStorage.getItem('userData')),
        msgList:[]
      }
    },
    watch:{
      userData:{
        handler(){
          this.message.userName = this.userData.userName
          this.message.avatar = this.userData.avatar
        },
        immediate:true
      }
    },
    mounted(){
      this.socket = new WebSocket(`${defaultConfig.wssApiUrl}`)
      let vm = this

      //成功连接聊天室
      this.socket.addEventListener('open',function(){
        vm.$message.success('加入聊天室')
      })

      //接收信息
      this.socket.addEventListener('message',function(event){
        vm.msgList.push({
          ...JSON.parse(event.data),
          type:'other'
        })
        vm.$nextTick(() => {
          vm.$refs.contentArea.scrollTop = vm.$refs.contentArea.scrollHeight
        })
      })
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      sendImg(){
        cutImageBase64(this.$refs.selectImg.files, 400, 0.6).then(rs => {
          this.message.msg.type = 'img'
          this.message.msg.content = rs
          this.socket.send(JSON.stringify(this.message))
          this.msgList.push({
            ...JSON.parse(JSON.stringify(this.message)),
            type:'me'
          })
          this.$nextTick(() => {
            this.$refs.contentArea.scrollTop = this.$refs.contentArea.scrollHeight
          })
          this.message.msg.type = ''
          this.message.msg.content = '  '
        })
      },
      sendText(){
        if(!this.msgText){
          this.$message.warning('不能发送空消息')
          return 
        }
        this.message.msg.type = 'text'
        this.message.msg.content = this.msgText
        this.socket.send(JSON.stringify(this.message)) //发送信息
        this.msgText = ''
        this.msgList.push({
          ...JSON.parse(JSON.stringify(this.message)),
          type:'me'
        })
        this.$nextTick(() => {
          this.$refs.contentArea.scrollTop = this.$refs.contentArea.scrollHeight
        })
        this.message.msg.type = ''
        this.message.msg.content = '  '
      }
    }
  }
</script>

<style scoped>
  .chat-wrapper{
    position: relative;
    width: 100%;
    height: calc(100vh - 24px);
  }
  .content-area{
    height:calc(100% - 40px);
    overflow-y: auto;
  }
  .tool-bar{
    position:absolute;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    height:40px;
    background-color: #fff;
  }
  .select-img:hover{
    color:#409EFF
  }
  .msg-box::after{
    content:'';
    display: block;
    clear:both
  }
  .el-card__body{
    padding:10px
  }
</style>
<!--
  保持长连接
    服务器上主动给用户发送信息
    socket(套接字)

  轮询：
    每隔一段时间就向后端发送请求

-->