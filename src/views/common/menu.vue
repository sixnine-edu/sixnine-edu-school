<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('corp:menu:save')" type="primary" @click="addOrUpdateHandle()">{{$t('sysManagement.add')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border style="width: 100%;" row-key="menuId">
      <el-table-column prop="name" header-align="center" treeKey="menuId" width="240" :label="$t('publics.name')">
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t('corp.icon')">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" :label="$t('sysManagement.type')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">{{$t('corp.catalog')}}</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">{{$t('corp.menu')}}</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">{{$t('corp.button')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" :label="$t('hotSearch.seq')">
      </el-table-column>
      <el-table-column prop="url" header-align="center" align="center" width="150" :show-overflow-tooltip="true" :label="$t('corp.menuUrl')">
      </el-table-column>
      <el-table-column prop="perms" header-align="center" align="center" width="150" :show-overflow-tooltip="true"
        :label="$t('corp.authorization')">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" :label="$t('corp.operation')">
        <template slot-scope="scope">
          <el-button v-if="isAuth('corp:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">{{$t('sysManagement.modify')}}</el-button>
          <el-button v-if="isAuth('corp:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row.menuId)">{{$t('coupon.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './menu-add-or-update'
  import {
    treeDataTranslate
  } from '@/utils'
  export default {
    data() {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    created() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/corp/menu/table'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.dataList = treeDataTranslate(data, 'menuId')
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle(id) {
        this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('text.tips'), {
          confirmButtonText: this.$i18n.t('coupon.confirm'),
          cancelButtonText: this.$i18n.t('coupon.cancel'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/corp/menu/${id}`),
            method: 'delete',
            data: this.$http.adornData()
          }).then(({
            data
          }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          })
        })
      }
    }
  }
</script>
