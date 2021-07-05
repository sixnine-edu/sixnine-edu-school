<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-21 21:41:15
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-15 14:08:36
-->
<template>
    <div class="order-detail">
        <div class="app-content">
            <div class="crumbs">
                <a class="item-a" @click="userCenter()">我的订单</a>
                <span class="arrow">></span>
                <span class="item-span">订单详情</span>
            </div>
            <!-- 订单状态 -->
            <div class="status-process-1">
                <div class="status-box">
                    <div class="order-number">订单号：{{ orderNumber }}</div>
                    <!-- <div class="state">{{ ["", "待付款", "待发货", "待收货", "待评价", "已完成", "已取消", "拼团中"][orderInfo.state] }}</div> -->
                    <div class="description" v-if="orderInfo.state == 1 && betweenTime.signs == 1">剩余时间 {{ betweenTime.min + ":" + betweenTime.sec }}</div>
                    <div class="action" v-if="orderInfo.cancelTime === null">
                        <a href="javascript:void(0);" class="action-a red" v-if="orderInfo.state == 1" @click="toPayment()">立即支付</a>
                        <a href="javascript:void(0);" class="action-a" v-if="orderInfo.state == 1" @click="showTips = true">取消订单</a>
                        <!-- <a href="javascript:void(0);" class="action-a btn" v-if="orderInfo.state==2 || orderInfo.state == 3">申请退款</a>
            <a href="javascript:void(0);" class="action-a btn" v-if="orderInfo.state==4">立即评价</a>
            <a href="javascript:void(0);" class="action-a btn" v-if="orderInfo.state==5">再次购买</a>
            <a href="javascript:void(0);" class="action-a btn" v-if="orderInfo.state==5">立即购买</a>-->
                    </div>
                </div>
                <!-- <div class="process-box">
                    <div class="tip">付款时请您仔细查看订单细节以及配送信息，以确保您能及时收到货物。</div>
                    <div class="process">
                        <div :class="['item', orderInfo.state >= 1 ? 'active' : '']">
                            <div class="img process01"></div>
                            <div class="text">提交订单</div>
                            <div class="time">{{ orderInfo.createTime }}</div>
                        </div>
                        <div :class="['item', orderInfo.state >= 2 && orderInfo.payTime !== null ? 'active' : '']">
                            <div class="img process02"></div>
                            <div class="text">买家付款</div>
                            <div class="time">{{ orderInfo.payTime }}</div>
                        </div>
                        <div :class="['item', orderInfo.state >= 4 ? 'active' : '']">
                            <div class="img process03"></div>
                            <div class="text">商品出库</div>
                            <div class="time">{{ orderInfo.dvyTime }}</div>
                        </div>
                        <div :class="['item', orderInfo.state >= 4 && orderInfo.dvyTime !== null ? 'active' : '']">
                            <div class="img process04"></div>
                            <div class="text">等待收货</div>
                            <div class="time">{{ orderInfo.dvyTime }}</div>
                        </div>
                        <div :class="['item', orderInfo.state >= 4 && orderInfo.fianllyTime !== null ? 'active' : '']">
                            <div class="img process05"></div>
                            <div class="text">订单完成</div>
                            <div class="time">{{ orderInfo.fianllyTime }}</div>
                        </div>
                    </div>
                </div> -->
            </div>
            <!-- /订单状态 -->
            <!-- 配送信息 -->
            <div class="delivery-box" v-if="deliveryList.length">
                <div class="box-tab" v-if="deliveryList.length > 1">
                    <div :class="indexs === index ? 'item active' : 'item'" @click="onClickTabDelivery(item, index)" v-for="(item, index) in deliveryList" :key="index">
                        包裹{{ index + 1 }}
                    </div>
                </div>
                <div class="box-con" v-if="deliveryExpresse">
                    <div class="deliver-msg">
                        <div class="d-item">
                            <div class="text">发货时间：</div>
                            <div class="res">{{ deliveryExpresse.createTime }}</div>
                        </div>
                        <div class="d-item">
                            <div class="text">快递公司：</div>
                            <div class="res">{{ deliveryExpresse.deliveryDto.companyName }}</div>
                        </div>
                        <div class="d-item">
                            <div class="text">运单号：</div>
                            <div class="res">{{ deliveryExpresse.deliveryDto.dvyFlowId }}</div>
                        </div>
                        <div class="d-goods" :class="{ over: deliveryExpresse.orderItems.length > 5 }">
                            <div class="arrow prev" @click="prevItem" :class="{ disable: deliveryExpresse.orderItems.length - 5 <= 0 || this.offsetCount < 1 }"></div>
                            <div
                                class="arrow next"
                                @click="nextItem"
                                :class="{ disable: deliveryExpresse.orderItems.length - 5 <= 0 || this.offsetCount >= deliveryExpresse.orderItems.length - 5 }"
                            ></div>
                            <div class="item-goods">
                                <div class="goods-box" ref="carouser">
                                    <div class="item" v-for="(orderItem, index) in deliveryExpresse.orderItems" :key="index">
                                        <div class="img">
                                            <img :src="orderItem.pic" alt />
                                            <div class="number">×{{ orderItem.prodCount }}</div>
                                        </div>
                                        <div class="name">{{ orderItem.prodName }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="logistics">
                        <div class="l-tit" v-if="deliveryExpresse">
                            <span class="text">物流状态：</span>
                            <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 0">没有记录</span>
                            <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 1">已揽收</span>
                            <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 2">运输途中</span>
                            <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 3">已签收</span>
                            <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 201">达到目的城市</span>
                            <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 4">问题件</span>
                        </div>
                        <div class="logistics-box">
                            <div v-if="deliveryExpresse.deliveryDto.traces.length">
                                <div class="item" v-for="(trace, index) in deliveryExpresse.deliveryDto.traces" :key="index">
                                    <div class="time">{{ trace.acceptTime }}</div>
                                    <div class="text">{{ trace.acceptStation }}</div>
                                </div>
                            </div>
                            <div class="item" v-if="!deliveryExpresse.deliveryDto.traces.length">暂无物流信息，请您稍后再试</div>
                            <div class="item" v-if="orderInfo.state >= 3 && orderInfo.dvyTime !== null">
                                <div class="time">{{ orderInfo.dvyTime }}</div>
                                <div class="text">商家已发货，请等待快递拣货</div>
                            </div>
                            <div class="item" v-if="orderInfo.state >= 2 && orderInfo.payTime !== null">
                                <div class="time">{{ orderInfo.payTime }}</div>
                                <div class="text">您已支付完成，请等待商家发货</div>
                            </div>
                            <div class="item" v-if="orderInfo.state >= 1">
                                <div class="time">{{ orderInfo.createTime }}</div>
                                <div class="text">您提交了订单，请等待系统确认</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /配送信息 -->
            <!-- 订单信息 -->
            <div class="order-info">
                <div class="item">
                    <div class="tit">收货信息</div>
                    <div class="con">
                        <div class="con-item">
                            <span class="item-tit">收件人：</span>
                            <span class="item-con">{{ corpAddrDto.receiver }}</span>
                        </div>
                        <div class="con-item">
                            <span class="item-tit">联系方式：</span>
                            <span class="item-con">{{ corpAddrDto.mobile }}</span>
                        </div>
                        <div class="con-item">
                            <span class="item-tit">收货地址：</span>
                            <span class="item-con">{{ corpAddrDto.province + corpAddrDto.city + corpAddrDto.area + corpAddrDto.addr }}</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="tit">配送信息</div>
                    <div class="con">
                        <div class="con-item">
                            <span class="item-tit">配送方式：</span>
                            <span class="item-con" v-if="orderInfo.dvyType">{{ ["普通快递", "买家自提", "无需快递"][orderInfo.dvyType - 1] }}</span>
                            <span class="item-con" v-if="!orderInfo.dvyType">无</span>
                        </div>
                        <div class="con-item">
                            <span class="item-tit">运 费：</span>
                            <span class="item-con">￥{{ parsePrice(orderInfo.transfee)[0] }}.{{ parsePrice(orderInfo.transfee)[1] }}</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="tit">付款信息</div>
                    <div class="con">
                        <div class="con-item">
                            <span class="item-tit">付款方式：</span>
                            <span class="item-con">在线支付</span>
                        </div>
                        <div class="con-item">
                            <span class="item-tit">商品总额：</span>
                            <span class="item-con">￥{{ parsePrice(orderInfo.total)[0] }}.{{ parsePrice(orderInfo.total)[1] }}</span>
                        </div>
                        <!-- <div class="con-item">
                            <span class="item-tit">优惠金额：</span>
                            <span class="item-con">-￥{{ parsePrice(orderInfo.reduceAmount)[0] }}.{{ parsePrice(orderInfo.reduceAmount)[1] }}</span>
                        </div> -->
                        <!-- <div class="con-item">
              <span class="item-tit">　优惠券：</span>
              <span class="item-con">￥{{parsePrice(orderInfo.couponMoney?orderInfo.couponMoney:0)[0]}}.{{parsePrice(orderInfo.couponMoney?orderInfo.couponMoney:0)[1]}}</span>
            </div>-->
                        <div class="con-item">
                            <span class="item-tit">{{ orderInfo.state == 1 ? "应付金额：" : "实付金额：" }}</span>
                            <span class="item-con">
                                ￥{{ parsePrice(orderInfo.actualTotal)[0] }}.{{ parsePrice(orderInfo.actualTotal)[1] }}
                                <span v-if="orderInfo.actualTotal && orderInfo.orderScore">+</span>
                                <span v-if="orderInfo.orderScore">{{ orderInfo.orderScore }} 积分</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="tit">订单备注</div>
                    <div class="con">
                        <div class="con-item">
                            <!-- <span class="item-tit">发票类型：</span> -->
                            <span class="item-con">{{ orderInfo.remarks }}</span>
                        </div>
                        <!-- <div class="con-item">
              <span class="item-tit">发票抬头：</span>
              <span class="item-con">个人</span>
            </div>
            <div class="con-item">
              <span class="item-tit">发票内容：</span>
              <span class="item-con">商品明细</span>
            </div>-->
                    </div>
                </div>
                <!-- <div class="item">
          <div class="tit">发票信息</div>
          <div class="con">
            <div class="con-item">
              <span class="item-tit">发票类型：</span>
              <span class="item-con">电子普通发票</span>
            </div>
            <div class="con-item">
              <span class="item-tit">发票抬头：</span>
              <span class="item-con">个人</span>
            </div>
            <div class="con-item">
              <span class="item-tit">发票内容：</span>
              <span class="item-con">商品明细</span>
            </div>
          </div>
        </div>-->
            </div>
            <!-- /订单信息 -->
            <!-- 商品信息 -->
            <div class="goods-box">
                <div class="goods-con">
                    <div class="order-table">
                        <table cellspacing="0" cellpadding="0" class="box">
                            <tbody>
                                <tr class="box-tit">
                                    <th>商品</th>
                                    <th width="100" class="tal">数量</th>
                                    <th width="140">单价</th>
                                    <th width="140">总价</th>
                                    <th width="140">操作</th>
                                </tr>
                                <tr class="box-tr" v-for="(prod, prodIndex) in orderInfo.orderItemDtos" :key="prodIndex">
                                    <td>
                                        <div class="goods-info">
                                            <a :href="(orderInfo.orderType == 3 ? '/member-center/integral-det/' : '/detail/') + prod.prodId" class="img">
                                                <img :src="prod.pic" alt />
                                            </a>
                                            <div class="name-sku">
                                                <a :href="(orderInfo.orderType == 3 ? '/member-center/integral-det/' : '/detail/') + prod.prodId" class="name">{{
                                                    prod.prodName
                                                }}</a>
                                                <span class="sku">{{ prod.skuName }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="goods-number">×{{ prod.prodCount }}</div>
                                    </td>
                                    <td>
                                        <span class="price">￥{{ parsePrice(prod.price)[0] }}.{{ parsePrice(prod.price)[1] }}</span>
                                    </td>
                                    <td>
                                        <span class="price">￥{{ parsePrice(prod.prodCount*prod.price)[0] }}.{{ parsePrice(prod.prodCount*prod.price)[1] }}</span>
                                    </td>
                                    <!-- <td>
                    <div class="state">{{['','待付款','待发货','待收货','待评价','已完成','已取消'][orderInfo.state]}}</div>
                  </td>-->

                                    <td>
                                        <div class="action">
                                            <!-- <a href="javascript:void(0)"
                         @click="payNow(prod.prodId,orderInfo.state)"
                      :class="['action-btn', orderInfo.state>4?'default':'active']">{{['','立即付款','提醒卖家','确认收货','发表评论','再次购买','立即购买'][5]}}</a>-->
                                            <!-- 退款条件：拟退款条件，还有未知判定条件 -->
                                            <a
                                                href="javascript:void(0)"
                                                v-if="orderInfo.canRefund && !prod.refundSn && orderInfo.orderType != 3"
                                                :class="['action-btn']"
                                                @click="toApplyReturn(prod.orderItemId, 2)"
                                                >申请退款</a
                                            >
                                            <a
                                                href="javascript:void(0)"
                                                v-if="prod.refundSn"
                                                :class="['action-btn']"
                                                @click="toViewRefund(prod.refundSn, 2, prod.orderItemId, prod.returnMoneySts)"
                                                >查看退款</a
                                            >
                                            <!-- <a href="javascript:void(0)" v-if="orderInfo.state === 4" :class="['action-btn']">评价</a> -->
                                            <a
                                                href="javascript:void(0)"
                                                v-if="(orderInfo.state > 4 || orderInfo.cancelTime !== null) && orderInfo.state != 7"
                                                @click="orderRoute(prod.prodId)"
                                                :class="['action-btn']"
                                                >再次购买</a
                                            >
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="total-return">
                            <a
                                href="javascript:void(0)"
                                v-if="orderInfo.canRefund && orderInfo.canAllRefund && !orderInfo.orderItemDtos.refundSn && orderInfo.orderType != 3"
                                class="action-btn"
                                @click="toApplyReturn(orderInfo.orderItemDtos.orderItemId, 1)"
                                >整单退款</a
                            >
                            <!-- <a
                href="javascript:void(0)"
                v-if="!orderInfo.canRefund && !orderInfo.canAllRefund && orderInfo.orderItemDtos[0].refundSn && orderInfo.orderItemDtos.length == 1"
                class="action-btn"
                @click="toViewRefund(orderInfo.orderItemDtos[0].refundSn,1,orderInfo.orderItemDtos[0].orderItemId,orderInfo.orderItemDtos[0].returnMoneySts)"
              >查看退款</a>-->
                        </div>
                    </div>
                    <div class="goods-total">
                        <div class="item">
                            <span class="tit">商品总额：</span>
                            <span class="price">￥{{ parsePrice(orderInfo.total)[0] }}.{{ parsePrice(orderInfo.total)[1] }}</span>
                        </div>
                        <div class="item">
                            <span class="tit">商品优惠：</span>
                            <span class="price">-￥{{ parsePrice(orderInfo.reduceAmount)[0] }}.{{ parsePrice(orderInfo.reduceAmount)[1] }}</span>
                        </div>
                        <div class="item">
                            <span class="tit">运 费：</span>
                            <span class="price">￥{{ parsePrice(orderInfo.transfee)[0] }}.{{ parsePrice(orderInfo.transfee)[1] }}</span>
                        </div>
                        <div class="item">
                            <span class="tit">{{ orderInfo.state == 1 ? "应付总额：" : "实付总额：" }}</span>
                            <span class="price big">
                                <span v-if="orderInfo.actualTotal">￥{{ parsePrice(orderInfo.actualTotal)[0] }}.{{ parsePrice(orderInfo.actualTotal)[1] }}</span>
                                <span v-if="orderInfo.actualTotal && orderInfo.orderScore">+</span>
                                <span v-if="orderInfo.orderScore">{{ orderInfo.orderScore }} 积分</span>
                            </span>
                        </div>
                    </div>
                    <!-- 提示弹窗 -->
                    <div class="popup-mask" v-if="showTips"></div>
                    <div class="popup-box" v-if="showTips">
                        <div class="tit">
                            <div class="text">提示</div>
                            <div class="close" @click="showTips = 0"></div>
                        </div>
                        <div class="con">
                            <div class="tip">
                                <div class="tip-icon warning"></div>
                                <div class="tip-info">
                                    <div class="result">确认取消订单吗？</div>
                                    <div class="date">订单取消后将无法恢复，请您谨慎考虑</div>
                                    <div class="btns">
                                        <a href="javascript:void(0);" class="btn-r" @click="cancelOrder">确认</a>
                                        <a href="javascript:void(0);" class="btn-g" @click="showTips = 0">取消</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /商品信息 -->
        </div>
    </div>
</template>

<script>
import { betweenTime, betweenTimestamp, dateToTimestamp } from "@/utils/index"
export default {
    data() {
        return {
            orderNumber: "",
            orderInfo: {},
            corpAddrDto: {},
            showTips: false,
            betweenTime: { day: "", hou: "", min: "", sec: "" }, // 订单支付倒计时
            timer: "", // 定时器
            indexs: 0,
            deliveryList: [], //  包裹集合
            deliveryExpresse: null, //  包裹信息
            offsetCount: 0, //  偏移数

            isLastProd: false, //最后一款商品
            irrevocable: false, //不可撤销
            sum: [] //本单已申请单个退款的商品数组
        }
    },
    created() {
        this.orderNumber = this.$route.query.orderNumber
    },
    mounted() {
        this.getOrderDetail()
        this.getDeliveryDet()
    },
    watch: {
        deliveryExpresse: function(newVal, oldVal) {
            this.$nextTick(() => {
                this.offsetCount = 0 //初始化变量
                if (this.deliveryExpresse) {
                    this.$refs.carouser.style.left = "0px"
                }
            })
        }
    },
    methods: {
        /**
         * 获取支付订单详情
         */
        getOrderDet() {
            this.$http({
                url: this.$http.adornUrl(`/corp/order/getOrderPayInfoByOrderNumber`),
                method: "get",
                params: this.$http.adornParams({
                    orderNumber: this.orderNumber
                })
            }).then(({ data }) => {
                this.payOrderInfo = data
                this.betweenTimestamp = betweenTimestamp(new Date().getTime(), dateToTimestamp(data.endTime))
                if (this.betweenTimestamp > 0) {
                    this.betweenTime = betweenTime(this.betweenTimestamp)
                    this.countdown()
                } else {
                }
            })
        },

        /**
         * 倒计时
         */
        countdown() {
            this.betweenTimestamp = this.betweenTimestamp - 1000
            this.betweenTime = betweenTime(this.betweenTimestamp)
            this.timer = setTimeout(() => {
                this.countdown()
            }, 1000)
        },
        /**
         * 获取订单详情
         */
        getOrderDetail() {
            this.$http({
                url: this.$http.adornUrl(`/corp/order/orderDetail`),
                method: "get",
                params: this.$http.adornParams({
                    orderNumber: this.$route.query.orderNumber
                })
            }).then(({ data }) => {
                if (data.state == 1) {
                    // 订单待支付则获取待支付订单详情
                    this.getOrderDet()
                }
                this.orderInfo = data
                this.corpAddrDto = data.corpAddrDto //地址Dto
            })
        },

        // 获取物流详情
        getDeliveryDet() {
            this.$http({
                url: this.$http.adornUrl("/corp/myDelivery/orderInfo/" + this.orderNumber),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.deliveryList = data //包裹集合信息
                this.deliveryExpresse = data[0] //包裹信息
            })
        },

        // 点击包裹tab事件
        onClickTabDelivery(delivery, index) {
            this.deliveryExpresse = delivery
            this.indexs = index
        },

        // 商品切换
        prevItem() {
            var len = this.deliveryExpresse.orderItems.length
            if (len - 5 > 0) {
                if (this.offsetCount > 0) {
                    this.offsetCount--
                    this.$refs.carouser.style.left = "-" + 70 * this.offsetCount + "px"
                } else {
                    return false
                }
            } else if (len - 5 <= 0) {
                return false
            } else {
                return false
            }
        },

        nextItem() {
            var len = this.deliveryExpresse.orderItems.length
            if (len - 5 > 0) {
                if (this.offsetCount < len - 5) {
                    this.offsetCount++
                    this.$refs.carouser.style.left = "-" + 70 * this.offsetCount + "px"
                } else if (len - 5 <= 0) {
                    return false
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        /**
         * 跳转到个人中心
         */
        userCenter() {
            this.$router.push({ path: "/store/user-center/uc-order" })
        },
        /**
         * 跳转到商品详情页
         */
        toProdDetail(prodId) {
            this.$router.push({ path: "/detail?prodId=" + prodId })
        },
        /**
         * 根据订单状态跳转
         */
        orderRoute(prodId) {
            this.toProdDetail(prodId)
        },

        /**
         * 是否最后一个商品在执行单个商品退款事件
         */
        applyLastProdRefund: function() {
            if (this.orderInfo.state == 2) {
                //待发货状态下
                // 遍历商品list
                if (this.orderInfo.orderItemDtos.length > 1) {
                    //如果商品列表长度大于1
                    let sum = []
                    this.orderInfo.orderItemDtos.forEach((el, index) => {
                        if (el.refundSn) {
                            //如果拥有退款单号
                            sum.push(el)
                            this.sum = sum
                        }
                    })
                    console.log(this.sum)
                    if (this.sum.length == this.orderInfo.orderItemDtos.length - 1) {
                        // 如果拥有退款单号的商品数组长度等于商品列表数据长度-1，那么点击的这件商品就是最后一个订单项
                        this.isLastProd = true
                    }
                }
                console.log("isLastProd：", this.isLastProd)
            }
        },

        /**
         * 申请退款
         */
        toApplyReturn(orderItemId, refundType) {
            //refundType退款单类型（1:整单退款,2:单个物品退
            console.log("订单项id(orderItemId)：", orderItemId)
            console.log("refundType：1.整单退款,2.单个物品退：", refundType)
            if (this.orderInfo.state == 2) {
                //待发货
                if (refundType == 2) {
                    //单个退款
                    this.applyLastProdRefund() //是否最后一个订单项申请退款
                    console.log("是否最后一个订单项申请退款isLastProd：", this.isLastProd)
                    let orderItem = []
                    this.orderInfo.orderItemDtos.forEach((el, index) => {
                        el.isLastProd = this.isLastProd
                        if (el.orderItemId == orderItemId) {
                            //如果当前的订单项id和点击传入的订单项id一致
                            //保存数据
                            orderItem.push(el)
                        }
                    })
                    let refundProdObj = {}
                    if (this.orderInfo.orderItemDtos.length == 1) {
                        refundProdObj.addTransfee = true
                    } else {
                        refundProdObj.addTransfee = false
                    }
                    refundProdObj.orderItem = orderItem
                    localStorage.setItem("refundProdObj", JSON.stringify(refundProdObj)) //将整个订单项保存
                    console.log("(单个)退款商品信息对象：", refundProdObj)
                } else if (refundType == 1) {
                    //整单退款
                    let refundProdObj = {}
                    refundProdObj.orderItem = this.orderInfo.orderItemDtos
                    refundProdObj.actualTotal = this.orderInfo.actualTotal
                    localStorage.setItem("refundProdObj", JSON.stringify(refundProdObj)) //将整个订单所有项保存
                    console.log("(整单)退款商品信息对象：", refundProdObj)
                }
                this.$router.push({
                    path: "/store/user-center/apply-return",
                    query: {
                        orderNumber: this.orderNumber,
                        transfee: this.orderInfo.transfee,
                        state: this.orderInfo.state,
                        // actualTotal: this.orderInfo.actualTotal,
                        refundType: refundType
                    }
                })
            } else if (this.orderInfo.state != 2) {
                if (refundType == 2) {
                    //单个退
                    let orderItem = []
                    this.orderInfo.orderItemDtos.forEach((el, index) => {
                        if (el.orderItemId == orderItemId) {
                            //如果当前的订单项id和点击传入的订单项id一致
                            //保存数据
                            orderItem.push(el)
                        }
                    })
                    let refundProdObj = {}
                    refundProdObj.orderItem = orderItem
                    localStorage.setItem("refundProdObj", JSON.stringify(refundProdObj)) //将整个订单项保存
                    console.log("(单个)退款商品信息对象：", refundProdObj)
                } else if (refundType == 1) {
                    //整单退款
                    let refundProdObj = {}
                    refundProdObj.orderItem = this.orderInfo.orderItemDtos
                    refundProdObj.actualTotal = this.orderInfo.actualTotal
                    localStorage.setItem("refundProdObj", JSON.stringify(refundProdObj)) //将整个订单所有项保存
                    console.log("(整单)退款商品信息对象：", refundProdObj)
                }
                this.$router.push({
                    path: "/store/user-center/apply-return",
                    query: {
                        orderNumber: this.orderNumber,
                        state: this.orderInfo.state,
                        transfee: this.orderInfo.transfee,
                        // actualTotal: this.orderInfo.actualTotal,
                        refundType: refundType
                    }
                })
            }
        },
        /**
         * 查看退款
         */
        toViewRefund(refundSn, refundType, orderItemId, returnMoneySts) {
            let transfee = this.orderInfo.transfee
            // returnMoneySts处理退款状态:(1.买家申请 2.卖家接受 3.买家发货 4.卖家收货 5.退款成功 6.买家撤回申请 7.商家拒绝 -1.退款关闭)
            if (returnMoneySts < 4 && returnMoneySts != -1) {
                if (refundType == 2) {
                    //单个退款
                    this.orderInfo.orderItemDtos.forEach((el, index) => {
                        if (el.orderItemId == orderItemId) {
                            //如果当前的订单项id和点击传入的订单项id一致
                            //保存数据
                            let orderItem = []
                            orderItem.push(el)
                            localStorage.setItem("orderItem", JSON.stringify(orderItem)) //将整个订单项保存
                        }
                    })
                } else if (refundType == 1) {
                    //整单退款
                    localStorage.setItem("orderItem", JSON.stringify(this.orderInfo.orderItemDtos)) //将整个订单所有项保存
                }
                this.toApplyReturn(orderItemId, refundType) //申请售后
                //申请售后（详情）页
                this.$router.push({ path: "/store/user-center/apply-return?refundSn=" + refundSn + "&transfee=" + transfee + "&orderNumber=" + this.orderNumber })
            } else {
                //退款详情页
                this.$router.push({ path: "/store/return-detail?refundSn=" + refundSn + "&transfee=" + transfee })
            }
        },

        /**
         * 立即支付
         */
        toPayment() {
            sessionStorage.setItem("pay_total", this.orderInfo.actualTotal)
            sessionStorage.setItem("pay_orderNumber", this.orderNumber)
            this.$router.push({ path: "/payment" })
        },

        /**
         * 取消订单
         */
        cancelOrder() {
            this.showTips = false
            this.$http({
                url: this.$http.adornUrl("/corp/myOrder/cancel/" + this.orderNumber),
                method: "put",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.$message({
                    type: "success",
                    message: "订单已取消",
                    duration: 1000
                })
                this.$router.push({ path: "/store/user-center/uc-order" })
            })
        },

        /**
         * 价格处理
         */
        parsePrice: value => {
            var val = Number(value)
            if (!val) {
                val = 0
            }
            // 截取小数点后两位，并以小数点为切割点将val转化为数组
            return val.toFixed(2).split(".")
        }
    },

    beforeDestroy() {
        clearTimeout(this.timer)
    }
}
</script>

<style soped src="./css/uc-order-detail.css"></style>
<style scoped src="./css/user-center.css"></style>
<style>
.bg-fix {
    background-color: #f9f9f9 !important;
}
</style>
