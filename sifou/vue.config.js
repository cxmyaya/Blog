module.exports = {
  publicPath:'./', //公共路径  当前目录
  outputDir:'site', //输出目录
  pages:{
    adimin:{
      entry:'src/pages/admin/main.js', //应用入口配置
      template:'public/admin.html', //html模板
      filename:'admin.html', //打包文件名
      title:'用户管理界面'
    },
    user:{
      entry:'src/pages/user/main.js',
      template:'public/index.html',
      filename:'index.html',
      title:'思否'
    },
    login:{
      entry:'src/pages/login/main.js',
      template:'public/login.html',
      filename:'login.html',
      title:'登录'
    }
  },

  //配置开发环境
  devServer:{
    host:'localhost',
    port:8080,
    https:false,
    open:true,
    overlay:{
      warning:true,
      error:true
    }
  },

  //自定义webpack配置
  configureWebpack:{
    devtool:'source-map'
  }
}