<template>
    <div class="submit-order">
        <div class="app-content">
            <div class="step-box">
                <div class="left">
                    <span class="img"></span>
                    <span class="text">提交订单</span>
                </div>
                <div class="steps">
                    <div class="item">
                        <div class="number">step 01.</div>
                        <div class="text">选择购买商品</div>
                    </div>
                    <div class="item active">
                        <div class="number">step 02.</div>
                        <div class="text">确认订单信息</div>
                    </div>
                    <div class="item">
                        <div class="number">step 03.</div>
                        <div class="text">支付完成订单</div>
                    </div>
                </div>
            </div>
            <div class="submit-con">
                <!-- 收货地址 -->
                <div class="submit-box">
                    <div class="tit">
                        <span class="text">收货地址</span>
                        <!-- <span class="action">显示全部地址</span> -->
                    </div>
                    <div class="con address-box">
                        <div
                            :class="['item', address.commonAddr ? 'default-address' : '', selectedAddrId == address.addrId ? 'active' : '']"
                            v-for="address in addressList"
                            :key="address.addrId"
                            @click="changeAddress(address.addrId)"
                        >
                            <div class="name-phone">
                                <span class="name">{{ address.receiver }}</span>
                                <span class="phone">{{ address.mobile }}</span>
                                <span class="set-default" v-if="!address.commonAddr" @click="setDefaultAddr(address.addrId)">设为默认</span>
                                <span class="default-tag" v-if="address.commonAddr">默认</span>
                            </div>
                            <div class="address-detail">
                                {{ address.province + address.city + address.area + address.addr }}
                            </div>
                            <div class="del-edit">
                                <span class="edit" @click.stop="editAddr(address.addrId)"></span>
                                <span class="del" @click.stop="toggleDelAddr(true, address.addrId)"></span>
                            </div>
                        </div>
                        <div class="item add-address" @click="toggleAddrPop(true)">
                            <div class="add-box">
                                <div class="img">+</div>
                                <div class="text">添加地址</div>
                            </div>
                        </div>
                    </div>
                    <div class="popup-mask" v-if="showDelAddr"></div>
                    <div class="fix-transform-blur">
                        <div class="popup-box" v-if="showDelAddr">
                            <div class="tit" style="padding:10px;">
                                <div class="text">提示</div>
                                <div class="close" @click="toggleDelAddr(false)"></div>
                            </div>
                            <div class="con">
                                <div class="tip">
                                    <div class="tip-icon warning"></div>
                                    <div class="tip-info">
                                        <div class="result">确定要删除该地址吗？</div>
                                        <div class="date">删除后的地址将不可恢复，请您谨慎考虑</div>
                                        <div class="btns">
                                            <a href="javascrip:void(0);" @click="delAddr()" class="btn-r">删除</a>
                                            <a href="javascrip:void(0);" @click="toggleDelAddr(flase)" class="btn-g">取消</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 收货地址 -->
                <!-- 支付方式 -->
                <!-- <div class="submit-box">
                    <div class="tit">
                        <span class="text">支付方式</span>
                    </div>
                    <div class="con pay-way">
                        <div class="item active">余额抵扣</div> 
                        <!-- <div class="item">货到付款</div>
            <div class="item">线下支付</div>
                    </div>
                </div>-->
                <!-- 支付方式 v-if="orderInfo.maxUsableScore > 0" -->
                <div class="submit-box integral-box">
                    <div class="tit">
                        <span class="text">余额抵扣</span>
                    </div>
                    <!-- 余额抵现 -->
                    <!-- <div class="integral-item">
                        <label class="text"> <el-checkbox v-model="checked" :disabled="isProhibit" class="item-group" @change="useMemberPoints"></el-checkbox>使用余额抵扣 </label>
                        <div class="con"></div>
                    </div> -->
                    <!-- 余额抵现 v-if="isScorePay == 1" -->
                    <div class="integral-item integral-text">
                        <span class="font-bold">
                            账户余额
                            <span class="integral-money"> ￥{{ parsePrice(orderInfo.balance)[0] }}.{{ parsePrice(orderInfo.balance)[1] }} </span>
                        </span>
                        <span class="text-item font-gray"> 抵扣金额 ￥{{ parsePrice(orderInfo.actualTotal)[0] }}.{{ parsePrice(orderInfo.actualTotal)[1] }} </span>
                    </div>
                </div>
                <!-- 余额抵扣 -->
                <!-- 配送方式 -->
                <div class="submit-box">
                    <div class="tit">
                        <span class="text">配送方式</span>
                    </div>
                    <div class="con delivery-way">
                        <div class="item active">快递配送</div>
                    </div>
                </div>
                <!-- /配送方式 -->
                <!-- 商品信息 -->
                <div class="submit-box goods-info">
                    <div class="tit">
                        <span class="text">商品信息</span>
                    </div>
                    <div class="goods-msg">
                        <div class="msg-tab">
                            <div class="img">&nbsp;</div>
                            <div class="info">商品</div>
                            <div class="unit-price">单价</div>
                            <div class="number">数量</div>
                            <div class="total">小计</div>
                        </div>
                        <div class="msg-con" v-for="(shopCart, index) in shopCartOrders" :key="index">
                            <!-- 店铺中的商品 -->
                            <div class="goods-box" v-for="(prod, prodIndex) in shopCart.shopCartItems" :key="prodIndex">
                                <div class="img">
                                    <a @click="toProdDetail(prod.prodId)" class="img-box">
                                        <img :src="prod.pic" alt />
                                    </a>
                                </div>
                                <div class="info">
                                    <a @click="toProdDetail(prod.prodId)" class="name">
                                        {{ prod.prodName }}
                                    </a>
                                    <span class="sku">{{ prod.skuName }}</span>
                                </div>
                                <div class="unit-price">￥{{ parsePrice(prod.price)[0] }}.{{ parsePrice(prod.price)[1] }}</div>
                                <div class="number">×{{ prod.prodCount }}</div>
                                <div class="total">￥{{ parsePrice(prod.price * prod.prodCount)[0] }}.{{ parsePrice(prod.price * prod.prodCount)[1] }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 商品信息 -->
            </div>
            <div class="submit-bottom">
                <div class="statistic-box">
                    <div class="item">
                        <div class="tit">
                            <span class="number">{{ orderInfo.totalCount }}</span
                            >件商品，共计：
                        </div>
                        <div class="con">￥{{ parsePrice(orderInfo.total)[0] }}.{{ parsePrice(orderInfo.total)[1] }}</div>
                    </div>
                    <div class="item">
                        <div class="tit">应付运费：</div>
                        <div class="con">+￥{{ parsePrice(orderInfo.totalTransfee)[0] }}.{{ parsePrice(orderInfo.totalTransfee)[1] }}</div>
                    </div>
                    <div class="item">
                        <div class="tit">优惠总额：</div>
                        <div class="con">-￥{{ parsePrice(orderInfo.orderReduce)[0] }}.{{ parsePrice(orderInfo.orderReduce)[1] }}</div>
                    </div>
                </div>

                <div class="detail-box">
                    <div class="item">
                        <div class="tit">应付总额：</div>
                        <div class="con">￥{{ parsePrice(orderInfo.actualTotal)[0] }}.{{ parsePrice(orderInfo.actualTotal)[1] }}</div>
                    </div>
                    <div class="item" v-if="currentAddr.addrId">
                        <span class="text"> 寄送至：{{ currentAddr.province + " " + currentAddr.city + " " + currentAddr.area + " " + currentAddr.addr }} </span>
                        <span class="text">收货人：{{ currentAddr.receiver }} {{ currentAddr.mobile }}</span>
                    </div>
                </div>
                <div class="btn-box">
                    <a href="javascript:void(0)" class="btn" @click="submitOrder">提交订单</a>
                </div>
            </div>
        </div>
        <!-- 地址弹窗 -->
        <AddressPop :editAddrId="editAddrId" v-if="showAddrPop" @getAddrList="getAddrList" @toggleAddrPop="toggleAddrPop" />
        <!-- /地址弹窗 -->
    </div>
</template>

<script>
import AddressPop from "@/components/add-or-edit-address"

export default {
    components: {
        AddressPop
    },
    data() {
        return {
            addressList: [],
            selectedAddrId: 0,
            orderInfo: {},
            shopCartOrders: [],
            currentAddr: {}, // 当前选择的地址
            couponIds: [],
            userChangeCoupon: 0, // 用户有没有对优惠券进行改变
            coupons: {
                totalLength: 0,
                canUseCoupons: [],
                unCanUseCoupons: []
            },
            totalScoreAmount: 0, // 余额抵扣金额
            totalUsableScore: 0, // 整个订单可以使用的余额数
            isScorePay: 0, // 用户是否选择余额抵现(0不使用 1使用 默认不使用)
            isChecked: true, // 是否选择会员余额抵现
            isProhibit: false, // （余额抵现）checkbox是否禁止
            showAddrPop: false, // 地址弹窗显隐

            // 地址数据
            editAddrId: 0, // 要修改的地址id
            showDelAddr: false,

            // 券
            showCanUse: true,
            orderEntry: 0, //订单入口 0购物车 1立即购买
            platformCoupons: {
                canUseCoupons: [],
                unCanUseCoupons: []
            },
            uuid: "",
            checked: false, //余额抵现选框
            isProhibit: false, //余额抵现是否禁用
            userUseScore: "", // 使用多少余额抵扣
            accountCanUseScore: 0, // 账号可用余额
            maxUsableScore: 0,
            shopUseScore: "" // 余额抵扣比例
        }
    },
    mounted() {
        if (this.$route.query.orderEntry) {
            this.orderEntry = this.$route.query.orderEntry
        }
        this.uuid = this.genUUID()
        this.getAddrList()
        this.loadOrderInfo(true)
    },
    watch: {
        maxUsableScore(nv) {
            if (this.userUseScore > nv) {
                this.userUseScore = nv
            }
        }
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
         * 余额输入
         */
        inputComplete() {
            if (this.shopUseScore > 100) {
                this.userUseScore = this.userUseScore - (this.userUseScore % 10)
            }
            if (this.userUseScore > this.maxUsableScore) {
                this.userUseScore = this.maxUsableScore
            }
            this.loadOrderInfo()
        },

        /**
         * 获取地址列表
         */
        getAddrList() {
            this.$http({
                url: this.$http.adornUrl("/corp/addr/list"),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.addressList = data
            })
        },

        /**
         * 选择地址
         */
        changeAddress(addrId) {
            this.addressList.forEach(element => {
                if (element.addrId == addrId) {
                    this.currentAddr = element
                }
            })
            this.selectedAddrId = addrId
            this.loadOrderInfo()
        },

        /**
         * 设置为默认地址
         */
        setDefaultAddr(addrId) {
            this.$http({
                url: this.$http.adornUrl("/corp/address/defaultAddr/" + addrId),
                method: "put",
                data: this.$http.adornData()
            }).then(({ data }) => {
                this.$message({
                    message: data,
                    type: "success",
                    duration: 1000
                })
                this.getAddrList()
            })
        },
        /**
         * 显示/隐藏确认删除弹窗
         */
        toggleDelAddr(sts, addrId) {
            this.showDelAddr = sts
            this.editAddrId = addrId
        },
        /**
         * 显示/隐藏地址弹窗
         */
        toggleAddrPop(sts) {
            this.showAddrPop = sts
            this.editAddrId = 0
        },

        /**
         * 修改地址 (弹窗传地址id)
         */
        editAddr(addrId) {
            this.showAddrPop = true
            this.editAddrId = addrId
        },
        /**
         * 删除地址
         */
        delAddr() {
            this.$http({
                url: this.$http.adornUrl("/corp/address/deleteAddr/" + this.editAddrId),
                method: "delete",
                data: this.$http.adornData()
            }).then(({ data }) => {
                this.$message({
                    message: data,
                    type: "success",
                    duration: 1000
                })
                this.toggleDelAddr(false)
                this.getAddrList()
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
        },

        /**
         * 加载订单数据
         */
        loadOrderInfo(isFirst) {
            // const loading = this.$loading({
            //   lock: true,
            //   text: '加载中...',
            //   background: 'rgba(255, 255, 255, 0.8)
            // });
            var orderParam = {
                addrId: this.selectedAddrId,
                orderItem: this.orderEntry == 1 ? JSON.parse(sessionStorage.getItem("orderItem")) : undefined,
                basketIds: this.orderEntry == 0 ? JSON.parse(sessionStorage.getItem("basketIds")) : undefined,
                userChangeCoupon: this.userChangeCoupon,
                userUseScore: Number(this.userUseScore),
                uuid: this.uuid
            }

            this.$http({
                url: this.$http.adornUrl("/corp/order/confirm"),
                method: "post",
                data: this.$http.adornData(orderParam)
            })
                .then(({ data }) => {
                    var remarksList = []
                    if (!isFirst) {
                        this.shopCartOrders.forEach(el => {
                            remarksList.push(el.remarks)
                        })
                    }
                    var couponIds = []
                    this.orderInfo = data
                    this.maxUsableScore = data.maxUsableScore // 订单最大可用余额数量
                    var shopCartOrders = data.shopCartOrders
                    shopCartOrders.forEach((shopCart, index) => {
                        if (isFirst) {
                            shopCart.remarks = ""
                        } else {
                            shopCart[index].remarks = remarksList[index]
                        }
                    })

                    this.shopCartOrders = shopCartOrders
                    if (data.corpAddr) {
                        this.currentAddr = data.corpAddr
                        this.selectedAddrId = data.corpAddr.addrId
                    }
                })
                .catch(() => {
                    // loading.close();
                })
        },

        /**
         * 提交订单
         */
        submitOrder() {
            var shopCartOrders = this.shopCartOrders
            var orderShopParam = []
            shopCartOrders.forEach(shopCart => {
                orderShopParam.push({
                    remarks: shopCart.remarks,
                    shopId: shopCart.shopId
                })
            })
            if (!this.addressList.length) {
                this.$message({
                    message: "请先添加地址",
                    type: "success",
                    duration: 1000
                })
                this.showAddrPop = true
                return
            }
            if (this.selectedAddrId == 0) {
                this.$message({
                    message: "请先选择地址",
                    type: "error",
                    duration: 1000
                })
                document.body.scrollTop = document.documentElement.scrollTop = 0
                return
            }
            if (this.orderInfo.balance < this.orderInfo.actualTotal) {
                this.$message({
                    message: "余额不足",
                    type: "error",
                    duration: 1000
                })
                return
            }
            this.$http({
                url: this.$http.adornUrl("/corp/order/submit"),
                method: "post",
                data: this.$http.adornData({
                    orderShopParam,
                    uuid: this.uuid
                })
            }).then(({ data }) => {
                // sessionStorage.setItem("pay_total", this.orderInfo.actualTotal)
                // sessionStorage.setItem("pay_orderNumber", data.orderNumbers)
                // this.$router.push({
                //     path: "/payment"
                // })
                this.$http({
                    url: this.$http.adornUrl("/corp/order/pay"),
                    method: "post",
                    data: this.$http.adornData({
                        payType: 0,
                        orderNumbers: data.orderNumbers
                    })
                }).then(({ data }) => {
                    this.$message({
                        message: "提交成功",
                        type: "success",
                        duration: 1000,
                        onClose: () => {
                            this.$router.push({ path: "/store/user-center/uc-order" })
                        }
                    })
                })

                this.getCartCount()
            })
        },
        /**
         * 获取购物车商品总数
         */
        getCartCount() {
            this.$http({
                url: this.$http.adornUrl(`/corp/shopcart/prodCount`),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.$store.commit("cartNumber/changeCartNumber", data)
            })
        },

        /**
         * 生成uuid
         */
        genUUID() {
            var s = []
            var hexDigits = "0123456789abcdef"
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
            }
            s[14] = "4" // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-"

            var uuid = s.join("")
            return uuid
        }
    }
}
</script>

<style scoped src="./css/submit-order.css"></style>
<style scoped>
.fix-transform-blur {
    z-index: 10000;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
}

.submit-order .statistic-box .item .tit {
    display: flex;
    justify-content: flex-end;
}

.submit-order .statistic-box .item .tit .text {
    margin-left: 5px;
}
</style>
