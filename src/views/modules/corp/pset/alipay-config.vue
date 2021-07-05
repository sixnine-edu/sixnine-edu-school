<template>
  <div class="alipay-config gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.alipayPaymentConfiguration')}}</div>
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
      <el-form-item :label="$t('sysManagement.alipayAppId')" style="width:640px" prop="appId">
        <el-input v-model="dataForm.appId" :placeholder="$t('sysManagement.alipayAppId')" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.appCertPublicKey')" style="width:640px" prop="appCertPath">
        <el-input v-model="dataForm.appCertPath" :placeholder="$t('sysManagement.appCertPublicKey')" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.alipayCertPublicKey')" style="width:640px" prop="alipayCertPath">
        <el-input v-model="dataForm.alipayCertPath" :placeholder="$t('sysManagement.alipayCertPublicKey')" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.alipayRootCertPath')" style="width:640px" prop="alipayRootCertPath">
        <el-input
          type="text"
          v-model="dataForm.alipayRootCertPath"
          :placeholder="$t('sysManagement.alipayRootCertPath')"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.appPrivateKey')" style="width:640px" prop="appPrivateKey">
        <el-input
          v-model="dataForm.appPrivateKey"
          type="textarea"
          rows="28"
          :placeholder="$t('sysManagement.appPrivateKey')"
          controls-position="right"
        ></el-input>
      </el-form-item>

      <el-button @click="dataFormSubmit()">{{$t('sysManagement.save')}}</el-button>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        appId: null,
        appCertPath: null,
        alipayCertPath: null,
        alipayRootCertPath: null,
        appPrivateKey: null
      },
      // alipay: {
      //   appId: null,
      //   appCertPath: null,
      //   alipayCertPath: null,
      //   alipayRootCertPath: null,
      //   appPrivateKey: null
      // },
      dataRule: {
        appId: [
          { required: true, message: this.$i18n.t('sysManagement.appNullTips'), trigger: 'blur' }
        ],
        appCertPath: [
          { required: true, message: this.$i18n.t('sysManagement.appCertPublicKeyNullTips'), trigger: 'blur' }
        ],
        alipayCertPath: [
          { required: true, message: this.$i18n.t('sysManagement.alipayCertPublicKeyNullTips'), trigger: 'blur' }
        ],
        alipayRootCertPath: [
          { required: true, message: this.$i18n.t('sysManagement.alipayRootCertPathNullTips'), trigger: 'blur' }
        ],
        appPrivateKey: [
          { required: true, message: this.$i18n.t('sysManagement.appPrivateKeyNullTips'), trigger: 'blur' }
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
          url: this.$http.adornUrl('/corp/pconfig/info/' + 'ALIPAY_CONFIG'),
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
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/corp/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'ALIPAY_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.alipayPaymentConfiguration')
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
    /**
     * dataform -> alipay
     */
    // getAlipayParam () {
    //   this.alipay.appId = this.dataForm.appId
    //   this.alipay.appCertPath = this.dataForm.appCertPath
    //   this.alipay.alipayCertPath = this.dataForm.alipayCertPath
    //   this.alipay.alipayRootCertPath = this.dataForm.alipayRootCertPath
    //   this.alipay.appPrivateKey = this.dataForm.appPrivateKey
    // },
    /**
     *  alipay -> dataform
     */
    // getDataParam (data) {
    //   this.dataForm.id = data.id
    //   this.dataForm.paramKey = data.paramKey
    //   this.dataForm.paramValue = data.paramValue
    //   this.dataForm.appId = this.alipay.appId
    //   this.dataForm.appCertPath = this.alipay.appCertPath
    //   this.dataForm.alipayCertPath = this.alipay.alipayCertPath
    //   this.dataForm.alipayRootCertPath = this.alipay.alipayRootCertPath
    //   this.dataForm.appPrivateKey = this.alipay.appPrivateKey
    // }
  }
}
</script>
