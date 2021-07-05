<template>
    <div class="con-box uc-order">
        <!-- 导航 -->
        <div class="uc-nav">
            <div class="nav-box">
                <div :class="['nav-item', state == '0' ? 'active' : '']" @click="state = '0'">
                    <span class="text">全部订单</span>
                    <i class="line"></i>
                </div>
                <div :class="['nav-item', state == '1' ? 'active' : '']" @click="state = '1'">
                    <span class="text">
                        待付款
                        <em class="number">{{ orderCountData.unPay }}</em>
                    </span>
                    <i class="line"></i>
                </div>
                <div :class="['nav-item', state == '2' ? 'active' : '']" @click="state = '2'">
                    <span class="text">
                        待发货
                        <em class="number">{{ orderCountData.payed }}</em>
                    </span>
                    <i class="line"></i>
                </div>
                <div :class="['nav-item', state == '3' ? 'active' : '']" @click="state = '3'">
                    <span class="text">
                        待收货
                        <em class="number">{{ orderCountData.consignment }}</em>
                    </span>
                    <i class="line"></i>
                </div>
                <div :class="['nav-item', state == '4' ? 'active' : '']" @click="state = '4'">
                    <span class="text">
                        已完成
                        <em class="number">{{ orderCountData.success }}</em>
                    </span>
                    <i class="line"></i>
                </div>
            </div>
        </div>
        <!-- /导航 -->
        <!-- 搜索 -->
        <div class="uc-serach">
            <!-- <div class="left">
                <div class="select-item">
                    <span class="tit">{{ ["全部订单", "最近七天", "最近三个月", "三个月之前"][orderTimeStatus] }}</span>
                    <div class="select">
                        <span class="s-item" @click="changeOrderTime(0)">全部订单</span>
                        <span class="s-item" @click="changeOrderTime(1)">最近七天</span>
                        <span class="s-item" @click="changeOrderTime(2)">最近三个月</span>
                        <span class="s-item" @click="changeOrderTime(3)">三个月之前</span>
                    </div>
                </div>

            </div> -->
            <div class="right">
                <!-- <div class="search-value">
                    <div class="ordernum">{{ type == 0 ? "订单编号" : "商品名称" }}</div>
                    <div class="options" v-if="showOptionsBox">
                        <p class="options-item" @click="selectSearchValue(0)" v-if="type == 1">订单编号</p>
                        <p class="options-item" @click="selectSearchValue(1)" v-if="type == 0">商品名称</p>
                    </div>
                </div> -->
                <div class="search-int">
                    <input type="text" class="input" v-model="orderNumber" @keyup.enter="getOrderList" v-if="type == 0" placeholder="请输入订单编号查询" />
                    <input type="text" class="input" v-model="orderName" @keyup.enter="getOrderList" v-if="type == 1" placeholder="请输入商品名称查询" />
                </div>
                <a href="javascript:void(0)" class="search" @click="getOrderList">查询订单</a>
            </div>
        </div>
        <!-- /搜索 -->
        <!-- 订单列表 -->
        <div class="order-list" v-if="orderList.length">
            <div class="order-table">
                <table cellspacing="0" cellpadding="0" class="box">
                    <tbody>
                        <tr class="box-tit">
                            <th>商品</th>
                            <th width="60" class="pl">数量</th>
                            <th width="120" class="pr">单价</th>
                            <th width="130">总额</th>
                            <th width="130">状态</th>
                            <th width="130">操作</th>
                        </tr>
                    </tbody>
                    <tbody v-for="(order, index) in orderList" :key="index">
                        <tr class="box-space">
                            <td colspan="6"></td>
                        </tr>
                        <tr class="box-hd">
                            <td colspan="6">
                                <div class="time">{{ order.createTime }}</div>
                                <div class="order-number">
                                    订单号：
                                    <span class="num">{{ order.orderNumber }}</span>
                                </div>

                                <div class="del" v-if="order.state >= 4 && order.state != 7" @click="showDelPop(order.orderNumber)"></div>
                            </td>
                        </tr>
                        <tr class="box-tr" v-for="(orderItem, index) in order.orderItems" :key="index">
                            <td>
                                <div class="goods-info">
                                    <a @click="toProdDetail(orderItem.prodId)" class="img">
                                        <img :src="orderItem.pic" alt />
                                    </a>
                                    <div class="name-sku">
                                        <a @click="toProdDetail(orderItem.prodId)" class="name">{{ orderItem.prodName }}</a>
                                        <span class="sku">{{ orderItem.skuName }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="pl">
                                <div class="goods-number">×{{ orderItem.prodCount }}</div>
                            </td>
                            <td class="pr">
                                <div class="amount">
                                    <span class="price">￥{{ parsePrice(orderItem.price)[0] }}.{{ parsePrice(orderItem.price)[1] }}</span>
                                    <span class="price" v-if="orderItem.useScore">{{ orderItem.useScore }} 积分</span>
                                </div>
                            </td>
                            <td :rowspan="order.orderItems.length" v-if="index == 0" class="bl">
                                <div class="amount">
                                    <span class="price">￥{{ parsePrice(order.actualTotal)[0] }}.{{ parsePrice(order.actualTotal)[1] }}</span>
                                    <span class="price" v-if="orderItem.useScore">{{ order.useScoreTotal }} 积分</span>
                                    在线支付
                                </div>
                            </td>
                            <td :rowspan="order.orderItems.length" v-if="index == 0" class="bl">
                                <div class="state">
                                    <div :class="['text', order.state > 4 && order.state != 7 ? '' : 'no-finish']">
                                        {{ ["", "待付款", "待发货", "待收货", "已完成", "", "已取消", "拼团中"][order.state] }}
                                    </div>
                                    <a href="javascript:void(0);" @click="toOrderDetail(order.orderNumber)" class="order-detail">订单详情</a>
                                </div>
                            </td>
                            <td :rowspan="order.orderItems.length" v-if="index == 0" class="bl">
                                <div class="action">
                                    <a
                                        href="javascript:void(0);"
                                        v-if="order.state != 2 && order.state != 4 && order.state != 7"
                                        @click="orderOperation($event)"
                                        :data-state="order.state"
                                        :data-ordernumber="order.orderNumber"
                                        :data-total="order.actualTotal"
                                        :data-ordertype="order.orderType"
                                        :class="['action-btn', order.state > 4 ? 'default' : 'active']"
                                        >{{ ["", "立即付款", "提醒卖家", "确认收货", "", "再次购买", "再次购买"][order.state] }}</a
                                    >
                                    <a href="javascript:void(0);" @click="operator(order.state, order.orderNumber)" class="action-a" v-if="order.state > 2 && order.state != 3">{{
                                        ["", "", "", "查看物流", "再次购买", "添加收藏", "添加收藏"][order.state]
                                    }}</a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                            <div class="result" v-if="showTips == 3">确定已收到货吗？</div>
                            <div class="date" v-if="showTips == 3">确认收货后订单状态将发生改变，请您谨慎考虑</div>
                            <div class="result" v-if="showTips == 6">确定删除订单吗？</div>
                            <div class="date" v-if="showTips == 6">订单删除后将无法恢复，请您谨慎考虑</div>
                            <div class="btns">
                                <a href="javascript:void(0);" class="btn-r" @click="confirmReceive" v-if="showTips == 3">确认收货</a>
                                <a href="javascript:void(0);" class="btn-r" @click="delOrder" v-if="showTips == 6">删除</a>
                                <a href="javascript:void(0);" class="btn-g" @click="cancelOpera">取消</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 页码 -->
            <pagination v-model="current" :pages="pages" @changePage="getSearchProdPage"></pagination>
            <!-- /页码 -->
        </div>
        <!-- /订单列表 -->
        <!-- 空列表提示 -->
        <div class="empty" v-if="!orderList.length">
            <div class="img">
                <img src="../../../assets/img/emptyPic/order-empty.png" alt />
            </div>
            <div class="action">
                <div class="text">您还没有订单哦</div>
            </div>
        </div>
        <!-- /空列表提示 -->
    </div>
</template>

<script>
import Pagination from "@/components/pagination"
export default {
    data() {
        return {
            current: 1, // 当前页
            pages: 1, // 总页数
            size: 5,
            orderCountData: {},
            orderList: [],
            state: 0,
            orderNumber: null,
            orderName: null,
            orderTimeStatus: 0, // 订单时间筛选
            orderType: -1, // 订单类型筛选
            showTips: 0,
            delOrderNumber: "", // 要删除的订单号
            type: 0, //查询类型  0订单编号 1商品名称
            showOptionsBox: false //是否显示查询选项
        }
    },
    components: {
        Pagination
    },
    created() {
        this.state = this.$route.query.state || 0
    },
    mounted() {
        // 设置网页标题
        document.title = "我的订单"
        this.getUserInfo() //获取订单数量
        this.getOrderList() //获取订单列表
    },
    methods: {
        /**
         * 跳转到商品详情页
         */
        toProdDetail(prodId) {
            this.$router.push({
                path: "/storeDetail",
                query: {
                    prodId
                }
            })
        },
        /**
         * 获取订单数量
         */
        getUserInfo() {
            this.$http({
                url: this.$http.adornUrl(`/corp/order/orderCount`),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.orderCountData = data
            })
        },
        /**
         * 获取订单列表
         */
        getOrderList() {
            let params = {
                current: this.current,
                size: this.size,
                state: this.state == 0 ? "" : this.state,
                orderNumber: this.orderNumber
            }

            this.$http({
                url: this.$http.adornUrl(`/corp/order/page`),
                method: "get",
                params: this.$http.adornParams(params)
            }).then(({ data }) => {
                this.orderList = data.records
                this.pages = data.pages
            })
        },
        /**
         * 分页
         */
        getSearchProdPage() {
            this.getOrderList()
        },

        /**
         * 显示选项框
         */
        showOptions() {
            this.showOptionsBox = !this.showOptionsBox
        },
        /**
         * 获取查询类型
         */
        selectSearchValue(type) {
            this.type = type
            this.showOptionsBox = false
            ;(this.orderName = ""), (this.orderNumber = "")
        },

        /**
         * 跳转订单详情
         */
        toOrderDetail(orderNumber) {
            this.$router.push({ path: "/store/order-detail", query: { orderNumber: orderNumber } })
        },
        /**
         * 订单操作
         */
        orderOperation(e) {
            // state: 1立即付款 3确认收货  5再次购买 6立即购买
            const { state, ordernumber, total, ordertype } = e.target.dataset

            switch (state) {
                case "1":
                    sessionStorage.setItem("pay_total", total)
                    sessionStorage.setItem("pay_orderNumber", ordernumber)
                    this.$router.push({ path: "/payment" })
                    break
                case "3":
                    this.showTips = 3 // 确认收货提醒
                    this.currentOrderNumber = ordernumber
                    break
                case "4":
                    var prodId = 0
                    this.orderList.forEach(el => {
                        if (el.orderNumber == ordernumber) {
                            prodId = el.orderItems[0].prodId
                        }
                    })
                    this.$router.push({ path: (ordertype == 3 ? "/member-center/integral-det/" : "/detail/") + prodId })
                    break
                case "6":
                    var prodId = 0
                    this.orderList.forEach(el => {
                        if (el.orderNumber == ordernumber) {
                            prodId = el.orderItems[0].prodId
                        }
                    })
                    this.$router.push({ path: (ordertype == 3 ? "/member-center/integral-det/" : "/detail/") + prodId })
                    break
                default:
                    break
            }
        },
        /**
         * 申请售后
         */
        toApplyReturn(e) {
            const orderNumber = e.target.dataset.ordernumber //订单号
            this.orderList.forEach((el, index) => {
                if (el.orderNumber == orderNumber) {
                    //保存数据
                    localStorage.setItem("orderItem", JSON.stringify(el))
                    localStorage.setItem("orderItems", JSON.stringify(el.orderItems))
                }
            })
            this.$router.push({ path: "apply-return", query: { orderNumber: orderNumber } })
        },

        /**
         * 订单确认收货
         */
        confirmReceive() {
            this.showTips = 0

            this.$http({
                url: this.$http.adornUrl("/corp/order/receipt/" + this.currentOrderNumber),
                method: "put",
                data: this.$http.adornData()
            }).then(({ data }) => {
                this.$message({
                    message: "确认收货成功!",
                    type: "success",
                    duration: 1000
                })
                this.getOrderList()
                this.getUserInfo()
            })
        },

        /**
         * 操作
         */
        operator(state, orderNumber) {
            // 3'查看物流' 4'再次购买' 5 6'添加收藏'
            // if (state == 3) {
            //   this.$router.push({ path: '/order-detail', query: { orderNumber: orderNumber } })
            // } else
            if (state == 4) {
                var prodId = 0
                this.orderList.forEach(el => {
                    if (el.orderNumber == orderNumber) {
                        prodId = el.orderItems[0].prodId
                    }
                })
                // this.$router.push({ path: (ordertype == 3 ? "/member-center/integral-det/" : "/detail/") + prodId })
            } else if (state == 5 || state == 6) {
                var prodIds = []
                this.orderList.forEach(el => {
                    if (el.orderNumber == orderNumber) {
                        el.orderItems.forEach(prodItem => {
                            prodIds.push(prodItem.prodId)
                        })
                    }
                })
                this.addFavProd(prodIds)
            }
        },

        /**
         * 取消操作
         */
        cancelOpera() {
            this.getOrderList()
            this.showTips = 0
        },

        /**
         * 添加收藏
         */
        addFavProd(prodIds) {
            // var prodIdStr = prodIds.toString()
            // this.$axios.post("/corp/user/collection/orderProdCollectionAll", prodIdStr).then(({ data }) => {
            //     this.$message({
            //         message: "商品收藏成功",
            //         type: "success",
            //         duration: 1000
            //     })
            // })
        },
        /**
         * 删除确认弹窗
         */
        showDelPop(orderNumber) {
            this.showTips = 6
            this.delOrderNumber = orderNumber
        },

        /**
         * 删除订单
         */
        delOrder() {
            this.$http({
                url: this.$http.adornUrl("/corp/order/" + this.delOrderNumber),
                method: "delete",
                data: this.$http.adornData()
            }).then(({ data }) => {
                this.showTips = 0
                this.$message({
                    type: "success",
                    duration: 1000,
                    message: data
                })
                this.getOrderList()
                this.getUserInfo()
            })
        },

        /**
         * 切换订单时间
         */
        changeOrderTime(orderTimeStatus) {
            this.orderName = ""
            this.orderNumber = ""
            this.orderTimeStatus = orderTimeStatus
            this.getOrderList()
            this.$forceUpdate()
        },

        /**
         * 切换订单类型
         */
        changeOrderType(orderType) {
            this.orderName = ""
            this.orderNumber = ""
            this.orderType = orderType
            this.getOrderList()
        },

        /**
         * 价格处理
         */
        parsePrice(value) {
            var val = Number(value)
            if (!val) {
                val = 0
            }
            // 截取小数点后两位，并以小数点为切割点将val转化为数组
            return val.toFixed(2).split(".")
        }
    },

    watch: {
        state() {
            this.current = 1
            this.orderName = ""
            this.orderNumber = ""
            this.getOrderList()
        },
        orderType() {
            this.orderName = ""
            this.orderNumber = ""
        }
    }
}
</script>

<style scoped src="../css/uc-order.css"></style>
<style scoped src="../css/user-center.css"></style>
<style scoped>
.empty {
    width: 1080px;
    margin: 80px auto;
    text-align: center;
    font-size: 14px;
}
</style>
