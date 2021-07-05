<template>
  <div class="page-content">
    <div class="app-content">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="tab-box">
          支付结果
        </div>
        <img src="../../assets/img/pay-success.png" class="pay-success" />
        <el-button type="primary" @click="toDetail">查看详情</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default{
    methods: {
      toDetail() {
        this.$router.replace({
          name: "collegeMyTrain"
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    background: #f5f5f5;
  }

  .box-card {
    width: 500px;
    margin: 20px auto;
    text-align: center;
    .pay-success {
      width: 220px;
      display: block;
      margin: 20px auto;

    }
    .el-button--primary{
      padding: 14px 80px;
    }
  }
</style>
