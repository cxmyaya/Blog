let express = require('express')
let path = require('path')
let fs = require('fs')
const apiAddr = require('../config/PublicPath')

let getImgFileApp = express()

getImgFileApp.get('/:imgName',function(req, res){
  res.setHeader('Cnotent-Type','image/*')
  fs.createReadStream(path.resolve(__dirname,`../storage/images/${req.params.imgName}`)).pipe(res)
})

module.exports = {getImgFileApp}