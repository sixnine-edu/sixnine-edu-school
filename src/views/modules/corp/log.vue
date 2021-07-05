<template>
  <div class="mod-log">
    <avue-crud ref="crud"
               :page="page"
               :data="dataList"
               :option="tableOption"
               @search-change="searchChange"
               @refresh-change="refreshChange"
               @on-load="getDataList">
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from '@/crud/corp/log'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      selectionDataList: [],
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {}
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 刷新回调
    refreshChange () {
      this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/corp/log/page'),
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
      this.searchForm = params
      this.getDataList(this.page)
    }
  }
}
</script>
