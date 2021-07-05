<template>
  <div class="quickbird-快递100物流配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.quickHdConfig')}}</div>
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
      <el-form-item :label="`${this.$i18n.t('sysManagement.quick100')} customer:`" style="width:640px" prop="customer">
        <el-input v-model="dataForm.customer" :placeholder="`${this.$i18n.t('sysManagement.quick100')} customer`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${this.$i18n.t('sysManagement.quick100')} key:`" style="width:640px" prop="key">
        <el-input v-model="dataForm.key" :placeholder="`${this.$i18n.t('sysManagement.quick100')}  key`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${this.$i18n.t('sysManagement.quick100')} reqUrl:`" style="width:640px" prop="reqUrl">
        <el-input v-model="dataForm.reqUrl" :placeholder="`${this.$i18n.t('sysManagement.quick100')} reqUrl`" controls-position="right"></el-input>
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
          customer: null,
          key: null,
          reqUrl: null,
          isOpen: false
        },
        quick100: {
          // customer: null,
          // key: null,
          // reqUrl: null
        },
        dataRule: {
          customer: [
            { required: true, message: `快递100  id ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
          ],
          key: [
            { required: true, message: `快递100  key ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
          ],
          reqUrl: [
            { required: true, message: `快递100  reqUrl ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
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
            url: this.$http.adornUrl('/corp/pconfig/info/' + 'QUICK100_CONFIG'),
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
                'paramKey': 'QUICK100_CONFIG',
                'paramValue': JSON.stringify(this.dataForm),
                'remark': '快递100物流配置'
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
        this.quick100.customer = this.dataForm.customer
        this.quick100.key = this.dataForm.key
        this.quick100.reqUrl = this.dataForm.reqUrl
        this.quick100.isOpen = this.dataForm.isOpen
      },
      /**
       *  quick100 -> dataform
       */

      getDataParam (data) {
        let obj = JSON.parse(data.paramValue)
        this.dataForm.id = data.id
        this.dataForm.paramKey = data.paramKey
        this.dataForm.paramValue = data.paramValue
        this.dataForm.customer = data.quick100.customer == null ? obj.customer : data.quick100.customer
        this.dataForm.key = data.quick100.key
        this.dataForm.reqUrl = data.quick100.reqUrl
      }
    }
  }
</script>
