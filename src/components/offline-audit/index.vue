<template>
  <el-dialog
    :title="$t('groups.violationManagement')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="35%"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'language' ? '130px' : '80px'"
    >
      <el-form-item :label="$t('groups.handler')" prop="handler">
        <el-input v-model="dataForm.handler" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('groups.reasonForOffline')" prop="offlineReason">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          v-model="dataForm.offlineReason"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('components.offlineTime')" prop="createTime">
        <el-input v-model="dataForm.createTime" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item v-if="isAudit" :label="$t('components.reasonForApply')" prop="applyReason">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          v-model="dataForm.applyReason"
          :disabled="true"
        ></el-input>
      </el-form-item>

      <el-form-item
        v-if="dataForm.status>1"
        :label="$t('components.processingStatus')"
        prop="status"
      >
        <!-- 1平台进行下线 2 重新申请，等待审核 3.审核通过 4 审核未通过 -->
        <el-radio-group v-model="dataForm.status" :disabled="!isAudit">
          <el-radio :label="2">{{$t('product.pendingReview')}}</el-radio>
          <el-radio :label="3">{{$t('productComm.pass')}}</el-radio>
          <el-radio :label="4">{{$t('productComm.noPass')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.status == 4"
        :label="$t('components.denialReason')"
        prop="refuseReason"
      >
        <el-input
          :disabled="!isAudit"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          maxlength="200"
          v-model="refuseReason"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-form>
      <div>
        <div style="margin-bottom:10px">
          <strong>{{$t('components.applicationHistory')}}</strong>
        </div>
        <div style v-for="item in dataForm.offlineHandleEventItemList" :key="item.eventItemId">
          <el-row type="flex" justify="space-around">
            <el-col :span="3">
              <strong>{{$t('order.applicationTime')}}：</strong>
            </el-col>
            <el-col :span="24">
              <span class="content-color">{{item.createTime}}</span>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="3">
              <strong>{{$t('components.reasonForApply')}}：</strong>
            </el-col>
            <el-col :span="24">
              <span class="content-color">{{item.reapplyReason}}</span>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-around" v-if="item.auditTime">
            <el-col :span="3">
              <strong>{{$t('components.reviewTime')}}：</strong>
            </el-col>
            <el-col :span="24">
              <span class="content-color">{{item.auditTime}}</span>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-around" v-if="item.refuseReason">
            <el-col :span="3">
              <div>
                <strong>{{$t('components.denialReason')}}：</strong>
              </div>
            </el-col>
            <el-col :span="24">
              <div>
                <span class="content-color">{{item.refuseReason}}</span>
              </div>
            </el-col>
          </el-row>
          <div style="width:50%">
            <el-divider />
          </div>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">{{$t('remindPop.cancel')}}</el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="!isAudit"
        @click="dataFormSubmit()"
      >{{$t('group.confirmReview')}}</el-button>
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
        offlineReason: null,
        applyReason: null,
        eventItemId: null,
        lastOfflineHandleEventItem: null
      },
      isAudit: false,
      refuseReason: '',
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
    updateUrl: {
      default: '',
      type: String
    }
  },
  methods: {
    init (id) {
      this.id = id || 0
      this.isAudit = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.id) {
          this.$http({
            url: this.$http.adornUrl(this.selectUrl + '/' + this.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (!data) {
              this.$message({
                message: this.$i18n.t('components.tipOfflineAuditTip1'),
                type: 'error',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }
            this.dataForm = data
            let lastOfflineHandleEventItem = data.lastOfflineHandleEventItem
            if (lastOfflineHandleEventItem) {
              this.dataForm.applyReason = lastOfflineHandleEventItem.reapplyReason
              this.dataForm.eventItemId = lastOfflineHandleEventItem.eventItemId
              this.refuseReason = lastOfflineHandleEventItem.refuseReason
            }
            if (data.status === 2) {
              this.refuseReason = ''
              this.isAudit = true
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$confirm(this.$i18n.t('components.tipOfflineAuditTip2'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel')
      }).then(() => {
        this.visible = false
        this.$http({
          url: this.$http.adornUrl(this.updateUrl),
          method: 'post',
          data: this.$http.adornData({
            eventId: this.dataForm.eventId,
            eventItemId: this.dataForm.eventItemId,
            handleId: this.id,
            status: this.dataForm.status,
            refuseReason: this.refuseReason || null
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
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
