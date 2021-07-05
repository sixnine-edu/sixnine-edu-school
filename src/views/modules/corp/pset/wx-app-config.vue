<template>
  <div class="public-微信app配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.wechatOpenPlatformApplicationConfig')}}</div>
    <el-form
      ref="dataForm"
      label-width="240px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item :label="`${$t('sysManagement.wechatOpenPlatformApplication')} appId:`" style="width:640px" prop="appId">
        <el-input v-model="dataForm.appId" :placeholder="`${$t('sysManagement.wechatOpenPlatformApplication')} appId`" controls-position="right"></el-input>
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
        appId: null
      },
      dataRule: {
        appId: [
          { required: true, message: `${this.$i18n.t('sysManagement.wechatOpenPlatformApplication')} appId ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
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
          url: this.$http.adornUrl('/corp/pconfig/info/' + 'MX_APP_CONFIG'),
          method: 'get',
          params: this.$http.adornParams({
            id: this.dataForm.id,
            key: this.dataForm.paramKey
          })
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
      let obj = {}
      obj.appId = this.dataForm.appId
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/corp/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'MX_APP_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.wechatOpenPlatformApplicationConfig')
            })
          }).then(({ data }) => {
            if (data) {
              this.init()
            }
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
