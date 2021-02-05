<template>
  <div>
    <el-page-header @back="goBack">
    </el-page-header>
    <GlobalEditor @publishSuccess='goBack'></GlobalEditor>
  </div>
</template>

<script>
  import GlobalEditor from '@/components/Global-Editor'
  export default {
    name: "ArticleEdit",
    components:{
      GlobalEditor
    },
    data(){
      return {

      }
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-page-header{
    padding:10px
  }
</style>