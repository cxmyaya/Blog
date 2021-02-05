let express = require('express')
let visitorTables = require('../db/WebSiteDB/webSiteDB')

let webSiteDataApp = express()

webSiteDataApp.post('/setVisitorData',function(req, res){
  let reqData =req.body
  if((typeof reqData.rectangle) === 'string'){
    let data = {
      ip: reqData.ip,
      visitTime: reqData.visitTime,
      province: reqData.province,
      city: reqData.city,
      location: reqData.rectangle.split(';')[0].split(',')
    }
    visitorTables.create(data).then(() => {
      res.send({
        status:200,
        message:'有人访问啦'
      })
    })

  }else{
    //境外ip获取不到地址
    res.send({
      status:200,
      message:'境外ip不予记录'
    })
  }
})

webSiteDataApp.get('/getVisitorData',async function(req, res){
  let total = 0
  let {pageNum, limit} = req.query
  await visitorTables.find({}).then(rs => {
    total = rs.length
  })
  visitorTables.find({},{
    _id:false,
    __v:false
  },{
    skip:Number((pageNum - 1) * limit),
    limit:Number(limit)
  }).then(visitorData => {
    res.send({
      status:200,
      message:"查询成功",
      data:{
        visitorData,
        total
      }
    })
  })
})

module.exports = {webSiteDataApp}