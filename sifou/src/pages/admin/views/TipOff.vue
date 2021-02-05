<template>
  <div>
    <el-table :data='tipOffData' size='mini'>
      <el-table-column align="center" prop="title" label='标题' min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="blogId" label='博客ID' min-width='80' show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="cover" label='封面' min-width='100'>
        <template slot-scope='scope'>
          <el-image
            fit='fill'
            :src='scope.row.cover'
            style="width:100px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="description" label='简介' min-width='150' show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="reason" label='举报原因' min-width='100' show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label='操作' min-width="200">
        <template slot-scope='scope'>
          <el-button type="primary" size="mini"  @click='goDetail(scope.row)'>查看详情</el-button>
          <el-button type='success' size="mini"  @click='ignore(scope.row)'>忽略举报</el-button>
          <el-button type="danger" size="mini" @click='deleteArticle(scope.row)'>删除文章</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout='prev, pager, next'
      :total='total'
      @current-change="handleCurrentChange"
      :current-page.sync="searchParams.pageNum"
    >
    </el-pagination>
  </div>
</template>

<script>
  import TipOffService from '@/service/TipOffService'
  export default {
    name: "TipOff",
    data(){
      return {
        tipOffData:[],
        total:0,
        searchParams:{
          pageNum:1,
          limit:10
        }
      }
    },
    mounted(){
      this.getTipOffData()
    },
    methods:{
      getTipOffData(){
        TipOffService.getTipOffData(this.searchParams).then(res => {
          if(res.data.status === 200){
            this.tipOffData = res.data.data.tipOffData
            this.total = res.data.data.total
          }
        })
      },
      handleCurrentChange(val){
        this.searchParams.pageNum = val
        this.getTipOffData()
      },
      goDetail(row){
        this.$router.push(`/articleDetail/${row.blogId}`)
      },
      ignore(row){
        TipOffService.ignoreTipOff({tipOffId:row._id}).then(res => {
          if(res.data.status === 200){
            this.$message.success(res.data.message)
            this.getTipOffData()
          }else{
            this.$message.error('操作失败')
          }
        })
      },
      deleteArticle(row){
        console.log(111)
        TipOffService.deleteTipOff({tipOffId:row._id}).then(res => {
          if(res.data.status === 200){
            this.$message.success(res.data.message)
            this.getTipOffData()
          }else{
            this.$message.error('操作失败')
          }
        })
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-pagination{
    text-align: right;
  }
</style>