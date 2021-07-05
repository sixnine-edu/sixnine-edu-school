<template>
  <div class="shortmsg-短信服务平台配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.alidayuSMSServicePlatform')}}</div>
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
      <!-- <el-form-item label="短信服务平台名称" style="width:640px" prop="shortmsgName">
        <el-input
          disabled="true"
          v-model="dataForm.shortmsgName"
          placeholder="短信服务平台名称"
          controls-position="right"
        ></el-input>
      </el-form-item>-->
      <el-form-item :label="`${$t('sysManagement.SMSService')} accessKeyId`" style="width:640px" prop="accessKeyId">
        <el-input
          v-model="dataForm.accessKeyId"
          :placeholder="`${$t('sysManagement.SMSService')} accessKeyId`"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.shortMessage')} accessKeySecret`" style="width:640px" prop="accessKeySecret">
        <el-input
          v-model="dataForm.accessKeySecret"
          :placeholder="`${$t('sysManagement.shortMessage')} accessKeySecret`"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.shortMessageSign')} signName`" style="width:640px" prop="signName">
        <el-input v-model="dataForm.signName" :placeholder="`${$t('sysManagement.shortMessageSign')} signName`" controls-position="right"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      <el-button @click="dataFormSubmit()">{{$t('sysManagement.save')}}</el-button>
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        // id: null,
        // paramKey: 'ALIDAYU_CONFIG',
        // shortmsgName: '阿里大鱼短信服务平台',
        accessKeyId: null,
        accessKeySecret: null,
        signName: null
        // paramValue: null
      },
      searchForm: {},
      dataRule: {
        // shortmsgName: [
        //   { required: true, message: '短信服务平台名称不能为空', trigger: 'blur' }
        // ],
        accessKeyId: [
          { required: true, message: `${this.$i18n.t('sysManagement.SMSService')} accessKeyId ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ],
        accessKeySecret: [
          { required: true, message: `${this.$i18n.t('sysManagement.shortMessage')} accessKeySecret ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ],
        signName: [
          { required: true, message: `${this.$i18n.t('sysManagement.shortMessageSign')} signName ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
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
          url: this.$http.adornUrl('/corp/pconfig/info/' + 'ALIDAYU_CONFIG'),
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
              'paramKey': 'ALIDAYU_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.alidayuSMSServicePlatform')
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
