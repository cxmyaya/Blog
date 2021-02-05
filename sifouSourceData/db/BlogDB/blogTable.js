let mongoose = require('mongoose')
let Schema = mongoose.Schema
let blogItem = new Schema({
  title:{
    type:String,
    required:true
  },
  tags:{
    type:Array,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  cover:{
    type:String,
    // required:true
  },
  content:{
    type:String,
    reuqired:true
  },
  comments:{ //复杂结构
    type:Array,
    required:true
  },
  author:{  //复杂结构
    type:Object,
    required:true
  },
  lastModified:{
    type:Date,
    required:true
  },
  views:{
    type:Number,
    required:true
  },
  likes:{
    type:Number,
    required:true
  },
  blogId:{
    type:Number,
    required:true
  },
  approved:{
    type:Boolean,
    required:true
  }
})

let blogTables = mongoose.model('blogTables',blogItem)
module.exports = blogTables