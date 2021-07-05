<template>
  <el-dialog
    :title="!dataForm.id ? $t('sysManagement.add') : $t('sysManagement.modify')"
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
      <el-form-item :label="$t('corp.roleName')" prop="roleName">
        <el-input v-model.trim="dataForm.roleName" :placeholder="$t('corp.roleName')"maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('publics.remark')" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t('publics.remark')" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item size="mini" :label="$t('corp.authorize')">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          show-checkbox
        ></el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('coupon.cancel')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('coupon.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataForm: {
        id: 0,
        roleName: '',
        remark: ''
      },
      isSubmit: false,
      dataRule: {
        roleName: [
          { required: true, message: this.$i18n.t('corp.roleNameNoNull'), trigger: 'blur' }
        ]
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.isSubmit = false
      this.$http({
        url: this.$http.adornUrl('/corp/menu/table'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.menuList = treeDataTranslate(data, 'menuId', 'parentId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.menuListTree.setCheckedKeys([])
        })
      }).then(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/corp/role/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm.roleName = data.roleName
            this.dataForm.remark = data.remark
            var idx = data.menuIdList.indexOf(this.tempKey)
            if (idx !== -1) {
              data.menuIdList.splice(idx, data.menuIdList.length - idx)
            }
            this.$refs.menuListTree.setCheckedKeys(data.menuIdList)
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
            url: this.$http.adornUrl(`/corp/role`),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData({
              'roleId': this.dataForm.id || undefined,
              'roleName': this.dataForm.roleName,
              'remark': this.dataForm.remark,
              'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys())
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
