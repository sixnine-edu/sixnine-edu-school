<template>
  <div class="mod-shop-notice">
    <avue-crud ref="crud" :page="page" :data="dataList" :table-loading="dataListLoading" :option="tableOption"
      @search-change="searchChange" @on-load="getDataList" @refresh-change="refreshChange">
      <template slot-scope="scope" slot="state">
        <el-switch @change="state => changeState(scope.row.corpUserId, state)" v-model="scope.row.state" active-text="启用"
          inactive-text="禁用" :active-value="1" :inactive-value="0">
        </el-switch>
      </template>
      <template slot="menuLeft">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
      </template>
      <template slot-scope="scope" slot="headImg">
        <el-image style="width: 100px; height: 100px" :src="scope.row.headImg" fit="contain"></el-image>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.corpUserId)">修改</el-button>
        <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.corpUserId)">删除</el-button>
        <el-button type="text" size="small" @click.stop="renewHandle(scope.row.corpUserId)">续费</el-button>
        <el-popconfirm title="确定重置密码？" @confirm="resetPassword(scope.row.corpUserId)">
          <el-button slot="reference" type="text" size="small">重置密码</el-button>
        </el-popconfirm>


      </template>
    </avue-crud>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
  import {
    tableOption
  } from "@/crud/basis/staff"
  import AddOrUpdate from "./staff-add-or-update"
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
      changeState(corpUserId, state) {
        this.$http({
          url: this.$http.adornUrl(`/corp/user/userState`),
          method: "put",
          data: this.$http.adornData({
            state,
            corpUserId
          })
        }).then(({
          data
        }) => {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getDataList(this.page)
            }
          })
        })
      },
      getDataList(page) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl("/corp/user/page"),
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
      resetPassword(corpUserId) {
        this.$http({
            url: this.$http.adornUrl(`/corp/user/resetPassword/${corpUserId}`),
            method: "put",
            data: this.$http.adornData({
              corpUserId
            })
          })
          .then(({
            data
          }) => {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.refreshChange()
              }
            })
          })
      },
      async renewHandle(corpUserId) {
        let res = await this.$http({
          url: this.$http.adornUrl(`/corp/user/renewOpt`),
          method: "get",
          data: this.$http.adornData({
            corpUserId
          })
        })
        let {
          days,
          renewFee
        } = res.data;

        this.$confirm(`账号续费${days}日，金额${renewFee}元确定吗`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.$http({
                url: this.$http.adornUrl(`/corp/user/renew/${corpUserId}`),
                method: "put",
                data: this.$http.adornData({
                  corpUserId
                })
              })
              .then(({
                data
              }) => {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.refreshChange()
                  }
                })
              })
          })
          .catch(() => {})
      },
      deleteHandle(corpUserId) {
        this.$confirm("确定进行删除操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl(`/corp/user/delete/${corpUserId}`),
              method: "delete",
              data: this.$http.adornData({})
            }).then(({
              data
            }) => {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.refreshChange()
                }
              })
            })
          })
          .catch(() => {})
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

<style lang="scss">
  .el-popconfirm__action {
    margin-top: 10px;
  }
</style>
