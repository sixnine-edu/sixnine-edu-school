<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-01-10 21:58:17
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-27 11:48:02
-->
<template>
  <el-dialog title="分配详情" append-to-body :close-on-click-modal="false" :visible.sync="dialogVisible" width="80%">
    <avue-crud ref="crud" :page="page" :data="dataList" @on-load="getDataList" :table-loading="dataListLoading" :option="tableOption">
      <template slot-scope="scope" slot="info">
        <el-tooltip :content="scope.row.info" placement="bottom">
          <div class="ellipsis-3 ">{{ scope.row.info }}</div>
        </el-tooltip>
      </template>
      <template slot-scope="scope" slot="coverImg">
        <el-image style="width: 150px; height: 100px" :src="scope.row.coverImg" fit="fit"></el-image>
      </template>
    </avue-crud>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {
    tableOption
  } from "@/crud/edu/distr-detail"
  export default {
    data() {
      return {
        dataList: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        dataListLoading: false,
        tableOption: tableOption,
        dialogVisible: false,
        corpUserId: '',
      }
    },
    methods: {
      getDataList(page) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/corp/course/distrDetail/${this.corpUserId}`),
          method: "get",
          params: this.$http.adornParams({
            current: page == null ? this.page.currentPage : page.currentPage,
            size: page == null ? this.page.pageSize : page.pageSize,
            corpUserId: this.corpUserId
          })
        }).then(({
          data
        }) => {
          this.dataList = data.records
          this.page.total = data.total
          this.dataListLoading = false
        })
      },
      init(corpUserId) {
        this.dialogVisible = true
        this.corpUserId = corpUserId;
      },

      onCancel() {
        this.dialogVisible = false

      },

    }
  }
</script>
<style lang="scss"></style>
