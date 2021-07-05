<template>
  <el-dialog title="违规管理"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="35%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="处理人"
                    prop="handler">
        <el-input v-model="dataForm.handler"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="处理状态"
                    prop="status">
        <!-- 1平台进行下线 2 重新申请，等待审核 3.审核通过 4 审核未通过 -->
        <el-tag v-if="dataForm.status === 1"
                size="small"
                type="danger">平台下线</el-tag>
        <el-tag v-else-if="dataForm.status === 2"
                size="small"
                type="warning">等待审核</el-tag>
        <el-tag v-else-if="dataForm.status === 3"
                size="small"
                type="success">审核通过</el-tag>
        <el-tag v-else-if="dataForm.status === 4"
                size="small"
                type="danger">审核不通过</el-tag>
        <el-tag v-else
                size="small"
                type="warning">其他</el-tag>

      </el-form-item>
      <el-form-item label="下线原因"
                    prop="offlineReason">
        <el-input type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  maxlength="200"
                  v-model="dataForm.offlineReason"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="下线时间"
                    prop="createTime">
        <el-input v-model="dataForm.createTime"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.status === 1 || dataForm.status === 4"
                    label="申请理由"
                    prop="reapplyReason">
        <el-input type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  maxlength="200"
                  v-model="reapplyReason"
                  :disabled="!(dataForm.status === 1 || dataForm.status === 4)"></el-input>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div>
      <div style="margin-bottom:10px"><strong>申请日志</strong></div>
      <div v-for="item in dataForm.offlineHandleEventItemList"
           :key="item.eventItemId">
        <el-row type="flex"
                justify="space-around">
          <el-col :span="3"><strong>申请时间：</strong></el-col>
          <el-col :span="24"><span class="content-color">{{item.createTime}}</span></el-col>
        </el-row>
        <el-row type="flex"
                justify="space-around">
          <el-col :span="3"><strong>申请理由：</strong></el-col>
          <el-col :span="24">
            <div> <span class="content-color">{{item.reapplyReason}}</span></div>
          </el-col>
        </el-row>
        <el-row type="flex"
                justify="space-around"
                v-if="item.auditTime">
          <el-col :span="3"><strong>审核时间：</strong></el-col>
          <el-col :span="24">
            <div> <span class="content-color">{{item.auditTime}}</span></div>
          </el-col>
        </el-row>
        <el-row type="flex"
                justify="space-around"
                v-if="item.refuseReason">
          <el-col :span="3"><strong>拒绝原因：</strong></el-col>
          <el-col :span="24">
            <div> <span class="content-color">{{item.refuseReason}}</span></div>
          </el-col>
        </el-row>
        <div style="width:50%">
          <el-divider />
        </div>
      </div>
    </div>

    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"
                 size="mini">取消</el-button>
      <el-button type="primary"
                 size="mini"
                 :disabled="dataForm.status !== 1 && dataForm.status !== 4"
                 @click="dataFormSubmit()">提交申请</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        eventId: null,
        handleType: null,
        handleId: null,
        shopId: null,
        handlerId: null,
        status: null,
        offlineReason: null
      },
      reapplyReason: '',
      id: 0,
      dataRule: {
      }
    }
  },
  props: {
    selectUrl: {
      default: '',
      type: String
    },
    applyUrl: {
      default: '',
      type: String
    }
  },
  methods: {
    init (id) {
      this.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.id) {
          this.$http({
            url: this.$http.adornUrl(this.selectUrl + '/' + id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (!data) {
              this.$message({
                message: '商品不在审核状态，请刷新后重试',
                type: 'error',
                duration: 1500,
                onClose: () => {
                  this.reapplyReason = ''
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }
            this.dataForm = data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      if (!this.reapplyReason) {
        this.$message.error('申请理由不能为空')
        return
      }
      this.$confirm('确定提交申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(this.applyUrl),
          method: 'post',
          data: this.$http.adornData({
            eventId: this.dataForm.eventId,
            handleId: this.id,
            reapplyReason: this.reapplyReason
          })
        }).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.reapplyReason = ''
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        })
      })
    }
  }
}
</script>
<style  lang="scss" scoped>
.content-color {
  color: #4395ff;
}
</style>
