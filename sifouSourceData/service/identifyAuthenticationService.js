let express = require('express')
let crypto = require('crypto')
let {v4} = require('uuid')

let userCountTables = require('../db/UserCountDB/userTable') 
let userDetailtTables = require('../db/UserDetailDB/userDetailTable') 

function enCryptData(data, key, algorithm){
  if(!crypto.getHashes().includes(algorithm)){
    throw new Error('不支持此哈希函数')
  }
  const hmac = crypto.createHmac(algorithm,key) //用加密算法和密钥
  hmac.update(data) // 对数据加密
  return hmac.digest('hex') //以十六进制返回加密后的字符串
}

let authenticationApp = express()

//注册用户
authenticationApp.post('/registerUser',function(req, res){
  let key = v4() //生成一个独一无二的密钥
  let password = enCryptData(req.body.password, key, 'sha256') //对用户设置的密码用密钥和加密算法'sha256'进行加密存储
  let userName = req.body.username //用户名
  let avatar = req.body.avatar //头像
  let token = enCryptData(v4(), v4(), 'sha256') //生成一个随机令牌

  userCountTables.find({
    userName:userName
  }).then(rs => {
    if(rs.length){
      res.send({
        status:200,
        message:"该用户名已被使用，请换一个用户名"
      })
    }else{
      userCountTables.create({
        userName,
        password,
        key,
        token,
        avatar,
        isAdmin:false,
        introduction:'',
        approved:true,
        createTime:new Date()
      }).then(() => {
        res.setHeader('Authorization',token)
        res.send({
          status:200,
          message:'注册成功，请等待审核'
        })
      })

      userDetailtTables.create({
        key,
        comments:[],
        articles:[],
        likes:[],
        attentions:[],
        blackList:[]
      })
    }
  })
})

//验证用户
authenticationApp.get('/checkPermission',function(req, res){
  userCountTables.find({
    token:req.headers.authorization
  }).then(async rs => {
    if(rs.length){
      let userDetail = null
      await userDetailtTables.find({
        key:rs[0].key
      },{
        key:false,
        _id:false,
        __v:false
      }).then(rs2 => {
        if(rs2.length){
          userDetail = rs2[0]
        }
      })
      res.send({
        status:200,
        message:'用户鉴权成功',
        data:{
          userData:{
            userName:rs[0].userName,
            avatar:rs[0].avatar,
            introduction:rs[0].introduction,
            isAdmin:rs[0].isAdmin,
            userDetail
          }
        }
      })
    }else{
      res.send({
        status:500,
        message:'用户鉴权失败'
      })
    }
  })
})

//用户登录
authenticationApp.post('/loginUser',function(req, res){
  userCountTables.find({
    userName:req.body.username
  }).then(rs => {
    if(rs.length){
      if(rs[0].password === enCryptData(req.body.password, rs[0].key, 'sha256')){
        res.setHeader('Authorization',rs[0].token)
        res.send({
          status:200,
          message:'登录成功'
        })
      }else{
        res.send({
          status:500,
          message:'密码不正确'
        })
      }
    }else{
      res.send({
        status:500,
    