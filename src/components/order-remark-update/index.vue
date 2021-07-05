<template>
  <el-dialog
    title="修改用户收货地址"
    :modal="false"
    top="200px"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="用户备注" prop="remarks">
        <el-input
          v-model="dataForm.remarks"
          disabled
          placeholder="请输入备注信息"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          maxlength="250"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="卖家备注" prop="shopRemarks">
        <el-input
          v-model="dataForm.shopRemarks"
          placeholder="请输入备注信息"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          maxlength="250"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitProds()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      dataForm: {
        orderId: '',
        remarks: '',
        shopRemarks: '',
        orderNumber: ''
      },
      dataRule: {
      },
      isTrue: false,
      errorInfo: '',
      dataListLoading: false
    }
  },
  methods: {
    // 获取数据列表
    init (order) {
      let orderInfo = Object.assign({}, order)
      this.visible = true
      this.dataListLoading = true
      this.dataForm.orderId = orderInfo.orderId
      this.dataForm.orderNumber = orderInfo.orderNumber
      this.dataForm.remarks = orderInfo.remarks
      this.dataForm.shopRemarks = orderInfo.shopRemarks
      this.dataListLoading = false
    },
    // 确定事件
    submitProds () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/order/order/changeOrderRamark`),
            method: 'put',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshUserRemarkOrder')
              }
            })
          })
        }
      })
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>
<style scoped>
.prods-select-body {
  height: auto;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
</style>
