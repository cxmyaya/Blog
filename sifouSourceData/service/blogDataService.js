let express = require('express')
let BlogTables = require('../db/BlogDB/blogTable')
let UserTables = require('../db/UserCountDB/userTable')
let UserDetailTables = require('../db/UserDetailDB/userDetailTable')
let {v4} = require('uuid')

let blogApp = express()

//写文章
blogApp.post('/create',async function(req, res){
  let newBlogData = {
    title:req.body.title,
    tags:req.body.tags,
    description:req.body.description,
    cover:req.body.cover,
    content:req.body.content,
    comments:[],
    author:{},
    lastModified:new Date(),
    views:0,
    likes:0,
    blogId:1, //博客 id，一个递增字段，用于标识一个独一无二的博客文章数据
    approved:false
  }

  //mongooseDB没有自增字段，需要我们自己实现
  //生成新的博客 id,对已有的博客 id 进行倒序排列，新的博客 id 为已有博客 id 的最大值加 1
  await BlogTables.find({
  },{
      blogId:true
  },{
    sort:{
      blogId:-1
    }
  }).then(rs => {
    if(rs.length){
      newBlogData.blogId = rs[0].blogId + 1
    }else{
      newBlogData.blogId = 1
    }
  })

  //设置博客作者信息
   UserTables.find({
    token:req.headers.authorization
  }).then( rs => {
    newBlogData.author = {
      userName:rs[0].userName,
      avatar:rs[0].avatar
    }
    
    //往用户详情数据表里的文章列表中增加改博客 id
    UserDetailTables.updateOne({
      key:rs[0].key
    },{
      $push:{
        articles:newBlogData.blogId
      }
    }).then(userDetails => {
      console.log('用户详情添加文章成功')
    })

    //往博客数据表里面创建一个新的文章
    BlogTables.create(newBlogData).then(rs1 => {
      console.log(rs1)
      res.send({
        status:200,
        message:'文章提交成功,请等待管理员审核'
      })
    }).catch(err => {
      console.log(err)
      res.send({
        status:500,
        message:'文章发布失败'
      })
    })

  })

  
})

//获取广场文章
blogApp.get('/getPublicBlog',async function(req, res){
  let params = {}
  let {
    pageNum,
    limit,
    searchKey
  } = req.query

  //用户搜索的内容
  if(searchKey){
    params.title = new RegExp(`${searchKey}`) //模糊查询
  }

  //获取用户的黑名单 -》 不显示黑名单用户的文章
  let blackList = []
  if(req.headers.authorization){
    //只有登录的用户才有黑名单
    await UserTables.find({
      token:req.headers.authorization
    }).then(async userInfo => {
      await UserDetailTables.find({
        key:userInfo[0].key
      }).then(userDetail => {
        blackList = userDetail[0].blackList
      })
    })
  }

  let total = 0 //文章总数
  if(blackList.length){
   params['author.userName'] = {
     $nin:blackList
   }
  }

  //获取所有符合条件的博客
  await BlogTables.find({
    ...params,
    approved:true
  }).then(rs => {
    total = rs.length //获取博客总数
  })

  //博客分页处理
  BlogTables.find({
    ...params,
    approved:true
  },{
    content:false,
    _id:false,
    __v:false
  },{
    //分页
    skip:Number((pageNum-1) * limit), //跳过的记录条数
    limit:Number(limit),
    sort:{ //可以做热度排名
      lastModified:-1
    }
  }).then(blogList => {
    res.send({
      status:200,
      message:"查询成功",
      data:{
        blogList,
        total
      }
    })
  })
})

//根据博客id获取博客详情
blogApp.get('/getBlogById',async function(req, res){
  let params = {
    blogId:req.query.blogId
  }
  await BlogTables.updateOne(
    params,
    {
      $inc:{
        "views":Number(req.query.firstView) //从主页进入详情页阅览数才会加1
      }
    }
  ).then(() => {
    // console.log('博客阅览数自增 1')
  }).catch(err => {
    console.log(err)
  })

  BlogTables.find(
    params
  ).then(rs=> {
    res.send({
      status:200,
      message:'查询成功',
      data:{
        blogData: rs[0]
      }
    })
  }).catch(err => {
    console.log(err)
  })
})

