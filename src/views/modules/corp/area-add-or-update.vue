<template>
  <el-dialog
    :title="!dataForm.areaId ? $t('sysManagement.add') : $t('sysManagement.modify')"
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
      <el-form-item :label="$t('corp.areaName')" prop="areaName">
        <el-input v-model="dataForm.areaName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('corp.superiorAreaL')" prop="parentId">
        <el-cascader
          expand-trigger="hover"
          :options="areaList"
          :props="categoryTreeProps"
          change-on-select
          filterable
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">{{$t('coupon.cancel')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" size="mini">{{$t('coupon.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        areaId: '',
        areaName: null,
        parentId: null,
        level: null
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      dataRule: {
        areaName: [
          { required: true, message: this.$i18n.t('sysManagement.areaTips'), trigger: 'blur' }
        ]
      },
      isSubmit: false,
      areaList: [],
      categoryTreeProps: {
        value: 'areaId',
        label: 'areaName'
      },
      selectedOptions: []
    }
  },
  methods: {
    init (areaId) {
      this.dataForm.areaId = areaId || 0
      this.visible = true
      this.isSubmit = false
      this.selectedOptions = []
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.areaId) {
          this.$http({
            url: this.$http.adornUrl('/admin/area/info/' + this.dataForm.areaId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            // this.selectedOptions.push(this.dataForm.parentId)
            this.selectedOptions = this.dataForm.parentId
            this.categoryTreeProps.areaId = this.dataForm.areaId
            this.categoryTreeProps.areaName = this.dataForm.areaName
          })
        }

        this.$http({
          url: this.$http.adornUrl('/admin/area/list'),
          method: 'get',
          params: this.$http.adornParams({
            maxGrade: 3
          })
        }).then(({ data }) => {
          this.areaList = treeDataTranslate(data, 'areaId', 'parentId')
        })
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataForm.parentId) {
            this.dataForm.parentId = 0
            this.dataForm.level = 0
          } else {
            this.dataForm.level = this.selectedOptions.length
          }
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/admin/area'),
            method: this.dataForm.areaId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    },
    handleChange (val) {
      this.dataForm.parentId = val[val.length - 1]
    }
  }
}
</script>
