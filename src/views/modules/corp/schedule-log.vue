<template>
  <el-dialog :title="$t('sysManagement'.logList)"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="75%">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id"
                  :placeholder="$t('corp.jobId')"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="findByJobId()">{{$t('order.query')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              v-loading="dataListLoading"
              height="460"
              style="width: 100%;">
      <el-table-column prop="logId"
                       header-align="center"
                       align="center"
                       width="80"
                       :label="$t('sysManagement.logId')">
      </el-table-column>
      <el-table-column prop="jobId"
                       header-align="center"
                       align="center"
                       width="80"
                       :label="$t('corp.jobId')">
      </el-table-column>
      <el-table-column prop="beanName"
                       header-align="center"
                       align="center"
                       :label="$t('corp.beanName')">
      </el-table-column>
      <el-table-column prop="methodName"
                       header-align="center"
                       align="center"
                       :label="$t('corp.methodName')">
      </el-table-column>
      <el-table-column prop="params"
                       header-align="center"
                       align="center"
                       :label="$t('corp.params')">
      </el-table-column>
      <el-table-column prop="status"
                       header-align="center"
                       align="center"
                       :label="$t('product.status')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status"
                  size="small">{{$t('order.success')}}</el-tag>
          <el-tag v-else
                  @click.native="showErrorInfo(scope.row.error)"
                  size="small"
                  type="danger"
                  style="cursor: pointer;">{{$t('order.fail')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="times"
                       header-align="center"
                       align="center"
                       :label="$t('corp.consumingTime')">
      </el-table-column>
      <el-table-column prop="createTime"
                       header-align="center"
                       align="center"
                       width="180"
                       :label="$t('sysManagement.executionTime')">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false
    }
  },
  methods: {
    init () {
      this.visible = true
      this.getDataList()
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/corp/scheduleLog/page'),
        method: 'get',
        params: this.$http.adornParams({
          'current': this.pageIndex,
          'size': this.pageSize,
          'jobId': this.dataForm.id
        })
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 失败信息
    showErrorInfo (error) {
      this.$alert(error)
    },
    // 条件查询
    findByJobId () {
      this.pageIndex = 1
      this.getDataList()
    }
  }
}
</script>
