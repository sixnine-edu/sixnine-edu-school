<template>
  <div class="app-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/college/index' }">成长学院</el-breadcrumb-item>
      <el-breadcrumb-item>我的培训</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="train-block">
      <div class="train-left">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>我的培训</span>
          </div>
          <div class="train-menu">
            <div class="menu-item" :class="{active:index==curMenuIndex}" v-for="(item,index) in menuList" :key="index"
              @click="curMenuIndex=index">{{item}}</div>
          </div>
        </el-card>
      </div>
      <div class="train-right">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>{{menuList[curMenuIndex]}}</span>
          </div>
          <div class="t-content">
            <section v-if="curMenuIndex==0">
              <div class="course-block" v-if="applyList.length > 0">
                <div class="course-item" v-for="(item, index) in applyList" :key="index">
                  <div class="flex" @click="toLive(item.liveId)">
                    <img :src="item.coverImg" class="course-img" />
                    <div class="course-info">
                      <div class="titlebox">
                        <div class="multi-ellipsis--l2">
                          <el-tag type="primary" size="mini" v-if="item.liveType==0">直播</el-tag>
                          <el-tag type="danger" size="mini" v-else-if="item.liveType==1">录播</el-tag>
                          <el-tag type="success" size="mini" v-else-if="item.liveType==2">现场</el-tag>
                          {{item.title}}
                        </div>
                        <div class="time" v-if="item.liveTime"> 开始时间：{{item.liveTime}}</div>
                        <div class="time" v-if="item.empName">申请人:{{ item.empName }}</div>
                      </div>
                      <div class="price-box">
                        <div class="price">{{item.livePrice==0?'免费':'¥'+item.livePrice}}</div>
                      </div>
                    </div>
                  </div>
                  <div class="btn-group">
                    <!-- v-if="!(isMaster && isTeacher)" -->
                    <template v-if="isMaster">
                      <template v-if="item.state==0 && isAuth('corp:live:masterapproval')">
                        <el-button type="primary" size="small" @click="onMasterApprove(item.applyId,item.liveId)">同意
                        </el-button>
                        <el-button type="info" size="small" @click="onReject(item.applyId)">拒绝</el-button>
                      </template>
                      <el-button type="success" size="small" disabled v-if="item.state==1">已审批</el-button>
                      <el-button type="info" size="small" disabled v-if="item.state==2">已拒绝</el-button>
                    </template>
                    <template v-else-if="isTeacher">
                      <span v-if="item.state==0" class="red">待审批</span>
                      <span v-if="item.state==1" class="green">审批通过</span>
                      <span v-if="item.state==2" class="red">审批不通过</span>

                    </template>
                    <div class="mt20">{{item.applyTime}}</div>
                  </div>
                </div>
              </div>
              <div class="empty-tip" v-else>
                <div class="el-icon-receiving"></div>
                <div class="empty-text">暂无数据</div>
              </div>
            </section>
            <section v-if="curMenuIndex==1">
              <el-tabs v-model="activeName">
                <el-tab-pane label="全部"></el-tab-pane>
                <el-tab-pane label="付费"></el-tab-pane>
                <el-tab-pane label="免费"></el-tab-pane>
              </el-tabs>
              <div class="course-block" v-if="filterList.length > 0">
                <div class="course-item" v-for="(item, index) in filterList" :key="index">
                  <div class="flex" @click="toLive(item.liveId)">
                    <img :src="item.coverImg" class="course-img" />
                    <div class="course-info">
                      <div class="titlebox">
                        <div class="multi-ellipsis--l2">
                          <el-tag type="primary" size="mini" v-if="item.liveType==0">直播</el-tag>
                          <el-tag type="danger" size="mini" v-else-if="item.liveType==1">录播</el-tag>
                          <el-tag type="success" size="mini" v-else-if="item.liveType==2">现场</el-tag>
                          {{item.title}}
                        </div>
                        <div class="time" v-if="item.liveTime"> 开始时间：{{item.liveTime}}</div>
                        <div class="time" v-if="item.distributeEmpName"> 已分配：{{item.distributeEmpName}}</div>
                      </div>
                      <div class="price-box">
                        <div class="price">{{item.livePrice==0?'免费':'¥'+item.livePrice}}</div>
                      </div>
                    </div>
                  </div>
                  <div class="btn-group">
                    <!-- v-if="!(isMaster && isTeacher)" -->
                    <template v-if="isMaster">
                      <el-button type="primary" size="small" v-if="!item.distributeUserId"
                        @click="addOrUpdateHandle(item)">分配课程</el-button>
                     <!-- <el-button type="danger" size="small" v-else @click="onRemove(item)">取消分配</el-button> -->
                    </template>
                    <template v-else-if="isTeacher">
                      <el-button type="primary" size="small" @click="toLive(item.liveId)">查看详情</el-button>
                    </template>

                  </div>
                </div>
              </div>
              <div class="empty-tip" v-else>
                <div class="el-icon-receiving"></div>
                <div class="empty-text">暂无数据</div>
              </div>
            </section>
          </div>
        </el-card>
      </div>
    </div>
    <!-- -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getTrainList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from "./teacher-add-or-update"
  export default {
    components: {
      AddOrUpdate
    },
    data() {
      return {
        menuList: ['我的申请', '我的培训'],
        curMenuIndex: 0,
        activeName: "0",
        addOrUpdateVisible: false,
        isMaster: this.isAuth("corp:live:masterapply"),
        isTeacher: this.isAuth("corp:live:teacherapply"),
        applyList: [],
        filterList: [],
        trainList: []
      }
    },
    mounted() {
      this.getLiveApply();
      this.getTrainList();
    },
    methods: {
      // 表单提交
      onRemove(item) {
        this.$confirm("确定进行取消分配操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
              url: this.$http.adornUrl(`/corp/live/undistribute/${item.orderId}/${ item.userId}`),
              method: "get",
              data: this.$http.adornParams()
            })
            .then(({
              data
            }) => {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              })
              this.getTrainList();
            })
        })

      },

      // 新增 / 修改
      addOrUpdateHandle(item) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(item)
        })
      },
      toLive(liveId) {
        this.$router.push({
          name: "collegeCourseDetail",
          query: {
            liveId
          }
        })
      },
      getLiveApply(liveId) {
        let url = "";
        if (this.isMaster) {
          url = "/corp/live/masterapply"
        } else if (this.isTeacher) {
          url = "/corp/live/teacherapply"
        } else {
          this.$message({
            type: 'error',
            message: '暂无权限访问培训列表'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl(url),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.applyList = data
        })
      },
      getTrainList() {
        this.$http({
          url: this.$http.adornUrl('/corp/live/mytrain'),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.trainList = data;
          this.filterList = this.trainList;
        })

      },
      onMasterApprove(applyId, liveId) {
        this.$router.push({
          name: "collegeConfirm",
          query: {
            liveId,
            applyId
          }
        })

        // this.$confirm("确定同意操作?", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning"
        // }).then(() => {
        //   this.$http({
        //     url: this.$http.adornUrl(`/corp/live/masterapprove/${applyId}`),
        //     method: "get",
        //     data: this.$http.adornParams()
        //   }).then(({
        //     data
        //   }) => {
        //     this.$message({
        //       message: "操作成功",
        //       type: "success",
        //       duration: 1500,
        //       onClose: () => {
        //         this.getLiveApply()
        //       }
        //     })
        //   })
        // })
      },
      onReject(applyId) {
        this.$confirm("确定拒绝操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/corp/live/masterapproval/${applyId}`),
            method: "get",
            data: this.$http.adornParams({
              approval: 2
            })
          }).then(({
            data
          }) => {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getLiveApply()
              }
            })
          })
        })
      },


    },
    watch: {
      activeName(val) {
        if (val == 0) {
          this.filterList = this.trainList;
        } else if (val == 1) {
          this.filterList = this.trainList.filter((item) => item.livePrice > 0)
        } else if (val == 2) {
          this.filterList = this.trainList.filter((item) => item.livePrice == 0)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-breadcrumb {
    padding: 20px 0 30px 0;
  }

  .el-tabs {
    margin-bottom: 20px;
  }

  .train-block {
    display: flex;
    justify-content: space-between;

    .train-left {
      width: 300px;

      .train-menu {
        .menu-item {
          cursor: pointer;
          text-align: center;
          padding: 16px 0;
          color: #222;
          font-size: 14px;

          &.active {
            background-color: #19B2FF;
            border-radius: 5px;
            color: #fff;
          }
        }
      }

    }

    .train-right {
      flex: 1;
      margin-left: 20px;
    }
  }

  .course-block {
    .course-item {
      background: #fff;
      display: flex;
      justify-content: space-between;

      .flex {
        display: flex;
      }


      &:not(:first-child) {
        margin-top: 24px;
      }

      .course-img {
        width: 210px;
        height: 140px;
        flex-shrink: 0;
        border-radius: 10px;
      }

      .course-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px 5px 8px 5px;
        text-align: left;
        margin-left: 10px;

        .titlebox {
          color: #333;
          font-size: 15px;
          height: 60px;

          .multi-ellipsis--l2 {
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .time {
            font-size: 13px;
            color: #666;
            padding-top: 6px;
          }
        }



        .price-box {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .price {
            color: #F0584D;
            font-size: 24px;
            font-weight: bold;
          }

          .num {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }

    .btn-group {
      .apply {
        color: #f40;
      }

      .mt20 {
        margin-top: 10px;
      }

      .red {
        color: #f40;
      }

      .green {
        color: #67c23a;
      }


    }
  }
</style>
