<template>
  <div>
    <el-card v-loading="isPublishing" class='box-card'>
      <div slot="header" class="clearfix">
        <span>写文章</span>
        <el-button style="float: right; padding: 3px 0" type="text"  @click='publish'>发布</el-button>
      </div>
      <el-row :gutter="200" style="margin-bottom:20px">
        <el-col :span="4">
          <el-upload
            class="avatar-uploader"
            :action="`${defaultConfig.baseApiUrl}/uploadImg`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            name='blogIllustrations'
            >
            <img v-if="blogData.cover" :src="blogData.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon">封面</i>
          </el-upload>
        </el-col>
        <el-col :span="20">
          <el-form :model="blogData" ref='blogForm' :rules="rules">
            <el-form-item prop="title">
              <el-row>
                <el-input placeholder="请输入文章标题" v-model='blogData.title' clearable></el-input>
              </el-row>
            </el-form-item>
            <el-form-item prop="description">
              <el-row>
                <el-input placeholder="请输入文章简介" v-model='blogData.description' clearable ></el-input>
              </el-row>
            </el-form-item>
          </el-form>
          <el-row>
            <el-tag
              :key="tag"
              v-for="tag in blogData.tags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="tagValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div id="editor" ref='editor'></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import defaultConfig from '@/config/config.default'
  import Editor from 'wangeditor'
  import hljs from 'highlight.js'
  import ImgFileService from '@/service/ImgFileService'
  import blogService from '@/service/BlogService'
  export default {
    name: "GlobalEditor",
    data(){
      return {
        defaultConfig,
        Editor,
        hljs,
        tagValue:'',
        inputVisible:false,
        editor:null,
        isPublishing:false,
        blogData:{
          cover:null, //封面图片地址
          title:'',
          description:'',
          tags:[],
          content:''
        },
        rules:{
          title:{required:true, message:'请输入文章标题', trigger:'blur'},
          description:{required:true, message:'请输入文章简介', trigger:'blur'}
        }
      }
    },
    mounted(){
     this.initEditor()
    },
    methods:{
      publish(){
        this.$refs.blogForm.validate(valid => {
          if(valid){
            this.blogData.content = this.editor.txt.html()
            if(!this.blogData.content){
              this.$message.warning('文章内容不能为空')
            }else{
              this.isPublishing = true
              blogService.createBlog(this.blogData).then(res => {
                if(res.data.status === 200){
                  this.$message.success(res.data.message)
                  this.$emit('publishSuccess')
                }else{
                  this.$message.error(res.data.message)
                }
              }).finally(() => {
                this.isPublishing = false
              })
            }
          }
        })
      },
      handleAvatarSuccess(res){
        this.blogData.cover = res.data.imgList[0]
      },
      handleClose(tag){
        this.blogData.tags.splice(this.blogData.tags.indexOf(tag,1))
      },
      handleInputConfirm(){
        if(this.tagValue){
          this.blogData.tags.push(this.tagValue)
        }
        this.inputVisible = false
        this.tagValue = ''
      },
      showInput(){
        this.inputVisible = true
        this.$nextTick( () => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      initEditor(){
        this.editor = new Editor(this.$refs.editor) //初始化编辑器
        this.editor.highlight = hljs //实现代码编辑器里的代码高亮
      
        //功能菜单配置
        this.editor.config.menus = [
          'head',
          'bold',
          'fontSize',
          'fontName',
          'italic',
          'underline',
          'strikeThrough',
          'indent',
          'lineHeight',
          'foreColor',
          'backColor',
          'link',
          'list',
          'justify',
          'quote',
          'emoticon',
          'image',
          'video',
          'table',
          'code',
          'splitLine',
          'undo',
          'redo',
      ]

        //编辑器基本尺寸、聚焦、占位符的相关配置
        this.editor.config.height = 400
        this.editor.config.placeholder = '请输入文章内容'
      

        //字体颜色、背景色的预设值
        this.editor.config.colors.push('#58a','yellow')

        //字体种类
        // this.editor.config.fontNames = ['黑体']

        //字号预设值
        this.editor.config.fontSizes = {
          'x-small': { name: '10px', value: '1' },
          'small': { name: '13px', value: '2' },
          'normal': { name: '16px', value: '3' },
          'large': { name: '18px', value: '4' },
          'x-large': { name: '24px', value: '5' },
          'xx-large': { name: '32px', value: '6' },
          'xxx-large': { name: '48px', value: '7' },
        }

        //行高配置
        // this.editor.config.lineHeights = ['1','1.25']

        //表情包
        this.editor.config.emotions = [
          {
            title:'收藏',
            type:'image',
            content:[
              {
                alt:'[嘿嘿]',
                src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608379345609&di=130d3873ab4bfbd933ce484672cd3978&imgtype=0&src=http%3A%2F%2Fww3.sinaimg.cn%2Flarge%2F9150e4e5jw1fc6cgaj6amj203405kq2u.jpg'
              },
              {
                alt:'[妙啊]',
                src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1067150941,30006510&fm=26&gp=0.jpg'
              }
            ]
          }
        ]

        //支持的编辑语言
        // this.editor.config.languageType = []

        //是否支持全屏
        this.editor.config.showFullScreen = true

        //自定义的插入链接的内容校验
        this.editor.config.linkCheck = function(text,link){
          console.log(text,link)
          //校验规则
          return true
        }

        //插入网络图片的内容校验
        this.editor.config.linkImgCallback = function(imgSrc){
          console.log(imgSrc)
          //校验规则
          return true
        }

        //插入本地图片的校验
        this.editor.config.linkImgCheck = function(imgSrc){
          console.log(imgSrc)
          //校验规则
          return true
        }

        //上传图片大小和个数的限制
        this.editor.config.uploadImgMaxSize = 2*1024*1024 //2M
        this.editor.config.uploadImgMaxLength = 9 //9张

        //插入本地图片，实现本地图片上传并插入到编辑器里
        this.editor.config.customUploadImg = function(resultFiles, insertImgFn){
          //resultFiles: 相当于 input type=file 选中的目标
          //insertImgFn: 回调函数，获取图片的最终地址，插入到编辑器
          let imgData = new FormData()
          for(let i = 0, len = resultFiles.length; i < len; i++){
            imgData.append('blogIllustrations',resultFiles[i])
          }
          ImgFileService.uploadImgFile(imgData).then(res => {
            if(res.data.status === 200){
              let imgList = res.data.data.imgList
              for(let i = 0, len = imgList.length; i < len;  i++){
                insertImgFn(imgList[i])
              }
            }
          })
        }

        //粘贴文本的内容处理
        this.editor.config.pasteTextHandle = function(pasteStr){
          console.log(pasteStr)
          return '解析过后的pasteStr'
        }
        //编辑器内容的获取 纯文本、html、json格式的

        //编辑器内容的修改

        this.editor.create() //把实例变成元素
      }
    },
    beforeDestroy(){
      this.editor.destroy() //
    }
  }
</script>

<style scoped>
  /deep/ .el-divider--horizontal{
    margin:12px 0
  }
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
  /deep/ .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  /deep/ .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  /deep/ .el-tag + .el-tag {
    margin-left: 10px;
  }
  /deep/ .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  /deep/ .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>