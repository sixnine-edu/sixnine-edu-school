<template>
  <div class="pay-wx-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.wechatPaymentConfiguration')}}</div>
    <el-form
      ref="dataForm"
      label-width="180px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item :label="`${$t('sysManagement.wechatPay')} mchId:`" style="width:640px" prop="mchId">
        <el-input v-model="dataForm.mchId" :placeholder="`${$t('sysManagement.wechatPay')} mchId`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.wechatPay')} mchKey:`" style="width:640px" prop="mchKey">
        <el-input v-model="dataForm.mchKey" :placeholder="`${$t('sysManagement.wechatPay')} mchKey`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.paymentCertificatePath')}:`" style="width:640px" prop="keyPath">
        <el-input v-model="dataForm.keyPath" :placeholder="`${$t('sysManagement.paymentCertificatePath')}`" controls-position="right"></el-input>
      </el-form-item>
      <el-button @click="dataFormSubmit()">{{$t('sysManagement.save')}}</el-button>
    </el-form>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>-->
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        // id: null,
        // paramKey: 'WXPAY_CONFIG',
        mchId: null,
        mchKey: null,
        keyPath: null,
        signType: null
        // paramValue: null
      },
      value: [],
      dataRule: {
        mchId: [
          { required: true, message: `${this.$i18n.t('sysManagement.wechatPay')} mchId ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ],
        mchKey: [
          { required: true, message: `${this.$i18n.t('sysManagement.wechatPay')} mchKey ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ],
        keyPath: [
          { required: true, message: `${this.$i18n.t('sysManagement.paymentCertificatePath')} ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // this.$refs['dataForm'].resetFields()
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/corp/pconfig/info/' + 'WXPAY_CONFIG'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data) {
            this.dataForm = data
          }
        })
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        // this.dataForm.signType = JSON.stringify(this.value)
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/corp/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'WXPAY_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.paymentCertificatePath')
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    }
  }
}
</script>

