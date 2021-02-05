let express = require('express')
let siteApp = express()
let axios = require('axios')
let gaodeMapKey = "31c5ace788900a50490709b32f7aedbb"

siteApp.use(express.static(`${__dirname}/site`))
siteApp.all('*',function(req, res, next){
  console.log(req.ip)
  next()
})

siteApp.listen(8080)