//评论文章
blogApp.post('/comment/create',function(req, res){
  let reqData = req.body
  let commentData = {
    ...reqData.comment,
    lastModified:new Date(),
    commentId:v4()
  }

  //更新用户详情数据表
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    let key = rs[0].key
    UserDetailTables.updateOne({
      key,
      comments:{
        $elemMatch:{
          blogId:reqData.blogId
        }
      }
    },{
        $push:{
          'comments.$.commentData':{
              ...commentData
          }
        }
    }).then(async (detailList) => {

      //用户详情表当前没有这个博客 id 的评论数据
      if(detailList.n < 1){
        let blogData = {} //取出这个博客 id 的基本数据

        await BlogTables.find({
          blogId:reqData.blogId
        },{
          title:true,
          author:true,
          cover:true,
          description:true,
          lastModified:true
        }).then(blog => {
          blogData = blog[0]
        })

        UserDetailTables.updateOne({
          key
        },{
          $push:{
            'comments':{
              blogId:reqData.blogId,
              blogData,
              commentData:[
                commentData
              ]
            }
          }
        }).then(userDetailData => {
          console.log('第一次创建博客评论数据成功')
        })
      }
    })
  }).catch(err => {
    console.log(err)
  })

  //更新博客数据表
  if(reqData.fatherId){
    //往博客里面的某个评论的comment字段添加值
    BlogTables.updateOne({
      blogId:reqData.blogId,
      comments:{
        $elemMatch:{
          commentId:reqData.fatherId
        }
      }
    },{
      $push:{
        'comments.$.comments':commentData
      }
    }).then(() => {
      console.log('新增一个二级评论')
      res.send({
        status:200,
        message:'评论成功',
        data:{
          commentData,
          userData:reqData.userData
        }
      })
    }).catch(err => {
      console.log(err)
      res.send({
        status:500,
        message:'评论失败',
      })
    })
  }else{
    //往博客里面的comment字段添加值
    BlogTables.updateOne({
      blogId:reqData.blogId,
    },{
      $push:{
        'comments':commentData
      }
    }).then(() => {
      console.log('新增一个一级评论')
      res.send({
        status:200,
        message:'评论成功',
        data:{
          commentData
          // userData:reqData.userData
        }
      })
    }).catch(err => {
      console.log(err)
      res.send({
        status:500,
        message:'评论失败',
      })
    })
  }
})

//获取我的博客
blogApp.get('/getMyBlog',async function(req, res){
  let params = {}
  let {
    pageNum,
    limit,
    searchKey
  } = req.query

  //用户搜索的内容
  if(searchKey){
    params.title = searchKey
  }
  let total = 0 //文章总数
  //获取所有符合条件的博客
  UserTables.find({
    token:req.headers.authorization
  }).then(async (rs) => {
    if(rs.length){
      await BlogTables.find({
        'author.userName':rs[0].userName,
        ...params
      }).then(blogList => {
        total = blogList.length //获取博客总数
      })
    
      //博客分页处理
      BlogTables.find({
        'author.userName':rs[0].userName,
        ...params
      },{
        content:false,
        _id:false,
        __v:false
      },{
        //分页
        skip:Number((pageNum-1) * limit), //跳过的记录条数
        limit:Number(limit),
        sort:{ //可以做热度排名
          lastModified:-1
        }
      }).then(blogList => {
        res.send({
          status:200,
          message:"查询成功",
          data:{
            blogList,
            total
          }
        })
      })
    }
  })
})

//获取我点赞的博客
blogApp.get('/getMyLike',async function(req, res){
  let params = {}
  let {
    pageNum,
    limit,
    searchKey
  } = req.query

  //用户搜索的内容
  if(searchKey){
    params.title = searchKey
  }
  let total = 0 //文章总数
  let likes = [] //我点赞的所有博客id
  //获取所有符合条件的博客
  UserTables.find({
    token:req.headers.authorization
  }).then(async (rs) => {
    if(rs.length){
      await UserDetailTables.find({
        key:rs[0].key
       }).then(userDetails => {
         likes = userDetails[0].likes
         total = likes.length //获取博客总数
       })
     
       //博客分页处理
       BlogTables.find({
         blogId:{
           $in:likes
         },
         ...params
       },{
         content:false,
         _id:false,
         __v:false
       },{
         //分页
         skip:Number((pageNum-1) * limit), //跳过的记录条数
         limit:Number(limit),
         sort:{ //可以做热度排名
           lastModified:-1
         }
       }).then(blogList => {
         res.send({
           status:200,
           message:"查询成功",
           data:{
             blogList,
             total
           }
         })
       })
    }
  
  })
})

//获取未审核的文章
blogApp.get('/getUnapprovedBlogs',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(async rs => {
    if(rs.length && rs[0].isAdmin){
      let {pageNum, limit} = req.query
      let total = 0
     await BlogTables.find({
       approved:false
     }).then(unapprovedBlog => {
        total = unapprovedBlog.length
     })

     BlogTables.find({
      approved:false
    },{
      _id:false,
      __v:false
    },{
      skip:Number((pageNum - 1) * limit),
      limit:Number(limit)
    }).then(unapprovedBlog => {
       res.send({
         status:200,
         message:'查询成功',
         data:{
           total,
           blogList:unapprovedBlog
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

//获取所有文章（包括未审核的）
blogApp.get('/getAllBlog',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(async rs => {
    if(rs.length && rs[0].isAdmin){
      let {pageNum, limit} = req.query
      let total = 0
     await BlogTables.find().then(unapprovedBlog => {
        total = unapprovedBlog.length
     })

     BlogTables.find({
    },{
      _id:false,
      __v:false
    },{
      skip:Number((pageNum - 1) * limit),
      limit:Number(limit)
    }).then(unapprovedBlog => {
       res.send({
         status:200,
         message:'查询成功',
         data:{
           total,
           blogList:unapprovedBlog
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

//审核通过文章
blogApp.post('/approvedBlog',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    if(rs.length && rs[0].isAdmin){
      BlogTables.updateOne({
        blogId:req.body.blogId
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

//删除文章
blogApp.post('/deleteBlog',function(req, res){
  UserTables.find({
    token:req.headers.authorization
  }).then(rs => {
    if(rs.length && rs[0].isAdmin){
      BlogTables.deleteOne({
        blogId:req.body.blogId
      }).then(() => {
        res.send({
          status:200,
          message:'删除文章成功'
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
module.exports = {blogApp}