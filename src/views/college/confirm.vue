<template>
  <div class="app-content">
    <el-breadcrumb separator="/" class="app-content">
      <el-breadcrumb-item :to="{ path: '/college/index' }">成长学院</el-breadcrumb-item>
      <el-breadcrumb-item @click.native="$router.back()">课程详情</el-breadcrumb-item>
      <el-breadcrumb-item>订单确认</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单信息</span>
      </div>
      <div class="course-item">
        <img :src="info.coverImg" class="course-img" />
        <div class="course-info">
          <div class="titlebox">
            <div class="multi-ellipsis--l2">
              <el-tag type="primary" size="mini" v-if="info.liveType==0">直播</el-tag>
              <el-tag type="danger" size="mini" v-else-if="info.liveType==1">录播</el-tag>
              <el-tag type="success" size="mini" v-else-if="info.liveType==2">现场</el-tag>
              {{info.title}}
            </div>
          </div>
          <div class="price-box">
            <div class="price">¥{{info.livePrice==0?'免费':info.livePrice}}</div>
          </div>
        </div>
      </div>
      <div class="section-payment">
        <div class="tit">选择支付方式</div>
        <div class="con">
          <div class="item" v-if="isSchoolpay" :class="{ active: payType === PayTypeConstant.SCHOOLPAY }"
            @click="payType = PayTypeConstant.SCHOOLPAY">
            <img src="../../assets/img/icon-pay-school.png" alt />
          </div>
          <div class="item" v-if="isWeixinpay" :class="{ active: payType === PayTypeConstant.WECHATPAY_SWEEP_CODE }"
            @click="payType = PayTypeConstant.WECHATPAY_SWEEP_CODE">
            <img src="../../assets/img/icon-pay-wx.png" alt />
          </div>
        </div>
        <div class="pay-footer">
          <div class="total-wrap">
            <div class="total-price">总计：<span>&yen; </span><span class="total">{{info.livePrice}}</span></div>
            <div class="tip" v-if="payType === PayTypeConstant.SCHOOLPAY && isTeacherpay">向校方提起购买申请，经审核后由校方支付</div>
          </div>
          <!--管理员-->
          <a href="javascript:void(0)" class="pay-btn" @click="toPay('master')"
            v-if="isTeacherpay && isMasterpay">立即付款</a>

          <!--老师-->
          <a href="javascript:void(0)" class="pay-btn" @click="toApply"
            v-else-if="payType === PayTypeConstant.SCHOOLPAY && isTeacherpay">立即申请</a>
          <a href="javascript:void(0)" class="pay-btn" @click="toPay('teacher')"
            v-else-if="payType === PayTypeConstant.WECHATPAY_SWEEP_CODE && isTeacherpay">立即付款</a>

          <!--校长-->
          <a href="javascript:void(0)" class="pay-btn" @click="toPay('master')"
            v-else-if=" payType === PayTypeConstant.SCHOOLPAY && isMasterpay">立即付款</a>
          <a href="javascript:void(0)" class="pay-btn" @click="toPay('master')"
            v-else-if=" payType === PayTypeConstant.WECHATPAY_SWEEP_CODE && isMasterpay">立即付款</a>
        </div>
      </div>
    </el-card>

    <el-dialog title="微信支付" :close-on-click-modal="false" :visible.sync="visible" @close="onClose">
      <div class="pay-qr-block">
        <div class="pay-money">实付金额：<span class="uni">¥</span><span>{{info.livePrice}}</span></div>
        <div class="pay-tip">请在5分钟内完成支付，否则可能导致购买失败</div>
        <div id="qrCode" class="qrCode" ref="qrCodeDiv"></div>
        <p>请使用微信扫描</p>
        <p>二维码以完成支付</p>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2';

  import {
    PayType
  } from "@/utils/constant"
  export default {
    data() {
      return {
        visible: false,
        payType: '', //支付类型，默认学校支付
        PayTypeConstant: PayType, //支付类型常量
        info: {},
        isCanPay: true, //是否能支付
        isMasterpay: this.isAuth("corp:live:masterpay"),
        isTeacherpay: this.isAuth("corp:live:teacherpay"),
        isSchoolpay: this.isAuth("corp:live:schoolpay"),
        isWeixinpay: this.isAuth("corp:live:weixinpay"),
        timer: '',
        applyId: this.$route.query.applyId, //校长审批带过来的

      }
    },

    mounted() {
      let liveId = this.$route.query.liveId;
      this.liveId = liveId;
      if (this.isSchoolpay) {
        this.payType = PayType.SCHOOLPAY
      } else if (this.isTeacherpay) {
        this.payType = PayType.WECHATPAY_SWEEP_CODE
      }
      this.getCourseDetail(liveId);
    },
    methods: {
      getCourseDetail(liveId) {
        this.$http({
          url: this.$http.adornUrl(`/corp/live/${liveId}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.info = data;
        })
      },
      onClose() {
        this.$message({
          message: "支付取消",
          type: "error",
          duration: 3000,

        })
        clearInterval(this.timer)
      },
      toPay(type) {
        let url;
        if (type == 'teacher') {
          url = `/corp/liveorder/teacherpay/${this.info.liveId}/${this.payType}`
        } else if (type == 'master') {
          url = `/corp/liveorder/masterpay/${this.info.liveId}/${this.payType}`
        }
        this.$http({
          url: this.$http.adornUrl(url),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          if (typeof data === 'string') {
            this.visible = true;
            this.$nextTick(() => {
              new QRCode(this.$refs.qrCodeDiv, {
                text: data,
                width: 200,
                height: 200,
                colorDark: "#333333", //二维码颜色
                colorLight: "#ffffff", //二维码背景色
                correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
              })
            })
          }
          this.timer = setInterval(() => {
            this.setInterPay()
          }, 1000)

        })
      },
      setInterPay() {
        this.$http({
          url: this.$http.adornUrl(`/corp/liveorder/isPay/${this.info.liveId}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          if (data) {
            clearInterval(this.timer)
            this.$message({
              message: "支付成功",
              type: "success",
              duration: 2000,
              onClose: () => {
                //校长同意审批
                if (this.applyId) {
                  this.$http({
                    url: this.$http.adornUrl(`/corp/live/masterapprovel/${this.applyId}`),
                    method: "get",
                    data: this.$http.adornParams({
                      approval: 1
                    })
                  }).then(({
                    data
                  }) => {
                    this.$router.replace({
                      name: "collegePaySuccess"
                    })
                  })
                } else {
                  this.$router.push({
                    name: "collegePaySuccess"
                  })
                }
              }
            })
          }
        })
      },
      toApply() {
        if (this.info.applyId) {
          this.$message({
            message: "该课程已申请",
            type: "info",
            duration: 2000
          })
          return;
        }
        this.$http({
          url: this.$http.adornUrl(`/corp/live/applynow/${this.info.liveId}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.$message({
            message: "申请成功",
            type: "success",
            duration: 2000,
            onClose: () => {
              this.$router.push({
                name: "collegeMyTrain"
              })
            }
          })
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .el-breadcrumb {
    padding: 20px 0 30px 0;
  }

  .pay-qr-block {
    text-align: center;

    .qrCode {
      /deep/ img {
        margin: 20px auto !important;
      }
    }

    .pay-money {
      font-size: 16px;

      .uni {
        font-size: 16px;
      }

      >span {
        font-size: 24px;
        color: #F0584D;
      }
    }

    .pay-tip {
      margin-top: 5px;
    }
  }


  .box-card {
    width: 800px;
    margin: 0 auto;
  }

  .course-item {
    background: #F8F8F8;
    display: flex;
    padding: 5px 0;

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
          font-size: 12px;
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

  .pay-footer {
    background: rgba($color: #C8EBFA, $alpha: 0.4);
    border-top: 1px solid #19B2FF;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 40px 20px;

    .total-wrap {
      text-align: right;

      .total-price {
        font-weight: bold;

        >span {
          color: #FF5F33;
        }

        .total {
          font-size: 20px;
        }

      }
    }

    .tip {
      font-size: 14px;
      margin-top: 5px;
      color: #666666;
    }
  }


  .section-payment {
    margin-top: 30px;
  }

  .section-payment .tit {
    margin-bottom: 20px;
    font-size: 14px;
    padding: 0 20px;
    font-weight: 600;
  }

  .section-payment .con {
    display: flex;
  }

  .section-payment .con .item {
    width: 174px;
    height: 60px;
    line-height: 60px;
    margin-left: 20px;
    margin-bottom: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    transition: all 0.2s;
    align-items: center;
    justify-content: center;

    img {
      width: 78%;
    }
  }

  .section-payment .con .item:hover {
    border-color: #19B2FF;
  }

  .section-payment .con .item.active {
    border-color: #19B2FF;
  }

  .section-payment .pay-btn {
    margin-top: 10px;
    margin-left: 20px;
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
    width: 174px;
    height: 42px;
    line-height: 42px;
    background: #19B2FF;
    text-align: center;
    color: #fff;
    border-radius: 2px;
  }

  .section-payment .pay-btn:hover {
    opacity: 0.9;
  }

  .section-payment .pay-btn.no-pay {
    cursor: not-allowed;
    background: #ccc;
  }
</style>
