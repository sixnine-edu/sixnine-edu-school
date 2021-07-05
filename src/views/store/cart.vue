<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-20 15:30:07
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-15 14:38:39
-->
<template>
    <div class="cart">
        <div class="app-content">
            <div class="step-box">
                <div class="left">
                    <span class="img"></span>
                    <span class="text">购物车</span>
                </div>
                <div class="steps">
                    <div class="item active">
                        <div class="number">step 01.</div>
                        <div class="text">选择购买商品</div>
                    </div>
                    <div class="item">
                        <div class="number">step 02.</div>
                        <div class="text">确认订单信息</div>
                    </div>
                    <div class="item">
                        <div class="number">step 03.</div>
                        <div class="text">支付完成订单</div>
                    </div>
                </div>
            </div>
            <div class="cart-tab">
                <div class="tab-check">
                    <input type="checkbox" class="checkbox default" :class="{ checked: allChecked, default: !allChecked }" @click="checkAll()" />
                    <span class="text">全选</span>
                </div>
                <div class="tab-img">&nbsp;</div>
                <div class="tab-name">商品</div>
                <div class="tab-price">单价</div>
                <div class="tab-number">数量</div>
                <div class="tab-total">小计</div>
                <div class="tab-action">操作</div>
            </div>
            <div class="empty" v-if="!shopCatList.length">
                <div class="img">
                    <img src="../../assets/img/emptyPic/cart-empty.png" alt />
                </div>
                <div class="action">
                    <div class="text">您的购物车空空如也</div>
                    <!-- <nuxt-link :to="'/'" class="btn">去购物</nuxt-link> -->
                </div>
            </div>
            <div v-for="(shopCat, index) in shopCatList" :key="index">
                <div class="cart-con">
                    <div class="activity-list">
                        <div class="cart-con">
                            <div class="activity-goods">
                                <div
                                    :class="[item.checked ? 'active item' : 'item', item.discountId > 0 ? 'activity-goods-checked' : '']"
                                    v-for="(item, itemIndex) in shopCat.shopCartItems"
                                    :key="itemIndex"
                                >
                                    <div class="tab-check">
                                        <input
                                            type="checkbox"
                                            class="checkbox"
                                            checkbox
                                            :class="{ checked: item.checked, default: !item.checked }"
                                            @click="checkOne(index, itemIndex)"
                                        />
                                    </div>
                                    <div class="tab-img">
                                        <a @click="toProdDetail(item.prodId)" class="img-box">
                                            <img :src="item.pic" alt />
                                        </a>
                                    </div>
                                    <div class="tab-name">
                                        <a @click="toProdDetail(item.prodId)" class="name">{{ item.prodName }}</a>
                                        <span class="sku">{{ item.skuName }}</span>
                                    </div>
                                    <div class="tab-price">
                                        <div class="unit-price">￥{{ parsePrice(item.price)[0] }}.{{ parsePrice(item.price)[1] }}</div>
                                        <div class="promotion-box"></div>
                                    </div>
                                    <div class="tab-number">
                                        <div class="goods-number">
                                            <span class="reduce" :class="{ limit: item.prodCount === 1 }" @click="subCount(index, itemIndex)">-</span>
                                            <input type="text" class="number" v-model="item.prodCount" readonly="true" />
                                            <span class="increase" @click="addCount(index, itemIndex)">+</span>
                                        </div>
                                    </div>
                                    <div class="tab-total">￥{{ parsePrice(item.prodCount * item.price)[0] }}.{{ parsePrice(item.prodCount * item.price)[1] }}</div>
                                    <div class="tab-action">
                                        <a href="JavaScript:;" class="action-a del" @click="openPopup(item.basketId)">删除</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cart-bottom" v-if="shopCatList.length">
                <div class="total-box">
                    <div class="check-all">
                        <input type="checkbox" class="checkbox" :class="{ checked: allChecked, default: !allChecked }" @click="checkAll()" />
                        <span class="text" @click="checkAll()">全选</span>
                    </div>
                    <a href="JavaScript:;" class="del-selected" @click="openPopup()">删除选中商品</a>
                </div>
                <div class="settlement-box">
                    <div class="amount">
                        已选
                        <span class="number">{{ this.count }}</span
                        >件商品
                    </div>
                    <div class="price-box">
                        <div class="total-price">
                            总价：
                            <span class="text">¥{{ parsePrice(this.finalMoney)[0] }}.{{ parsePrice(this.finalMoney)[1] }}</span>
                        </div>
                        <div class="discount-price">
                            优惠：
                            <span class="text">-¥{{ parsePrice(this.subtractMoney)[0] }}.{{ parsePrice(this.subtractMoney)[1] }}</span>
                        </div>
                    </div>
                    <a href="JavaScript:;" class="btn" @click="submit()">去结算</a>
                </div>
            </div>

            <div class="popup-mask" v-if="isPopup"></div>
            <!-- 删除提示弹窗 -->
            <div class="popup-box" v-if="isPopup">
                <div class="tit">
                    <div class="text">提示</div>
                    <div class="close" @click="closePopup()"></div>
                </div>
                <div class="con">
                    <div class="tip">
                        <div class="tip-icon warning"></div>
                        <div class="tip-info">
                            <div class="result">确定要删除该商品吗？</div>
                            <div class="date">删除的商品将移出购物车，请您谨慎考虑</div>
                            <div class="btns">
                                <a href="JavaScript:;" class="btn-r" @click="remove()">删除</a>
                                <a href="JavaScript:;" class="btn-g" @click="closePopup()">取消</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { _debounce } from "@/utils/index" //防抖
