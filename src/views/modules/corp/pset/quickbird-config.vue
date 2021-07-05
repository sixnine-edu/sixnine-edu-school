<template>
  <div class="quickbird-快递鸟物流配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.expressBirdConfig')}}</div>
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
      <el-form-item :label="`${$t('sysManagement.expressBirdUser')} id:`" style="width:640px" prop="eBusinessID">
        <el-input v-model="dataForm.eBusinessID" :placeholder="`${$t('sysManagement.expressBirdUser')} id`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.expressBird')} appKey:`" style="width:640px" prop="appKey">
        <el-input v-model="dataForm.appKey" :placeholder="`${$t('sysManagement.expressBird')} appKey`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.expressBird')} reqUrl:`" style="width:640px" prop="reqUrl">
        <el-input v-model="dataForm.reqUrl" :placeholder="`${$t('sysManagement.expressBird')} reqUrl`" controls-position="right"></el-input>
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
        // paramKey: 'QUICKBIRD_CONFIG',
        eBusinessID: null,
        appKey: null,
        reqUrl: null,
        isOpen: true
        // paramValue: null
      },
      quickBird: {
        // eBusinessID: null,
        // appKey: null,
        // reqUrl: null
      },
      dataRule: {
        eBusinessID: [
          { required: true, message: `${this.$i18n.t('sysManagement.expressBirdUser')} id ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ],
        appKey: [
          { required: true, message: `${this.$i18n.t('sysManagement.qiniu')} appKey ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ],
        reqUrl: [
          { required: true, message: `${this.$i18n.t('sysManagement.qiniu')} reqUrl ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
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
          url: this.$http.adornUrl('/corp/pconfig/info/' + 'QUICKBIRD_CONFIG'),
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
          this.getQuickBirdParam()
          this.$http({
            url: this.$http.adornUrl('/corp/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'QUICKBIRD_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.expressBirdConfig')
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
    },
    /**
     * dataform -> quickBird
     */
    getQuickBirdParam () {
      this.quickBird.eBusinessID = this.dataForm.eBusinessID
      this.quickBird.appKey = this.dataForm.appKey
      this.quickBird.reqUrl = this.dataForm.reqUrl
    },
    /**
     *  quickBird -> dataform
     */

    getDataParam (data) {
      let obj = JSON.parse(data.paramValue)
      this.dataForm.id = data.id
      this.dataForm.paramKey = data.paramKey
      this.dataForm.paramValue = data.paramValue
      this.dataForm.eBusinessID = data.quickBird.eBusinessID == null ? obj.eBusinessID : data.quickBird.eBusinessID
      this.dataForm.appKey = data.quickBird.appKey
      this.dataForm.reqUrl = data.quickBird.reqUrl
    }
  }
}
</script>
