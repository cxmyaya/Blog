let express = require('express')
let TipOffTables = require('../db/TipOffDataDB/tipOffTable')
let BlogTables = require('../db/BlogDB/blogTable')
let UserTables = require('../db/UserCountDB/userTable')
let UserDetailTables = require('../db/UserDetailDB/userDetailTable')

let tipOffApp = express()

//举报文章
tipOffApp.post('/article',function(req, res){
  TipOffTables.create({
    blogId:req.body.blogId,
    description:req.body.description,
    cover:req.body.cover,
    title:req.body.title,
    reason:req.body.reason
  }).then(() => {
    res.send({
      status:200,
      message:'举报文章成功,请等待管理员处理'
    })
  }).catch(err => {
    console.log(err)
    res.send({
      status:500,
      message:'举报文章失败'
    })
  })
})

//获取举报的文章
tipOffApp.get('/article',async function(req, res){
  let {pageNum, limit} = req.query
  let total = 0
  await TipOffTables.find({}).then(rs => {
    total = rs.length
  })

  TipOffTables.find({},{
    __v:false
  },{
    skip:Number((pageNum - 1) * limit),
    limit:Number(limit)
  }).then(rs => {
    res.send({
      status:200,
      message:'查询成功',
      data:{
        tipOffData:rs,
        total
      }
    })
  })
})

//忽略举报文章
tipOffApp.delete('/tipOffData/:tipOffId', function(req, res){
  TipOffTables.deleteOne({
    _id:req.params.tipOffId
  }).then(rs => {
      res.send({
        status:200,
        message:'已忽略该举报'
      })
  })
})

//删除举报文章
tipOffApp.delete('/article/:tipOffId', async function(req, res){
  await TipOffTables.find({
    _id:req.params.tipOffId
  }).then(rs => {
    if(rs.length){
      BlogTables.deleteOne({
        blogId:rs[0].blogId
      }).then(() => {
        console.log('删除成功')
      })
    }
  })

  TipOffTables.deleteOne({
    _id:req.params.tipOffId
  }).then(rs => {
      res.send({
        status:200,
        message:'已删除该文章'
      })
  })
})
module.exports = {
  tipOffApp
}
