<template>
  <div>
    <el-row :gutter="20" type="flex">
      <el-col :span="6">
        <el-card class="box-card" style='position:relative; height: 100%;'>
          <div slot='header' class="clearfix" >
            <span>当前用户总数</span>
          </div>
          <div class="num-box">
            {{userNum}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card" >
          <div slot='header' class="clearfix">
            <span>用户注册趋势</span>
          </div>
          <div ref='userDataWrapper'>
            <div
              ref='userData'
              :style="{
                width:userDataChartsSize.width + 'px',
                height:userDataChartsSize.height + 'px',
                margin:'auto'
              }"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex" style='margin-top:20px'>
      <el-col :span="6">
        <el-card class="box-card" style='position:relative;height: 100%;'>
          <div slot='header' class="clearfix" >
            <span>当前文章总数</span>
          </div>
          <div  class="num-box">
            {{blogNum}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card" >
          <div slot='header' class="clearfix">
            <span>文章发布趋势</span>
          </div>
          <div ref='userDataWrapper'>
            <div
              ref='blogData'
              :style="{
                width:userDataChartsSize.width + 'px',
                height:userDataChartsSize.height + 'px',
                margin:'auto'
              }"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style='margin-top:20px'>
      <el-col :span="24">
        <el-card class="box-card" >
          <div slot='header' class="clearfix">
            <span>用户位置分布</span>
          </div>
          <div ref='visitorDataWrapper'>
            <div
              ref='visitorData'
              :style="{
                width:visitorDataChartsSize.width + 'px',
                height:visitorDataChartsSize.height + 'px',
                margin:' 0 auto'
              }"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style='margin-top:20px'>
      <el-col :span="24">
        <el-card class="box-card" >
          <div slot='header' class="clearfix">
            <span>用户访问数据表</span>
          </div>
          <el-table :model='visitorData'>
            <el-table-column prop='ip' label='IP'></el-table-column>
            <el-table-column prop='province' label='省份'></el-table-column>
            <el-table-column prop='city' label='城市'></el-table-column>
            <el-table-column prop='visitTime' label='访问时间'></el-table-column>
            <el-table-column prop="location" label='用户坐标'>
              <template slot-scope='scope'>
                <span>{{scope.row.location[0]}}</span>-<span>{{scope.row.location[1]}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout='prev, pager, next'
            :total='total'
            @current-change="handleUserCurrentChange"
            :current-page.sync="searchParams.pageNum"
          >
        </el-pagination>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import AuthorService from '@/service/AuthorService'
  import webSiteService from '@/service/WebSiteService'
  import 'echarts/extension/bmap/bmap' //获取百度地图
  export default {
    name: "DataView",
    data(){
      return {
        userDataChartsSize:{
          width:600,
          height:300
        },
        userDataCharts:null,
        userDataOption:{
          tooltip: {
              trigger: 'axis',
              formatter: (params) => {
                return this.$echarts.format.formatTime('yyyy-MM-dd',params[0].axisValue)
              }
          },
          dataZoom:[
            {
              type:'inside',
              show:true,
              xAxisIndex:0,
            },
            {
              type:'slider',
              show:true,
              xAxisIndex:0,
              height:10,
              bottom:10,
              left:100,
              right:100
            }
          ],
          xAxis: {
              type: 'time', //type为time时,不要传xAxis.data的值,x轴坐标的数据会根据传入的时间自动展示
              boundaryGap:false, //横坐标两边不需要留白
              position:{
                bottom:'10%'
              },
              axisLabel:{
                // rotate:20,
                fontSize:12,
                formatter:(val) => {
                  return this.$echarts.format.formatTime('yyyy-MM-dd',val)
                }
              }
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              type: 'line',
              data: [],
              smooth:true
          }]
        },
        userNum:0,
        blogDataOption:{
          tooltip: {
              trigger: 'axis',
              formatter: (params) => {
                // console.log(params)
                return this.$echarts.format.formatTime('yyyy-MM-dd',params[0].axisValue)
              }
          },
          dataZoom:[
            {
              type:'inside',
              show:true,
              xAxisIndex:0,
            },
            {
              type:'slider',
              show:true,
              xAxisIndex:0,
              height:10,
              bottom:10,
              left:100,
              right:100
            }
          ],
          xAxis: {
              type: 'time', //type为time时,不要传xAxis.data的值,x轴坐标的数据会根据传入的时间自动展示
              boundaryGap:false, //横坐标两边不需要留白
              position:{
                bottom:'10%'
              },
              axisLabel:{
                // rotate:20,
                fontSize:12,
                formatter:(val) => {
                  return this.$echarts.format.formatTime('yyyy-MM-dd',val)
                }
              }
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              type: 'bar',
              data: [],
              smooth:true
          }]
        },
        blogNum:0,
        blogDataCharts:null,
        visitorDataChartsSize:{
          width:600,
          height:300
        },
        visitorDataCharts:null,
        //百度地图参数配置
        visitorDataOption:{
         bmap:{
           center:[114,28],
           zoom:5,
           roam:true,
         },
          series: [{
              type: 'effectScatter',
              data: [],
              coordinateSystem:'bmap'
          }]
        },
        visitorData:[],
        searchParams:{
          pageNum:1,
          limit:10
        },
        total:0
      }
    },
    mounted(){
      this.userDataChartsSize.width = this.$refs.userDataWrapper.clientWidth
      this.userDataChartsSize.height = this.$refs.userDataWrapper.clientWidth * 0.3
      this.visitorDataChartsSize.width = this.$refs.visitorDataWrapper.clientWidth
      this.visitorDataChartsSize.height = this.$refs.visitorDataWrapper.clientWidth * 0.3
      this.getUserRegisterInfo()
      this.getBlogInfo()
      this.getVisitorMap()
    },
    methods:{
      getUserRegisterInfo(){
        AuthorService.getUserRegisterInfo().then(res => {
          if(res.data.status === 200){
            let timeData = []
            this.userNum = res.data.data.length
            for(let i = 0, n = res.data.data.length; i < n; i++){
              timeData.push([new Date(res.data.data[i].createTime),1])
            }
            this.userDataOption.series[0].data = timeData
            this.userDataCharts = this.$echarts.init(this.$refs.userData)
            this.userDataCharts.setOption(this.userDataOption)
          }else{
            this.$message.error(res.data.message)
          }
        })
      },
      getBlogInfo(){
        AuthorService.getBlogInfo().then(res => {
          if(res.data.status === 200){
            let timeData = []
            this.blogNum = res.data.data.length
            for(let i = 0, n = res.data.data.length; i < n; i++){
              timeData.push([new Date(res.data.data[i].lastModified),1])
            }
            this.blogDataOption.series[0].data = timeData
            this.blogDataCharts = this.$echarts.init(this.$refs.blogData)
            this.blogDataCharts.setOption(this.blogDataOption)
          }else{
            this.$message.error(res.data.message)
          }
        })
      },
      getVisitorMap(){
        webSiteService.getWebSiteData(this.searchParams).then(res => {
          if(res.data.status === 200){
            if(this.visitorDataCharts != null || this.visitorDataCharts != "" || this.visitorDataCharts != undefined){
              this.visitorDataCharts.dispose()
            }
            this.visitorDataCharts = this.$echarts.init(this.$refs.visitorData)
            let userLocationData = []
            this.visitorData = res.data.data.visitorData
            this.total = this.visitorData.length
            for(let i = 0, n = this.visitorData.length; i < n; i++){
              userLocationData.push(this.visitorData[i].location)
            }
            this.visitorDataOption.series[0].data = userLocationData
            this.visitorDataCharts.setOption(this.visitorDataOption)
            let bmap = this.visitorDataCharts.getModel().getComponent('bmap').getBMap() //获取百度地图实例
            bmap.setMapStyleV2({
              styleId:"653892c1d754df79a06f74b81e5c59d0"
            })
          }
        })
      },
      handleUserCurrentChange(val){
        this.searchParams.pageNum = val
        this.getVisitorMap()
      }
    }
  }
</script>

<style scoped>
  .num-box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size:60px;
    text-align: center;
    font-weight: bolder;
  }
  /deep/ .el-pagination{
    text-align: right;
  }
</style>