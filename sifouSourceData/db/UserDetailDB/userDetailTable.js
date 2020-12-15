let mongoose = require('mongoose')
let Schema = mongoose.Schema
let userDetail = new Schema({
  key:{
    type:String,
    required:true
  },
  articles:{
    type:Array,
  },
  comments:{
    type:Array,
  },
  likes:{
    type:Array,
  },
  attentions:{
    type:Array,
  },
  blackList:{
    type:Array,
  }
 
})

let userDetailTables = mongoose.model('userDetailTables',userDetail)

module.exports = userDetailTables