<template>
  <el-dialog
    :title="this.$i18n.t('corp.updatePwd')"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item :label="this.$i18n.t('corp.userName')">
        <span>{{ empName }}</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('corp.oldPassword')" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('corp.newPassword')" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item  :label="this.$i18n.t('corp.confirmPassword')" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t("homes.cancel")}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t("homes.confirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { clearLoginInfo } from '@/utils'
  export default {
    data () {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error(this.$i18n.t('homes.istrue')))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          password: '',
          newPassword: '',
          confirmPassword: ''
        },
        dataRule: {
          password: [
            { required: true, message: this.$i18n.t('corp.oldPwdNotNull'), trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: this.$i18n.t('corp.newPwdNotNull'), trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: this.$i18n.t('corp.confirmPassNoNull'), trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      empName: {
        get () { return this.$store.state.user.empName }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/corp/user/password'),
              method: 'post',
              data: this.$http.adornData({
                'password': this.dataForm.password,
                'newPassword': this.dataForm.newPassword
              })
            }).then(({data}) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$nextTick(() => {
                    this.mainTabs = []
                    clearLoginInfo()
                    this.$router.replace({ name: 'login' })
                  })
                }
              })
            })
          }
        })
      }
    }
  }
</script>

