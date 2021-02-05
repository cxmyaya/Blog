let express = require('express')
let BlogTables = require('../db/BlogDB/blogTable')
let UserTables = require('../db/UserCountDB/userTable')
let UserDetailTables = require('../db/UserDetailDB/userDetailTable')
let userDetailApp = express()

//点赞
userDetailApp.post('/likes',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(async (rs) => {
    await BlogTables.updateOne({
      blogId:req.body.blogId
    },{
      $inc:{
        likes:1 //点赞数加 1
      }
    }).then(() => {
      console.log('点赞')
    })

    //用户详情表保存所有点赞过的博客id
    UserDetailTables.updateOne({
      key:rs[0].key
    },{
      $push:{
        likes:req.body.blogId
      }
    }).then(() => {
      res.send({
        status:200,
        message:'点赞成功'
      })
    }).catch(err => {
      res.send({
        status:500,
        message:'点赞失败'
      })
    })
  })
})

//取消点赞
userDetailApp.delete('/likes/:blogId',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(async (rs) => {
    await BlogTables.updateOne({
      blogId:Number(req.params.blogId) 
    },{
      $inc:{
        likes:-1 //点赞数减 1
      }
    }).then(() => {
      console.log('取消点赞')
    })

    //用户详情表的点赞博客数组里移除该博客 id
    UserDetailTables.updateOne({
      key:rs[0].key
    },{
      $pull:{
        likes:Number(req.params.blogId)
      }
    }).then(() => {
      res.send({
        status:200,
        message:'取消点赞成功'
      })
    }).catch(err => {
      res.send({
        status:500,
        message:'取消点赞失败'
      })
    })
  })
})

//关注
userDetailApp.post('/attentions',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    UserDetailTables.updateOne({
      key:rs[0].key
    },{
        $push:{
          attentions:req.body.userName
        }
    }).then(() => {
      res.send({
        status:200,
        message:'关注成功'
      })
    }).catch(err => {
      console.log(err)
      res.send({
        status:500,
        message:'关注失败'
      })
    })
  }).catch(err => {
    console.log(err)
    res.send({
      status:500,
      message:'关注失败'
    })
  })
})

//取消关注
userDetailApp.delete('/attentions/:userName',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    UserDetailTables.updateOne({
      key:rs[0].key
    },{
      $pull:{
        attentions:req.params.userName
      }
    }).then(() => {
      res.send({
        status:200,
        message:'已取消关注'
      })
    }).catch(err => {
      console.log(err)
      res.send({
        status:500,
        message:'取消关注失败'
      })
    })
  }).catch(err => {
    console.log(err)
    res.send({
      status:500,
      message:'取消关注失败'
    })
  })
})

//拉黑
userDetailApp.post('/blackList',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    UserDetailTables.updateOne({
      key:rs[0].key
    },{
      $push:{
        blackList:req.body.userName
      }
    }).then(() => {
      res.send({
        status:200,
        message:'已拉黑'
      })
    }).catch(err => {
      console.log(err)
      res.send({
        status:500,
        message:'拉黑失败'
      })
    })
  }).catch(err => {
    console.log(err)
    res.send({
      status:500,
      message:'拉黑失败'
    })
  })
})

//取消拉黑
userDetailApp.delete('/blackList/:userName',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    UserDetailTables.updateOne({
      key:rs[0].key
    },{
      $pull:{
        blackList:req.params.userName
      }
    }).then(() => {
      res.send({
        status:200,
        message:'已取消拉黑'
      })
    }).catch(err => {
      console.log(err)
      res.send({
        status:500,
        message:'取消拉黑失败'
      })
    })
  }).catch(err => {
    console.log(err)
    res.send({
      status:500,
      message:'取消拉黑失败'
    })
  })
})

//获取我的评论
userDetailApp.get('/comment',function(req, res){
  let {pageNum, limit} = req.query
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    if(rs.length){
      UserDetailTables.find({
        key:rs[0].key
      }).then(userDetails => {
        let commentList = userDetails[0].comments.slice((pageNum-1), pageNum*limit)
        res.send({
          status:200,
          message:'获取个人评论成功',
          data:{
            commentList,
            total:userDetails[0].comments.length
          }
        })
      }).catch(err => {
        console.log(err)
        res.send({
          status:200,
          message:'获取个人评论失败'
        })
      })
    }
  })
})

//获取我的黑名单
userDetailApp.get('/blackList',function(req, res){
  let {pageNum, limit} = req.query
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    if(rs.length){
      UserDetailTables.find({
        key:rs[0].key
      }).then(userDetails => {
        let blackList = userDetails[0].blackList.slice((pageNum-1), pageNum*limit)
        UserTables.find({
          userName:{
            $in:blackList
          }
        },{
          userName:true,
          avatar:true,
          introduction:true
        }).then(rs => {
          res.send({
            status:200,
            message:'获取个人黑名单成功',
            data:{
              blackList:rs,
              total:userDetails[0].attentions.length
            }
          })
        })
       
      }).catch(err => {
        console.log(err)
        res.send({
          status:200,
          message:'获取个人黑名单失败'
        })
      })
    }
   
  })
})

//获取我的关注
userDetailApp.get('/attentions',function(req, res){
  let {pageNum, limit} = req.query
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    if(rs.length){
      UserDetailTables.find({
        key:rs[0].key
      }).then(userDetails => {
        let attentionsList = userDetails[0].attentions.slice((pageNum-1), pageNum*limit)
        UserTables.find({
          userName:{
            $in:attentionsList
          }
        },{
          userName:true,
          avatar:true,
          introduction:true
        }).then(rs => {
          res.send({
            status:200,
            message:'获取个人关注成功',
            data:{
              attentionsList:rs,
              total:userDetails[0].attentions.length
            }
          })
        })
       
      }).catch(err => {
        console.log(err)
        res.send({
          status:200,
          message:'获取个人关注失败'
        })
      })
    }
   
  })
})
module.exports = {userDetailApp}


