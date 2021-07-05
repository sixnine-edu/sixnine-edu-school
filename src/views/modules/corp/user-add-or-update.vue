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
      label-width="80px"
    >
      <el-form-item :label="$t('corp.userName')" prop="userName">
        <el-input v-model="dataForm.userName" :placeholder="$t('homes.userName')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.password')" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t('corp.password')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.confirmPassword')" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" :placeholder="$t('corp.confirmPassword')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.email')" prop="email">
        <el-input v-model="dataForm.email" :placeholder="$t('corp.email')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('publics.mobilePhone')" prop="mobile">
        <el-input v-model="dataForm.mobile" :placeholder="$t('publics.mobilePhone')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.roles')" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleId"
          >{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t('product.status')" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t('publics.disable')}}</el-radio>
          <el-radio :label="1">{{$t('publics.normal')}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('coupon.cancel')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('coupon.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from '@/utils/validate'
export default {
  data () {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error(this.$i18n.t('corp.passwordNoNull')))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error(this.$i18n.t('corp.confirmPassNoNull')))
      } else if (this.dataForm.password !== value) {
        callback(new Error(this.$i18n.t('corp.passworldContrast')))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error(this.$i18n.t('corp.emailaError')))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error(this.$i18n.t('corp.mobilePhoneError')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      isSubmit: false,
      roleList: [],
      dataForm: {
        id: 0,
        userName: '',
        password: '',
        comfirmPassword: '',
        email: '',
        mobile: '',
        roleIdList: [],
        status: 1
      },
      dataRule: {
        userName: [
          { required: true, message: this.$i18n.t('corp.userNameNoNull'), trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$i18n.t('corp.emailaNoNull'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: this.$i18n.t('corp.mobilePhoneNoNull'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.isSubmit = false
      this.$http({
        url: this.$http.adornUrl('/corp/role/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.roleList = data
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
        })
      }).then(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/corp/user/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm.userName = data.username
            this.dataForm.email = data.email
            this.dataForm.mobile = data.mobile
            this.dataForm.roleIdList = data.roleIdList
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
            url: this.$http.adornUrl(`/corp/user`),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData({
              'userId': this.dataForm.id || undefined,
              'username': this.dataForm.userName,
              'password': this.dataForm.password,
              'email': this.dataForm.email,
              'mobile': this.dataForm.mobile,
              'status': this.dataForm.status,
              'roleIdList': this.dataForm.roleIdList
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
