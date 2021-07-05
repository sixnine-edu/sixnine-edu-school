<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-20 23:02:26
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-15 14:09:14
-->
<template>
    <div class="payment">
        <div class="app-content">
            <div class="step-box">
                <div class="left">
                    <span class="img"></span>
                    <span class="text">订单支付</span>
                </div>
                <div class="steps">
                    <div class="item">
                        <div class="number">step 01.</div>
                        <div class="text">选择购买商品</div>
                    </div>
                    <div class="item">
                        <div class="number">step 02.</div>
                        <div class="text">确认订单信息</div>
                    </div>
                    <div class="item active">
                        <div class="number">step 03.</div>
                        <div class="text">支付完成订单</div>
                    </div>
                </div>
            </div>
            <div class="payment-con">
                <div class="pay-box">
                    <div class="pay-info">
                        <div class="tag success"></div>
                        <div class="item">
                            <div class="tit">订单提交成功，请您尽快付款！</div>
                            <div class="total-pay">
                                应付总额：
                                <span class="price">
                                    <span v-if="payOrderInfo.totalFee">{{ total }}元</span>
                                    <span v-if="payOrderInfo.totalFee && payOrderInfo.totalScore">+</span>
                                    <span v-if="payOrderInfo.totalScore">{{ payOrderInfo.totalScore }}积分</span>
                                </span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="rest-time" v-if="isOverTime">
                                请在
                                <span class="time">{{ min }} : {{ sec }}</span
                                >内完成支付，超出后将取消订单
                            </div>
                            <div class="rest-time" v-if="!isOverTime">订单已过期，请重新下单</div>
                            <div class="order-det" @click="showOrderInfo = !showOrderInfo">订单详情</div>
                        </div>
                    </div>
                    <div class="order-info" v-if="showOrderInfo">
                        <div class="text">
                            <div class="label">收货信息：</div>
                            <div class="con">{{ payOrderInfo.receiver }} {{ payOrderInfo.mobile }}</div>
                            <div class="con">{{ payOrderInfo.userAddr }}</div>
                        </div>
                        <div class="text">
                            <div class="label">商品名称：</div>
                            <div class="con con-items">
                                <div class="item" v-for="item in payOrderInfo.prodNameList" :key="item">{{ item }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section-payment">
                    <div class="tit" v-if="payOrderInfo.totalFee > 0">选择支付方式</div>
                    <div class="con" v-if="payOrderInfo.totalFee > 0">
                        <div class="item" :class="{ active: payType === PayTypeConstant.ALIPAY }" @click="payType = PayTypeConstant.ALIPAY">
                            <img src="../../assets/img/alpay.png" alt />
                            <div v-html="payHtml"></div>
                        </div>
                        <div class="item" :class="{ active: payType === PayTypeConstant.WECHATPAY_SWEEP_CODE }" @click="payType = PayTypeConstant.WECHATPAY_SWEEP_CODE">
                            <img src="../../assets/img/weixinpay.png" alt />
                        </div>
                        <!-- <div class="item"><img src="../../assets/img/unionpay.png"
            alt=""></div>-->
                    </div>
                    <a href="javascript:void(0)" :class="[isCanPay ? '' : 'no-pay', 'btn']" @click="toPay">立即付款</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { PayType } from "@/utils/constant"
export default {
    data() {
        return {
            orderNumber: "", //订单号
            total: 0, //订单价
            payHtml: "", //支付宝页面
            min: "00", //分
            sec: "00", //秒
            timer: null, //倒计时变量
            payOrderInfo: {}, //支付订单详情
            showOrderInfo: false, //是否显示订单详情
            payType: PayType.ALIPAY, //支付类型，默认支付宝
            PayTypeConstant: PayType, //支付类型常量
            isCanPay: true, //是否能支付
            isOverTime: true //能否支付的文字提示
        }
    },
    mounted() {
        this.orderNumber = sessionStorage.getItem("pay_orderNumber")
        this.total = sessionStorage.getItem("pay_total")
        this.getOrderDet()
    },
    methods: {
        // 请求支付订单详情
        getOrderDet() {
            this.$http({
                url: this.$http.adornUrl(`/corp/order/getOrderPayInfoByOrderNumber`),
                method: "get",
                params: this.$http.adornParams({
                    orderNumbers: this.orderNumber
                })
            }).then(({ data }) => {
                this.payOrderInfo = data
                this.countTime()
            })
        },

        // 倒计时
        countTime(hu) {
            // 获取当前时间
            let date = new Date()
            let now = date.getTime()

            // // 设置截止时间（）
            let end = new Date(this.payOrderInfo.endTime).getTime()

            // 时间差
            let leftTime = end - now

            // 定义变量 d,h,m,s保存倒计时的时间
            if (leftTime >= 0) {
                // 分
                let m = Math.floor((leftTime / 1000 / 60) % 60)
                this.min = m < 10 ? "0" + m : m
                // 秒
                let s = Math.floor((leftTime / 1000) % 60)
                this.sec = s < 10 ? "0" + s : s
            } else {
                this.min = "00"
                this.sec = "00"
                this.isOverTime = false
                this.isCanPay = false
            }
            // 等于0的时候不调用
            if (Number(this.min) === 0 && Number(this.sec) === 0) {
                return
            } else {
                // 递归每秒调用countTime方法，显示动态时间效果,
                this.timer = setTimeout(this.countTime, 1000)
            }
        },

        //去支付
        toPay() {
            this.$http({
                url: this.$http.adornUrl("/corp/order/pay"),
                method: "post",
                data: this.$http.adornData({
                    payType: 0,
                    orderNumbers: this.orderNumber
                })
            }).then(({ data }) => {
                this.$router.push({ path: "/store/user-center/uc-order" })
            })
            return

            // if (this.isCanPay && this.payOrderInfo.totalFee == 0 && this.payOrderInfo.totalScore) {
            //     // 纯积分
            // this.$http({
            //         url: this.$http.adornUrl("/corp/order/pay"),
            //         method: "post",
            //         data: this.$http.adornData({
            //             payType: 0,
            //             orderNumbers: this.orderNumber
            //         })
            //     }).then(({ data }) => {
            //         this.$router.push({ path: "/store/user-center/uc-order" })
            //     })
            //     return
            // }
            // if (this.isCanPay) {
            //     var type = this.payType
            //     if (type == PayType.ALIPAY) {
            //         this.$http({
            //             url: this.$http.adornUrl("/corp/order/pay"),
            //             method: "post",
            //             data: this.$http.adornData({
            //                 payType: type,
            //                 orderNumbers: this.orderNumber,
            //                 returnUrl: window.location.origin + "/user-center/uc-order"
            //             })
            //         })
            //         .then(({ data }) => {
            //             // 支付宝部分
            //             this.payHtml = data
            //             this.$nextTick(() => {
            //                 document.forms[0].submit()
            //             })
            //         })
            //     } else if (type == PayType.WECHATPAY_SWEEP_CODE) {
            //         // 微信部分
            //         this.$router.push({
            //             path: "/weixin-pay"
            //         })
            //     }
            // } else {
            //     return false
            // }
        }
    },

    destroyed() {
        if (this.timer) {
            //如果定时器在运行则关闭
            clearInterval(this.timer)
        }
    }
}
</script>

<style scoped src="./css/payment.css"></style>
