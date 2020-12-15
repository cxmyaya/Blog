let express = require('express')
let mongoose = require('mongoose')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let apiAddr = require('./config/PublicPath')


//连接数据库
mongoose.connect('mongodb://localhost:27017/blogDB',{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(() => {
  console.log('数据库连接成功！')
}).catch(() => {
  console.log("数据库连接失败！")
})
let app = express() //生成服务实例

//启用通用中间件
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//处理跨域请求
app.all('*',function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*') //允许通过的源
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS') 
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,Content-Type,Authorization')
  res.setHeader('Access-Control-Expose-Headers','Authorization')
  next()
})


//挂载其他应用
let {uploadImgFileApp} = require('./service/img.file.upload.service')
let {getImgFileApp} = require('./service/img.file.get.service')
let {authenticationApp} = require('./service/identifyAuthenticationService')

//启用各种服务
app.use(apiAddr.uploadImgApiAddr,uploadImgFileApp)
app.use(apiAddr.getImgApiAddr,getImgFileApp)
app.use(apiAddr.authenticationApiAddr,authenticationApp)

//启动服务
app.listen(8888)
console.log('思否后端系统启动了~')