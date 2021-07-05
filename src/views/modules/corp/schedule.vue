<template>
  <div class="mod-schedule">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.beanName" :placeholder="$t('corp.beanName')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">{{$t('coupon.query')}}</el-button>
        <el-button @click="searchReset()">{{$t('coupon.empty')}}</el-button>
        <el-button
          v-if="isAuth('corp:schedule:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >{{$t('sysManagement.add')}}</el-button>
        <el-button
          v-if="isAuth('corp:schedule:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >{{$t('publics.batchDelete')}}</el-button>
        <el-button
          v-if="isAuth('corp:schedule:pause')"
          type="danger"
          @click="pauseHandle()"
          :disabled="dataListSelections.length <= 0"
        >{{$t('publics.batchStopte')}}</el-button>
        <el-button
          v-if="isAuth('corp:schedule:resume')"
          type="danger"
          @click="resumeHandle()"
          :disabled="dataListSelections.length <= 0"
        >{{$t('publics.batchRestore')}}</el-button>
        <el-button
          v-if="isAuth('corp:schedule:run')"
          type="danger"
          @click="runHandle()"
          :disabled="dataListSelections.length <= 0"
        >{{$t('publics.batchExecuteImmediately')}}</el-button>
        <el-button
          v-if="isAuth('corp:schedule:log')"
          type="success"
          @click="logHandle()"
        >{{$t('sysManagement.logList')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="jobId" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <el-table-column
        prop="beanName"
        header-align="center"
        align="center"
        :label="$t('corp.beanName')"
      ></el-table-column>
      <el-table-column
        prop="methodName"
        header-align="center"
        align="center"
        :label="$t('corp.methodName')"
      ></el-table-column>
      <el-table-column prop="params" header-align="center" align="center"></el-table-column>
      <el-table-column
        prop="cronExpression"
        header-align="center"
        align="center"
        :label="$t('corp.cronExpression')"
      ></el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        :label="$t('publics.remark')"
      ></el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('publics.status')"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">{{$t('publics.normal')}}</el-tag>
          <el-tag v-else size="small" type="danger">{{$t('publics.stop')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('publics.operating')"
      >
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('corp:schedule:update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.jobId)"
          >{{$t('sysManagement.modify')}}</el-button>
          <el-button
            v-if="isAuth('corp:schedule:delete')"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.jobId)"
          >{{$t('coupon.cancel')}}</el-button>
          <el-button
            v-if="isAuth('corp:schedule:pause')"
            type="text"
            size="small"
            @click="pauseHandle(scope.row.jobId)"
          >{{$t('publics.stop')}}</el-button>
          <el-button
            v-if="isAuth('corp:schedule:resume')"
            type="text"
            size="small"
            @click="resumeHandle(scope.row.jobId)"
          >{{$t('publics.restore')}}</el-button>
          <el-button
            v-if="isAuth('corp:schedule:run')"
            type="text"
            size="small"
            @click="runHandle(scope.row.jobId)"
          >{{$t('publics.executeImmediately')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 日志列表 -->
    <log v-if="logVisible" ref="log"></log>
  </div>
</template>

<script>
import AddOrUpdate from './schedule-add-or-update'
import Log from './schedule-log'
export default {
  data () {
    return {
      dataForm: {
        beanName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,

      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      logVisible: false
    }
  },
  components: {
    AddOrUpdate,
    Log
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      if (this.dataForm.beanName) {
        this.pageIndex = 1
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/corp/schedule/page'),
        method: 'get',
        params: this.$http.adornParams({
          'current': this.pageIndex,
          'size': this.pageSize,
          'beanName': this.dataForm.beanName
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
    // 清空
    searchReset () {
      this.dataForm.beanName = null
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
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
        return item.jobId
      })
      this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${id ? this.$i18n.t('coupon.delete') : this.$i18n.t('corp.batchDelete')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/corp/schedule'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      }).catch(() => { })
    },
    // 暂停
    pauseHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${id ? this.$i18n.t('publics.stop') : this.$i18n.t('publics.batchStopte')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/corp/schedule/pause'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      }).catch(() => { })
    },
    // 恢复
    resumeHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${id ? this.$i18n.t('publics.restore') : this.$i18n.t('publics.batchRestore')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/corp/schedule/resume'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      }).catch(() => { })
    },
    // 立即执行
    runHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${id ? this.$i18n.t('publics.executeImmediately') : this.$i18n.t('publics.batchExecuteImmediately')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/corp/schedule/run'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      }).catch(() => { })
    },
    // 日志列表
    logHandle () {
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.log.init()
      })
    }
  }
}
</script>