export default {
    data() {
        return {
            shopCatList: [],
            allChecked: true,
            count: 0,
            finalMoney: 0,
            subtractMoney: 0,
            totalMoney: 0,
            isPopup: false,
            basketId: null,

            showDiscountsList: false, // 促销活动显隐
            currentBasketId: "",
            discountData: {},
            reqData: []
        }
    },

    mounted() {
        // 设置网页标题
        this.loadBasketData(null)
    },
    methods: {
        /**
         * 跳转到商品详情页
         */
        toProdDetail(prodId) {
            this.$router.push({
                path: "/store/detail",
                query: {
                    prodId
                }
            })
        },
        loadBasketData(discountData) {
            let reqData = []
            let shopCartIds = []
            if (discountData) {
                reqData.push(discountData)
                this.shopCatList.forEach(shopCart => {
                    shopCart.shopCartItems.forEach(pItem => {
                        if (pItem.checked) {
                            shopCartIds.push(pItem.basketId)
                        }
                    })
                })
            }

            this.$http({
                url: this.$http.adornUrl("/corp/shopcart/info"),
                method: "post",
                data: this.$http.adornData({
                    reqData
                })
            }).then(({ data }) => {
                let shopCatList = data
                if (data.length > 0) {
                    if (shopCartIds.length == 0) {
                        // 初始加载
                        this.shopCatList = shopCatList
                    } else {
                        // 修改购物车
                        let checkedLog = []
                        this.shopCatList.forEach(shopCart => {
                            shopCart.shopCartItems.forEach(shopCartItem => {
                                if (shopCartItem.checked) {
                                    checkedLog.push(shopCartItem.basketId)
                                }
                            })
                        })

                        data.forEach(newShopCart => {
                            newShopCart.shopCartItems.forEach(shopCartItem => {
                                if (checkedLog.includes(shopCartItem.basketId)) {
                                    shopCartItem.checked = true
                                }
                            })
                        })
                        this.shopCatList = data
                    }
                } else {
                    this.shopCatList = []
                }
                this.checkAllSelected()
                this.calTotalPrice() //计算总价
            })
        },

        /**
         * 计算购物车总额
         */
        calTotalPrice() {
            let shopCatList = this.shopCatList
            let shopCartIds = []
            shopCatList.forEach(shopCart => {
                let cItems = shopCart.shopCartItems
                for (let j = 0; j < cItems.length; j++) {
                    if (cItems[j].checked) {
                        shopCartIds.push(cItems[j].basketId)
                    }
                }
            })
            this.$http({
                url: this.$http.adornUrl("/corp/shopcart/totalPay"),
                method: "post",
                data: this.$http.adornData(shopCartIds,false)
            }).then(({ data }) => {
                this.count = data.count
                ;(this.finalMoney = data.finalMoney), (this.totalMoney = data.totalMoney), (this.subtractMoney = data.subtractMoney)
            })
        },

        //打开弹窗
        openPopup(basketId) {
            this.isPopup = true
            this.basketId = basketId
        },
        //关闭弹窗
        closePopup() {
            this.isPopup = false
            this.basketId = null
        },
        //删除购物车商品
        remove() {
            let shopCartIds = []
            if (!this.basketId) {
                this.shopCatList.forEach(shop => {
                    shop.shopCartItems.forEach(shopCat => {
                        if (shopCat.checked) {
                            shopCartIds.push(shopCat.basketId)
                        }
                    })
                })
            } else {
                shopCartIds.push(this.basketId)
            }
            if (!shopCartIds.length) {
                this.$message({
                    type: "warning",
                    message: "请勾选要删除的商品~"
                })
                this.isPopup = false
                return
            }

            this.$http({
                url: this.$http.adornUrl(`/corp/shopcart/deleteItem`),
                method: "delete",
                data: this.$http.adornData(shopCartIds, false)
            }).then(({ data }) => {
                this.loadBasketData(null)
                this.getCartCount()
            })
            this.isPopup = false
        },

        /**
         * 每一项的选择事件
         */
        checkOne(index, itemIndex) {
            let shopCatList = this.shopCatList
            let shopCartItems = shopCatList[index].shopCartItems // 获取购物车列表
            if (shopCartItems[itemIndex].checked === undefined) {
                this.$set(shopCartItems[itemIndex], "checked", false)
            }

            let checked = shopCartItems[itemIndex].checked // 获取当前商品的选中状态

            shopCartItems[itemIndex].checked = !checked // 改变状态

            this.calTotalPrice() // 计算总价
            this.checkAllSelected() //检查全选状态
        },

        /**
         * 全选事件
         */
        checkAll() {
            this.selectAll(this.shopCatList, !this.allChecked)
        },
        /**
         * 全选
         */
        selectAll() {
            let allChecked = this.allChecked
            allChecked = !allChecked //改变状态
            let shopCatList = this.shopCatList
            shopCatList.forEach(shopCart => {
                shopCart.checked = allChecked
                let cItems = shopCart.shopCartItems
                for (let j = 0; j < cItems.length; j++) {
                    cItems[j].checked = allChecked
                }
            })
            this.allChecked = allChecked
            this.shopCatList = shopCatList
            this.calTotalPrice() //计算总价
        },

        /**
         * 检查全选状态
         */
        checkAllSelected() {
            let allChecked = true
            let shopCatList = this.shopCatList
            let flag = false
            shopCatList.forEach(shopCart => {
                let shopChecked = true
                let cItems = shopCart.shopCartItems
                for (let j = 0; j < cItems.length; j++) {
                    if (!cItems[j].checked) {
                        shopChecked = false
                        allChecked = false
                        flag = true
                        break
                    }
                }
                shopCart.checked = shopChecked
            })
            this.allChecked = allChecked
            this.shopCatList = shopCatList
        },

        /**
         * 减少数量
         */
        subCount(index, itemIndex) {
            let shopCatList = this.shopCatList
            let prodCount = shopCatList[index].shopCartItems[itemIndex].prodCount
            if (prodCount > 1) {
                this.$nextTick(() => {
                    this.updateCount(shopCatList, index, itemIndex, -1)
                })
            }
        },

        /**
         * 增加数量
         */
        addCount(index, itemIndex) {
            let shopCatList = this.shopCatList
            let prodCount = shopCatList[index].shopCartItems[itemIndex].prodCount
            this.updateCount(shopCatList, index, itemIndex, 1)
        },

        /**
         * 改变购物车数量接口
         */
        updateCount: _debounce(function(shopCatList, index, itemIndex, changeProdCount) {
            let shopCartItems = shopCatList[index].shopCartItems[itemIndex]
            let prodCount = shopCartItems.prodCount
            if (changeProdCount == -1 && prodCount == 1) {
                return
            }
            let sendData = {
                count: changeProdCount,
                prodId: shopCartItems.prodId,
                skuId: shopCartItems.skuId
            }
            this.$http({
                url: this.$http.adornUrl(`/corp/shopcart/changeItem`),
                method: "post",
                data: this.$http.adornData(sendData)
            }).then(({ data }) => {
                shopCartItems.prodCount += changeProdCount
                this.shopCatList = shopCatList
                let discountData = {
                    basketId: shopCartItems.basketId,
                    discountId: shopCartItems.discountId
                }
                this.loadBasketData(discountData)
                this.getCartCount()
            })
        }, 420),

        /**
         * 去结算
         */
        submit() {
            let shopCartIds = []
            this.shopCatList.forEach(shop => {
                shop.shopCartItems.forEach(shopCat => {
                    if (shopCat.checked) {
                        shopCartIds.push(shopCat.basketId)
                    }
                })
            })
            if (shopCartIds.length < 1) {
                this.$message({
                    message: "请选择最少一件商品",
                    type: "error",
                    duration: 1000
                })
                return
            }
            let basketIds = JSON.stringify(shopCartIds)
            sessionStorage.setItem("basketIds", basketIds)
            this.$router.push({ path: "/store/submit-order?orderEntry=0" })
        },
        /**
         * 价格处理
         */
        parsePrice: value => {
            let val = Number(value)
            if (!val) {
                val = 0
            }
            // 截取小数点后两位，并以小数点为切割点将val转化为数组
            return val.toFixed(2).split(".")
        },

        /**
         * 修改促销活动
         */
        onChooseDiscount(discountId, basketId) {
            let obj = {
                basketId: basketId,
                discountId: discountId
            }
            this.discountData = obj
        },
        /**
         * 提交促销活动修改
         */
        submitDiscount() {
            let reqData = this.discountData
            this.loadBasketData(reqData)
            this.showDiscountsList = false
        },
        /**
         * 促销按钮
         */
        onShowDisList(val) {
            this.showDiscountsList = true
            this.currentBasketId = val
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
        }
    }
}
</script>
<style scoped src="./css/cart.css"></style>
