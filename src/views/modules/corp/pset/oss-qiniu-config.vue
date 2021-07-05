<template>
  <div class="uploadfile-七牛云文件上传配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.qiniuFileUploadConfig')}}</div>
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
      <el-form-item :label="`${$t('sysManagement.qiniu')} accessKey:`" style="width:640px" prop="accessKey">
        <el-input v-model="dataForm.accessKey" :placeholder="`${$t('sysManagement.qiniu')}accessKey`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.qiniu')} secretKey:`" style="width:640px" prop="secretKey">
        <el-input v-model="dataForm.secretKey" :placeholder="`${$t('sysManagement.qiniu')}secretKey`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.qiniu')} bucket:`" style="width:640px" prop="bucket">
        <el-input v-model="dataForm.bucket" :placeholder="`${$t('sysManagement.qiniu')}bucket`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.qiniu')} zone:`" style="width:640px" prop="zone">
        <!-- <el-input v-model="dataForm.zone" placeholder="七牛云zone的选择" controls-position="right"></el-input> -->
        <el-select
          v-model="dataForm.zone"
          filterable
          allow-create
          default-first-option
          :placeholder="`${$t('sysManagement.chooseQiniu')}zone`"
        >
          <el-option
            v-for="item in optionsZone"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
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
        // id: null,
        // paramKey: 'QINIU_CONFIG',
        accessKey: null,
        secretKey: null,
        bucket: null,
        resourcesUrl: null,
        zone: null
        // paramValue: null
      },
      // qiniu: {
      //   accessKey: null,
      //   secretKey: null,
      //   bucket: null,
      //   resourcesUrl: null,
      //   zone: null
      // },
      optionsZone: [{
        value: 'HUA_DONG',
        label: this.$i18n.t('sysManagement.EastChina')
      }, {
        value: 'HUA_BEI',
        label: this.$i18n.t('sysManagement.NorthChina')
      }, {
        value: 'HUA_NAN',
        label: this.$i18n.t('sysManagement.SouthChina')
      }, {
        value: 'BEI_MEI',
        label: this.$i18n.t('sysManagement.NorthAmerica')
      }, {
        value: 'XIN_JIA_PO',
        label: this.$i18n.t('sysManagement.Singapore')
      }],
      value: [],
      dataRule: {
        // accessKey: [
        //   { required: true, message: '七牛云accessKey不能为空', trigger: 'blur' }
        // ],
        // secretKey: [
        //   { required: true, message: '七牛云secretKey不能为空', trigger: 'blur' }
        // ],
        // bucket: [
        //   { required: true, message: '七牛云bucket不能为空', trigger: 'blur' }
        // ],
        // resourcesUrl: [
        //   { required: true, message: '七牛云resourcesUrl不能为空', trigger: 'blur' }
        // ],
        // zone: [
        //   { required: true, message: '七牛云zone的选择不能为空', trigger: 'blur' }
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
          url: this.$http.adornUrl('/corp/pconfig/info/' + 'QINIU_CONFIG'),
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
    message (msg, type) {
      this.$message({
        message: msg,
        type: type,
        duration: 1500
      })
    },
    checkConfig () {
      if (this.dataForm.accessKey == null || this.dataForm.accessKey === '') {
        this.message(`${this.$i18n.t('sysManagement.qiniu')} accessKey ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      if (this.dataForm.secretKey == null || this.dataForm.secretKey === '') {
        this.message(`${this.$i18n.t('sysManagement.qiniu')} secretKey ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      if (this.dataForm.bucket == null || this.dataForm.bucket === '') {
        this.message(`${this.$i18n.t('sysManagement.qiniu')} bucket ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      // if (this.dataForm.resourcesUrl == null || this.dataForm.resourcesUrl === '') {
      //   this.message('${this.$i18n.t('sysManagement.qiniu')}resourcesUrl${this.$i18n.t('sysManagement.nullTips')}', 'error')
      //   return false
      // }
      if (this.dataForm.zone == null || this.dataForm.resourcesUrl === '') {
        this.message(`${this.$i18n.t('sysManagement.qiniu')} zone ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
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
              'paramKey': 'QINIU_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.qiniuFileUploadConfig')
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
     * dataform -> qiniu
     */
    // getQiniuParam () {
    //   this.qiniu.accessKey = this.dataForm.accessKey
    //   this.qiniu.secretKey = this.dataForm.secretKey
    //   this.qiniu.bucket = this.dataForm.bucket
    //   this.qiniu.resourcesUrl = this.dataForm.resourcesUrl
    //   this.qiniu.zone = this.dataForm.zone
    // },
    // /**
    //  *  qiniu -> dataform
    //  */
    // getDataParam (data) {
    //   this.dataForm.id = data.id
    //   this.dataForm.paramKey = data.paramKey
    //   this.dataForm.paramValue = data.paramValue
    //   this.dataForm.accessKey = this.qiniu.accessKey
    //   this.dataForm.secretKey = this.qiniu.secretKey
    //   this.dataForm.bucket = this.qiniu.bucket
    //   this.dataForm.resourcesUrl = this.qiniu.resourcesUrl
    //   this.dataForm.zone = this.qiniu.zone
    // }
  }
}
</script>
