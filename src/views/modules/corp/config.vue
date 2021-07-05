<template>
  <div class="mod-config">
    <avue-crud ref="crud"
               :page="page"
               :data="dataList"
               :option="tableOption"
               @refresh-change="refreshChange"
               @search-change="searchChange"
               @selection-change="selectionChange"
               @on-load="getDataList">
      <template slot="menuLeft">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="small"
                   @click.stop="addOrUpdateHandle()">{{$t('sysManagement.add')}}</el-button>

        <el-button type="danger"
                   @click="deleteHandle()"
                   size="small"
                   :disabled="dataListSelections.length <= 0">{{$t('publics.batchDelete')}}</el-button>
      </template>
      <template slot-scope="scope"
                slot="menu">
        <el-button type="text"
                
                   size="small"
                   @click.stop="addOrUpdateHandle(scope.row.id)">{{$t('coupon.edit')}}</el-button>

        <el-button type="text"
              
                   size="small"
                   @click.stop="deleteHandle(scope.row.id)">{{$t('coupon.delete')}}</el-button>
      </template>
    </avue-crud>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import { tableOption } from '@/crud/corp/config'
import AddOrUpdate from './config-add-or-update'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {}
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/corp/config/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 条件查询
    searchChange (params) {
      this.page.currentPage = 1
      this.searchForm = params
      this.getDataList(this.page)
    },
    // 刷新回调用
    refreshChange () {
      this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${id ? this.$i18n.t('coupon.delete') : this.$i18n.t('corp.batchDelete')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/corp/config'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
