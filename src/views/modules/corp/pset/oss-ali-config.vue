<template>
  <div class="uploadfile-Oss文件上传配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.aliOssUploadConfig')}}</div>
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
      <el-form-item label="oss—accessKeyId:" style="width:640px" prop="accessKeyId">
        <el-input
          v-model="dataForm.accessKeyId"
          :placeholder="`oss ${$t('sysManagement.fileUpload')} accessKeyId`"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="oss—accessKeySecret:" style="width:640px" prop="accessKeySecret">
        <el-input
          v-model="dataForm.accessKeySecret"
          :placeholder="`oss ${$t('sysManagement.fileUpload')} accessKeySecret`"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="oss—endpoint:" style="width:640px" prop="endpoint">
        <el-input
          v-model="dataForm.endpoint"
          :placeholder="`oss ${$t('sysManagement.fileUpload')} endpoint`"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="oss—bucketName:" style="width:640px" prop="bucketName">
        <el-input
          v-model="dataForm.bucketName"
          :placeholder="`oss ${$t('sysManagement.fileUpload')} bucketName`"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.isActive')" style="width:640px" prop="isOpen">
        <el-switch v-model="dataForm.isOpen" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
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
        accessKeyId: '',
        accessKeySecret: '',
        endpoint: '',
        bucketName: '',
        isOpen: false
      },
      dataRule: {
        // accessKeyId: [
        //   { required: true, message: 'oss文件上传accessKeyId不能为空', trigger: 'blur' }
        // ],
        // accessKeySecret: [
        //   { required: true, message: 'oss文件上传accessKeySecret不能为空', trigger: 'blur' }
        // ],
        // endpoint: [
        //   { required: true, message: 'oss文件上传endpoint不能为空', trigger: 'blur' }
        // ],
        // bucketName: [
        //   { required: true, message: 'oss文件上传bucketName不能为空', trigger: 'blur' }
        // ]
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
          url: this.$http.adornUrl('/corp/pconfig/info/' + 'ALI_OSS_CONFIG'),
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
    message (msg, type) {
      this.$message({
        message: msg,
        type: type,
        duration: 1500
      })
    },
    checkConfig () {
      if (this.dataForm.accessKeyId == null || this.dataForm.accessKeyId === '') {
        this.message(`oss ${this.$i18n.t('sysManagement.fileUpload')} accessKeyId ${this.$i18n.t('sysManagement.nullTips')} `, 'error')
        return false
      }
      if (this.dataForm.accessKeySecret == null || this.dataForm.accessKeySecret === '') {
        this.message(`oss ${this.$i18n.t('sysManagement.fileUpload')} accessKeySecret ${this.$i18n.t('sysManagement.nullTips')} `, 'error')
        return false
      }
      if (this.dataForm.endpoint == null || this.dataForm.endpoint === '') {
        this.message(`oss ${this.$i18n.t('sysManagement.fileUpload')} endpoint ${this.$i18n.t('sysManagement.nullTips')} `, 'error')
        return false
      }
      if (this.dataForm.bucketName == null || this.dataForm.bucketName === '') {
        this.message(`oss ${this.$i18n.t('sysManagement.fileUpload')} bucketName ${this.$i18n.t('sysManagement.nullTips')} `, 'error')
        return false
      }
      return true
    },
    // 表单提交
    dataFormSubmit () {
      if (this.dataForm.isOpen && !this.checkConfig()) {
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/corp/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'ALI_OSS_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.aliOssUploadConfig')
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
    /**
     * dataform -> oss
     */
    // getOssParam () {
    //   this.oss.accessKeyId = this.dataForm.accessKeyId
    //   this.oss.accessKeySecret = this.dataForm.accessKeySecret
    //   this.oss.endpoint = this.dataForm.endpoint
    //   this.oss.bucketName = this.dataForm.bucketName
    // },
    // /**
    //  *  oss -> dataform
    //  */
    // getDataParam (data) {
    //   this.dataForm.id = data.id
    //   this.dataForm.paramKey = data.paramKey
    //   this.dataForm.paramValue = data.paramValue
    //   this.dataForm.accessKeyId = data.oss.accessKeyId
    //   this.dataForm.accessKeySecret = data.oss.accessKeySecret
    //   this.dataForm.endpoint = data.oss.endpoint
    //   this.dataForm.bucketName = data.oss.bucketName
    // }
  }
}
</script>
