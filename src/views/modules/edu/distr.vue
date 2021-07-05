<template>
  <div class="mod-shop-notice">
    <avue-crud ref="crud" :page="page" :data="dataList" :table-loading="dataListLoading" :option="tableOption"
      @search-change="searchChange" @on-load="getDataList" @refresh-change="refreshChange">
      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.corpUserId)">查看详情</el-button>
      </template>

    </avue-crud>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
  import {
    tableOption
  } from "@/crud/edu/distr"
  import AddOrUpdate from "./distr-add-or-update"
  export default {
    data() {
      return {
        dataList: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        searchForm: {},
        dataListLoading: false,
        tableOption: tableOption,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    created() {},
    mounted() {},
    methods: {
      getDataList(page) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl("/corp/course/distr"),
          method: "get",
          params: this.$http.adornParams(
            Object.assign({
                current: page == null ? this.page.currentPage : page.currentPage,
                size: page == null ? this.page.pageSize : page.pageSize
              },
              this.searchForm
            )
          )
        }).then(({
          data
        }) => {
          this.dataList = data.records
          this.page.total = data.total
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      addOrUpdateHandle(corpUserId) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(corpUserId)
        })
      },
      // 刷新回调用
      refreshChange() {
        this.page = this.$refs.crud.$refs.tablePage.defaultPage
        this.getDataList(this.page)
      },
      searchChange(params, done) {
        this.searchForm = params
        this.page.currentPage = 1
        this.page.pageSize = 10
        this.getDataList(this.page)
        done()
      }
    }
  }
</script>

<style lang="scss" scoped></style>
