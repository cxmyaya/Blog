let path = require('path')
let multer = require('multer')
let express = require('express')
let {v4} = require('uuid') //生成唯一标识码
const apiAddr = require('../config/PublicPath')

let uploadImgFileApp = express()

//创建文件存储的位置
let storage = multer.diskStorage({
  destination:function(req,file,cb){
    if(file.mimetype.includes('image')){
      cb(null,path.join(__dirname,'../storage/images'))
    }
  },
  filename:function(req,file,cb){
    cb(null,v4() + file.originalname)
  }
})

let uploadParams = multer({
  storage
})

let uploadConfig = uploadParams.fields([
  {
    name:'blogIllustrations', //需要和前端上传的name保持一致否则报'unexpected field'
    maxCount:9
  }
])

uploadImgFileApp.post('/',uploadConfig,function(req,res){
  // console.log(req.files.blogIllustrations)

  //对接收到的图片信息进行处理再发送出去
  let resData = []
  for(let i = 0, len = req.files.blogIllustrations.length; i < len; i++){
    resData.push(`${apiAddr.hostAddr}${apiAddr.getImgApiAddr}/${req.files.blogIllustrations[i].filename}`)
  }
  res.setHeader('Content-Type','application/json;charset=utf-8')
  res.send({
    status:200,
    message:'上传成功',
    data:{
      imgList:resData
    }
  })
})

module.exports = {
  uploadImgFileApp
}