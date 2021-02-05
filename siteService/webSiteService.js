let express = require('express')
let siteApp = express()
let axios = require('axios')
let gaodeMapKey = "aaeae4afd773cda6e1342a0b23973261"

siteApp.use(express.static(`${__dirname}/site`))
//在定义了多个路由的时候，使用next对匹配的url会按顺序执行，如果不使用next进行权限转移，只会执行第一个满足的路由规则。
siteApp.all('/',function(req, res, next){
  let visitorIP = ''
  if(req.ip.substr(0,7) === '::ffff:'){
    visitorIP = req.ip.substr(7)
  }
  axios.get('https://restapi.amap.com/v3/ip',{
    params:{
      key:gaodeMapKey,
      output:'JSON',
      ip:visitorIP
    }
  }).then(rs => {
    console.log('IP为:' + visitorIP + '查询结果为：')
    console.log(rs.data)
    axios.post('http://8.129.78.82:8888/api/v1/webSiteData/setVisitorData',{
      ...rs.data,
      ip:visitorIP,
      visitTime:new Date()
    })
  })

  /**
   *  next() 函数用于将当前控制权转交给下一步处理
   *  next（）一般用来编写中间件
      中间件一般不直接对客户端进行响应，而是对请求进行一些预处理，再传递下去；
      中间件一般会在路由处理之前执行；
   */
  next() 
  
})

console.log('网站运行中...')
siteApp.listen(80)