<template>
  <el-dialog
    :title="!dataForm.id ? this.$i18n.t('sysManagement.add') : this.$i18n.t('sysManagement.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <el-form-item :label="$t('corp.beanName')" prop="beanName">
        <el-input v-model="dataForm.beanName" :placeholder="$t('corp.beanNameEg')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.methodName')" prop="methodName">
        <el-input v-model="dataForm.methodName" :placeholder="$t('corp.methodName')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.params')" prop="params">
        <el-input v-model="dataForm.params" :placeholder="$t('corp.params')"maxlength="98" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.cronExpression')" prop="cronExpression">
        <el-input v-model="dataForm.cronExpression" :placeholder="$t('corp.cronExpressionEg')"maxlength="1900" ></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.remark')" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t('corp.remark')" maxlength="200" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('coupon.cancel')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('coupon.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        beanName: '',
        methodName: '',
        params: '',
        cronExpression: '',
        remark: '',
        status: 0
      },
      isSubmit: false,
      dataRule: {
        beanName: [
          { required: true, message: this.$i18n.t('corp.beanNameNoNull'), trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: this.$i18n.t('corp.methodNameNoNull'), trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: this.$i18n.t('corp.cronExpressionNoNull'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.isSubmit = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/corp/schedule/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm.beanName = data.beanName
            this.dataForm.methodName = data.methodName
            this.dataForm.params = data.params
            this.dataForm.cronExpression = data.cronExpression
            this.dataForm.remark = data.remark
            this.dataForm.status = data.status
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/corp/schedule`),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData({
              'jobId': this.dataForm.id || undefined,
              'beanName': this.dataForm.beanName,
              'methodName': this.dataForm.methodName,
              'params': this.dataForm.params,
              'cronExpression': this.dataForm.cronExpression,
              'remark': this.dataForm.remark,
              'status': !this.dataForm.id ? undefined : this.dataForm.status
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
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    }
  }
}
</script>
