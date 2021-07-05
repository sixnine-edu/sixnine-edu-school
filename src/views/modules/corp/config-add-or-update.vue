<template>
  <el-dialog
    :title="!dataForm.id ? this.$i18n.t('sysManagement.add') : this.$i18n.t('sysManagement.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item :label="$t('corp.parameteName')" prop="paramKey">
        <el-input v-model="dataForm.paramKey" :placeholder="$t('corp.parameteName')"maxlength="48" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.parameterValue')" prop="paramValue">
        <el-input v-model="dataForm.paramValue" :placeholder="$t('corp.parameterValue')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('publics.remark')" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t('publics.remark')"maxlength="480" show-word-limit></el-input>
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
          paramKey: '',
          paramValue: '',
          remark: ''
        },
        dataRule: {
          paramKey: [
            { required: true, message: this.$i18n.t('corp.parameteNameNoNull'), trigger: 'blur' }
          ],
          paramValue: [
            { required: true, message: this.$i18n.t('corp.parameterValuenoNull'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/corp/config/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.dataForm.paramKey = data.paramKey
              this.dataForm.paramValue = data.paramValue
              this.dataForm.remark = data.remark
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/corp/config`),
              method: this.dataForm.id ? 'put' : 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'paramKey': this.dataForm.paramKey,
                'paramValue': this.dataForm.paramValue,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
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
