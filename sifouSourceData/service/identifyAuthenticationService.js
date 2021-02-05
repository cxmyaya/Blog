let express = require('express')
let crypto = require('crypto')
let {v4} = require('uuid')

let UserTables = require('../db/UserCountDB/userTable') 
let userDetailtTables = require('../db/UserDetailDB/userDetailTable') 
let BlogTables = require('../db/BlogDB/blogTable')


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

  UserTables.find({
    userName:userName
  }).then(rs => {
    if(rs.length){
      res.send({
        status:500,
        message:"该用户名已被使用，请换一个用户名"
      })
    }else{
      UserTables.create({
        userName,
        password,
        key,
        token,
        avatar,
        isAdmin:false,
        introduction:'',
        approved:false,
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
  UserTables.find({
    token:req.headers.authorization
  }).then(async rs => {
    if(rs.length && rs[0].approved){
      let userDetail = null
      let views = 0
      let likes = 0
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

      await BlogTables.find({
        'author.userName':rs[0].userName
      }).then(blogList => {
        blogList.forEach(blogData => {
          views += blogData.views
          likes += blogData.likes
        })
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
            userDetail,
            views,
            likes
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
  UserTables.find({
    userName:req.body.username
  }).then(rs => {
    if(rs.length){
      if(rs[0].password === enCryptData(req.body.password, rs[0].key, 'sha256')){
       if(rs[0].approved){
        res.setHeader('Authorization',rs[0].token)
        res.send({
          status:200,
          message:'登录成功'
        })
       }else{
        res.send({
          status:500,
          message:'该账号正在审核中'
        })
       }
      }else{
        res.send({
          status:500,
          message:'密码不正确'
        })
      }
    }else{
      res.send({
        status:500,
        message:'用户不存在'
      })
    }
  })
})

//更新用户信息
authenticationApp.post('/updateUserInfo',function(req, res){
  UserTables.updateOne({
    token:req.headers.authorization
  },{
    $set:{
      avatar:req.body.avatar,
      introduction:req.body.introduction
    }
  }).then(rs => {
    res.send({
      status:200,
      message:'用户信息更新成功'
    })
  }).catch(err => {
    console.log(err)
    res.send({
      status:500,
      message:'用户信息更新失败'
    })
  })
})

//获取用户信息
authenticationApp.get('/getUserInfo',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    console.log(rs[0])
    if(rs.length){
      res.send({
        status:200,
        message:'查询成功',
        data:{
          avatar:rs[0].avatar,
          introduction:rs[0].introduction
        }
      })
    }
  })
})

//获取所有用户（包括未审核的）
authenticationApp.get('/getAllUser',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(async rs => {
    if(rs.length && rs[0].isAdmin){
      let {pageNum, limit} = req.query
      let total = 0
      await UserTables.find().then(allUsers => {
        total = allUsers.length
      })

      UserTables.find({
      },{
        _id:false,
        __v:false
      },{
        skip:Number((pageNum - 1) * limit),
        limit:Number(limit)
      }).then(allUsers => {
        res.send({
          status:200,
          message:'查询成功',
          data:{
            total,
            userList:allUsers
          }
        })
      })
    }else{
      res.send({
        status:401, 
        message:'没有操作权限'
      })
    }
  })
})

//获取未通过审核的用户
authenticationApp.get('/getUnapprovedUsers',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(async rs => {
    if(rs.length && rs[0].isAdmin){
      let {pageNum, limit} = req.query
      let total = 0
      await UserTables.find({
        approved:false
      }).then(unapprovedUsers => {
        total = unapprovedUsers.length
      })

      UserTables.find({
        approved:false
      },{
        _id:false,
        __v:false
      },{
        skip:Number((pageNum - 1) * limit),
        limit:Number(limit)
      }).then(unapprovedUsers => {
        res.send({
          status:200,
          message:'查询成功',
          data:{
            total,
            userList:unapprovedUsers
          }
        })
      })
    }else{
      res.send({
        status:401, 
        message:'没有操作权限'
      })
    }
  })
})

//审核通过用户注册
authenticationApp.post('/approvedUser',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    if(rs.length && rs[0].isAdmin){
      UserTables.updateOne({
        key:req.body.key
      },{
        $set:{
          approved:true
        }
      }).then(() => {
        res.send({
          status:200,
          message:'审核通过'
        })
      })
    }else{
      res.send({
        status:401,
        message:'没有操作权限'
      })
    }
  })
})

//删除用户
authenticationApp.post('/deleteUser',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(async rs => {
    if(rs.length && rs[0].isAdmin){
      await BlogTables.deleteMany({
        "author.userName":rs[0].userName
      }).then(() => {
        console.log('删除用户所有文章')
      })

      await userDetailtTables.deleteMany({
        key:req.body.key
      }).then(() => {
        console.log('删除用户详情数据')
      })

      UserTables.deleteMany({
        key:req.body.key
      }).then(() => {
        console.log('删除用户账号信息')
      })
      res.send({ 
        status:200,
        message:'删除用户成功'
      })
    }else{
      res.send({
        status:401,
        message:'没有操作权限'
      })
    }
  })
})

//设置/取消管理员权限
authenticationApp.post('/setAdmin',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    if(rs.length && rs[0].isAdmin){
      UserTables.updateOne({
        key:req.body.key
      },{
        $set:{
          isAdmin:req.body.isAdmin
        }
      }).then(() => {
        res.send({
          status:200,
          message:'更改用户权限成功'
        })
      })
    }else{
      res.send({
        status:200,
        message:'没有操作权限'
      })
    }
  })
})

//是否冻结账号
authenticationApp.post('/setApproved',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    if(rs.length && rs[0].isAdmin){
      UserTables.updateOne({
        key:req.body.key
      },{
        $set:{
          approved:req.body.approved
        }
      }).then(() => {
        res.send({
          status:200,
          message:'更改用户账号状态成功'
        })
      })
    }else{
      res.send({
        status:200,
        message:'没有操作权限'
      })
    }
  })
})

//获取用户注册信息
authenticationApp.get('/getUserRegisterInfo',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    if(rs.length && rs[0].isAdmin){
      UserTables.find({},{
        createTime:true
      }).then(userList => {
        res.send({
          status:200,
          message:'查询成功',
          data:userList
        })
      })
    }else{
      res.send({
        status:401,
        message:"没有操作权限"
      })
    }
  })
})

//获取文章发布数据
authenticationApp.get('/getBlogInfo',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    if(rs.length && rs[0].isAdmin){
      BlogTables.find({},{
        lastModified:true
      }).then(blogList => {
        res.send({
          status:200,
          message:'查询成功',
          data:blogList
        })
      })
    }else{
      res.send({
        status:401,
        message:"没有操作权限"
      })
    }
  })
})
module.exports = {
  authenticationApp
}

