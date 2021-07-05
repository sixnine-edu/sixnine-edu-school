<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-20 23:40:56
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-21 00:20:53
-->
<template>
    <div class="user-center" style="min-height:505px;">
        <div class="app-content flex-box">
            <!-- 侧栏 -->
            <div class="side-nav">
                <div class="item">
                    <div class="tit">订单管理</div>
                    <a href="javascript:void(0)" @click="switchPage('order')" :class="['item-a', currentPage == 'order' ? 'active' : '']">我的订单</a>
                    <a href="javascript:void(0)" @click="switchPage('collection')" :class="['item-a', currentPage == 'collection' ? 'active' : '']">我的收藏</a>
                    <!-- <a href="javascript:void(0)" @click="switchPage('comments')" :class="['item-a', currentPage == 'comments' ? 'active' : '']">评价晒单</a> -->
                </div>
                <!-- <div class="item">
                    <div class="tit">客户服务</div>
                    <a href="javascript:void(0)" @click="switchPage('return')" :class="['item-a', currentPage == 'return' ? 'active' : '']">退货退款</a>
                    <a href="javascript:void(0)" @click="switchPage('freeshop')" v-if="shopAuditStatus != 1" :class="['item-a', currentPage == 'freeshop' ? 'active' : '']"
                        >免费开店</a
                    >
                    <a href="javascript:void(0)" @click="switchPage('myshop')" data-shopid="shopId" v-if="shopAuditStatus == 1" :class="['item-a']">我的店铺</a>
                    <a
                        href="javascript:void(0)"
                        @click="switchPage('shopaccount')"
                        v-if="shopAuditStatus == 1 && isSetPassword == false"
                        :class="['item-a', currentPage == 'shopaccount' ? 'active' : '']"
                        >设置店铺账号</a
                    >
                    <a
                        href="javascript:void(0)"
                        @click="switchPage('shopaccount')"
                        v-if="shopAuditStatus == 1 && isSetPassword == true"
                        :class="['item-a', currentPage == 'shopaccount' ? 'active' : '']"
                        >修改店铺密码</a
                    >
                </div> -->
                <!-- <div class="item">
                    <div class="tit">资产中心</div>
                    <a href="javascript:void(0)" @click="switchPage('integral')" :class="['item-a', currentPage == 'integral' ? 'active' : '']">我的积分</a>
                    <a href="javascript:void(0)" @click="switchPage('member-center')" :class="['item-a']">会员中心</a>
                    <a href="javascript:void(0)" @click="switchPage('coupons-center')" :class="['item-a']">领券中心</a>
                    <a href="javascript:void(0)" @click="switchPage('coupons')" :class="['item-a', currentPage == 'coupons' ? 'active' : '']">我的优惠券</a>
                </div> -->
                <div class="item">
                    <div class="tit">账户管理</div>
                    <!-- <a href="javascript:void(0)" @click="switchPage('account')" :class="['item-a', currentPage == 'account' ? 'active' : '']">账户信息</a> -->
                    <a href="javascript:void(0)" @click="switchPage('address')" :class="['item-a', currentPage == 'address' ? 'active' : '']">收货地址</a>
                    <!-- <a href="javascript:void(0)" @click="switchPage('password')" :class="['item-a', currentPage == 'password' ? 'active' : '']">修改密码</a> -->
                </div>
            </div>
            <!-- /侧栏 -->
            <!-- <nuxt-child @userCenterInfo="getUserCenterInfo()" /> -->
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            unUseCount: 0,
            currentPage: this.$route.query.currentPage || this.$route.path.substring(this.$route.path.lastIndexOf("-") + 1),
            shopAuditStatus: null, //店铺状态：0 未审核 1已通过 -1未通过 null 未开店
            shopId: 0, //店铺id,
            isSetPassword: null
        }
    },
    mounted() {
        // this.getCouponCount()
        // this.getUserCenterInfo()  //获取个人中心信息
    },
    methods: {
        switchPage(page) {
            if (page == "coupons-center") {
                this.$router.push({ path: "/coupons" })
            } else if (page == "member-center") {
                this.$router.push({ path: "/member-center/member-center" })
            } else if (page == "comments") {
                this.$router.push({ path: "/store/user-center/uc-comments" })
            } else if (page == "myshop") {
                this.$router.push({ path: "/shopIndex?sid=" + this.shopId })
            } else if (page == "shopaccount") {
                this.$router.push({ path: "/store/user-center/uc-shopaccount", query: { isSetPassword: this.isSetPassword } })
            } else if (page == "freeshop") {
                this.$router.push({ path: "/store/user-center/uc-freeshop", query: { shopAuditStatus: this.shopAuditStatus } })
            } else {
                this.$router.push({ path: "/store/user-center/uc-" + page })
            }
            this.currentPage = page
        },

        /**
         * 请求个人中心信息（店铺审核状态）
         */
        getUserCenterInfo() {
            this.$axios.get("/p/user/centerInfo", {}).then(({ data }) => {
                this.isSetPassword = data.isSetPassword //是否已经设置过支付密码
                this.orderCountData = data.orderCountData //订单状态信息
                this.shopAuditStatus = data.shopAuditStatus //审核状态：0 未审核 1已通过 -1未通过 null 未开店
                this.shopId = data.shopId //店铺id
            })
        },

        /**
         * 获取各分类数量
         */
        getCouponCount() {
            this.$axios.get("/p/myCoupon/getMyCouponsStatusCount", {}).then(({ data }) => {
                this.unUseCount = data.unUseCount
            })
        }
    }
}
</script>

<style scoped src="./css/user-center.css"></style>
