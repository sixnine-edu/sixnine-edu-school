<template>
    <div class="detail">
        <div class="app-content">
            <div class="crumbs">
                <a class="item-a" href="#/store/index">商城首页</a>
                <span class="arrow">&gt;</span>
                <span class="item-span">商品详情</span>
            </div>
            
            <div class="detail-up">
                <!-- 商品图片 -->
                <div class="img">
                    <div class="big-img">
                        <img :src="prodInfo.pic" alt />
                    </div>
                    <div class="small-img">
                        <i class="left-arrow" @click="prevImg" :class="{ limit: prodImgs.length - 5 <= 0 || this.offsetCount < 1 }">&lt;</i>
                        <i class="right-arrow" @click="nextImg" :class="{ limit: prodImgs.length - 5 <= 0 || this.offsetCount >= prodImgs.length - 5 }">&gt;</i>
                        <div class="img-box">
                            <div class="offset-box" ref="carouser">
                                <div class="item" v-for="(item, index) in prodImgs" :key="index" :class="{ active: item.isActive }" @click="changeProdImg(index)">
                                    <img :src="item.img" alt />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /商品图片 -->
                <!-- 商品详情 -->
                <div class="info">
                    <div class="name-box">
                        <div class="name">{{ prodInfo.prodName }}</div>
                        <div class="des">
                            {{ prodInfo.brief }}
                        </div>
                    </div>

                    <!-- /拼团商品 -->
                    <div class="price-box">
                        <div class="item goods-price">
                            <span class="tit">价格</span>
                            <div class="con">
                                <div class="price" v-if="defaultSku.price">
                                    ￥
                                    <span class="big">{{ parsePrice(defaultSku.price)[0] }}</span>
                                    .{{ parsePrice(defaultSku.price)[1] }}
                                </div>
                                <div class="price" v-else>免费</div>
                                <div class="old-price" v-if="defaultSku.oriPrice">￥{{ defaultSku.oriPrice.toFixed(2) }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="sku-box" v-if="prodInfo.skuList.length">
                        <div class="items sku-text" v-for="(skuLine, key) in skuGroup" :key="key">
                            <span class="tit">{{ key }}</span>
                            <div class="con">
                                <span
                                    class="item"
                                    @click="toChooseItem(skuLineItem, key, $event)"
                                    :class="[
                                        selectedProp.indexOf(skuLineItem) !== -1 ? 'active' : '',
                                        isSkuLineItemNotOptional(allProperties, selectedPropObj, key, skuLineItem, propKeys) ? 'not-optional' : ''
                                    ]"
                                    v-for="skuLineItem in skuLine"
                                    :key="skuLineItem"
                                    >{{ skuLineItem }}</span
                                >
                            </div>
                        </div>
                    </div>
                    <!-- 计数器 -->
                    <div class="sku-box">
                        <div class="items">
                            <span class="tit">数量</span>
                            <div class="con">
                                <div class="goods-number" onselectstart="return false">
                                    <span :class="['reduce', this.prohibit ? 'limit' : '']" @click="reduce">-</span>
                                    <input type="number" class="number" v-model="prodNum" />
                                    <span :class="['increase', this.prohibit ? 'limit' : '']" @click="increase">+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="btns">
                        <a href="javascript:void(0)" class="buy-now" @click="buyNow" v-if="findSku && defaultSku.actualStocks">立即购买</a>
                        <a href="javascript:void(0)" class="shortage" v-else-if="!findSku">商品无货</a>
                        <a href="javascript:void(0)" class="shortage" v-else-if="!defaultSku.actualStocks">商品缺货</a>
                        <a href="javascript:void(0)" class="add-cart" v-if="findSku && defaultSku.actualStocks" @click="addToCart">加入购物车</a>
                        <a href="javascript:void(0)" class="collect" v-if="!isCollection" @click="toggleCollect()"> <i class="icon"></i>收藏商品 </a>
                        <a href="javascript:void(0)" class="collected" v-if="isCollection" @click="toggleCollect()"> <i class="icon"></i>已收藏 </a>
                    </div>
                </div>
                <!-- 商品详情 -->
            </div>
            <div class="detail-down">
                <div class="introduce-box">
                    <!-- <transition name="fade"> -->
                    <!-- 商品介绍 -->
                    <div class="introduce">
                        <div v-html="prodInfo.content"></div>
                    </div>
                    <!-- /商品介绍 -->
                    <!-- </transition> -->
                    <!-- <transition name="fade"> -->

                    <!-- </transition> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatHtml } from "@/utils/index"
export default {
    data() {
        return {
            // groupActivityId: this.$route.query.groupActivityId,
            prodId: this.$route.query.prodId,
            prodName: "",
            prodInfo: {
                skuList: []
            },
            prodImgs: [],
            offsetCount: 0, //图片偏移数
            imgCounts: 0, //缩略图数量
            showScrollTab: false,

            defaultSku: {}, // 选中的sku
            skuGroup: [], //
            selectedProp: [],
            findSku: true, // 能不能找得到sku
            prodNum: 1, //计数器数量
            prohibit: false, //计数器是否禁用
            isCollection: false, //商品是否已收藏
            totalCartNum: 0 //购物车数量
        }
    },
    mounted() {
        this.getProdInfo()
        //查询商品是否已经收藏
        this.isProdCollected()
    },

    methods: {
        getProdInfo() {
            this.$http({
                url: this.$http.adornUrl(`/corp/shop/prod/info/${this.prodId}`),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                if (data.imgs) {
                    var prodImgs = []
                    data.imgs.split(",").forEach(imgStr => {
                        prodImgs.push({
                            img: imgStr,
                            isActive: false
                        })
                    })
                    prodImgs[0].isActive = true
                }
                data.content = formatHtml(data.content) // 去除商品详情富文本样式
                this.prodInfo = data
                this.prodImgs = prodImgs
                this.$nextTick(() => {
                    this.groupSkuProp(this.prodInfo.skuList, this.prodInfo.price)
                })
            })
        },

        // 切换图片
        prevImg() {
            if (this.prodImgs.length - 5 > 0) {
                if (this.offsetCount > 0) {
                    this.offsetCount--
                    this.$refs.carouser.style.left = "-" + 78 * this.offsetCount + "px"
                } else {
                    return false
                }
            } else if (this.prodImgs.length - 5 <= 0) {
                return false
            } else {
                return false
            }
        },

        nextImg() {
            if (this.prodImgs.length - 5 > 0) {
                if (this.offsetCount < this.prodImgs.length - 5) {
                    this.offsetCount++
                    this.$refs.carouser.style.left = "-" + 78 * this.offsetCount + "px"
                } else if (this.prodImgs.length - 5 <= 0) {
                    return false
                } else {
                    return false
                }
            } else {
                return false
            }
        },

        /**
         * 商品已下架
         */
        handleClose() {
            this.tipsDialogVisible = false
            this.$router.go(-1)
        },

        /**
         * 小图点击事件
         */
        changeProdImg(index) {
            this.prodImgs.forEach(prodImg => {
                prodImg.isActive = false
            })
            this.prodImgs[index].isActive = true
            this.prodInfo.pic = this.prodImgs[index].img
        },

        /**
         * 价格过滤
         */
        parsePrice(value) {
            var val = Number(value)
            if (!val) {
                val = 0
            }
            // 截取小数点后两位，并以小数点为切割点将val转化为数组
            return val.toFixed(2).split(".")
        },

        /**
         * 收藏商品
         */
        toggleCollect() {
            var prodId = this.prodInfo.prodId
            var isCollection = this.isCollection

            this.$http({
                url: this.$http.adornUrl(`/corp/user/collection/addOrCancel`),
                method: "post",
                data: this.$http.adornData({
                    prodId
                })
            }).then(({ data }) => {
                this.isCollection = !isCollection
            })
        },

        /**
         * 查询商品是否已收藏
         */
        isProdCollected() {
            //   this.$axios.get('/corp/user/collection/isCollection', {
            //     params: {
            //       prodId: this.prodInfo.prodId
            //     }
            //   }).then(({ data }) => {
            //     this.isCollection = data
            //   })
        },

        /**
         * 减少商品数量
         */
        reduce() {
            var prodNum = this.prodNum
            if (prodNum > 1) {
                this.prodNum = prodNum - 1
                if (prodNum == 1) {
                    this.prohibit = true //禁用
                }
            }
        },

        /**
         * 增加商品数量
         */
        increase() {
            var prodNum = this.prodNum
            // 判断是否限购
            if (this.prodInfo.hasMaxNum) {
                if (prodNum < this.prodInfo.totalStocks && prodNum < this.prodInfo.maxNum) {
                    this.prodNum = prodNum + 1
                } else {
                    this.$message({
                        message: "限购" + this.prodInfo.maxNum + "件",
                        type: "warning",
                        duration: 1000
                    })
                    this.prohibit = true //禁用
                }
            } else {
                if (prodNum < this.prodInfo.totalStocks) {
                    this.prodNum = prodNum + 1
                } else {
                    this.prohibit = true //禁用
                }
            }
        },

        /**
         * 组装SKU
         */
        groupSkuProp: function(skuList, defaultPrice) {
            if (skuList.length == 1 && skuList[0].properties == "") {
                this.defaultSku = skuList[0]
                this.imgCounts = this.prodImgs.length
                this.$refs.carouser.style.width = this.imgCounts * 78 + "px" // 设置图片盒子的初始宽度
                return
            }
            var skuGroup = {}
            var allProperties = []
            var propKeys = []
            var selectedPropObj = {}
            var defaultSku = null
            for (var i = 0; i < skuList.length; i++) {
                var isDefault = false
                if (!defaultSku && skuList[i].price == defaultPrice) {
                    //找到和商品价格一样的那个SKU，作为默认选中的SKU
                    defaultSku = skuList[i]
                    isDefault = true
                }
                var properties = skuList[i].properties //版本:公开版;颜色:金色;内存:64GB
                allProperties.push(properties)
                var propList = properties.split(";") // ["版本:公开版","颜色:金色","内存:64GB"]

                for (var j = 0; j < propList.length; j++) {
                    var propval = propList[j].split(":") //["版本","公开版"]
                    var props = skuGroup[propval[0]] //先取出 版本对应的值数组

                    //如果当前是默认选中的sku，把对应的属性值 组装到selectedProp
                    if (isDefault) {
                        propKeys.push(propval[0])
                        selectedPropObj[propval[0]] = propval[1]
                    }

                    if (props == undefined) {
                        props = [] //假设还没有版本，新建个新的空数组
                        props.push(propval[1]) //把 "公开版" 放进空数组
                    } else {
                        if (props.indexOf(propval[1]) === -1) {
                            //如果数组里面没有"公开版"
                            props.push(propval[1]) //把 "公开版" 放进数组
                        }
                    }
                    skuGroup[propval[0]] = props //最后把数据 放回版本对应的值
                }
            }
            this.imgCounts = defaultSku.pic ? this.prodImgs.length + 1 : this.prodImgs.length
            this.$refs.carouser.style.width = this.imgCounts * 78 + "px" // 设置图片盒子的初始宽度
            this.defaultSku = defaultSku
            this.propKeys = propKeys
            this.selectedPropObj = selectedPropObj
            this.parseSelectedObjToVals(skuList)
            this.skuGroup = skuGroup
            this.allProperties = allProperties
        },

        /**
         * 将已选的 {key:val,key2:val2}转换成 [val,val2]
         */
        parseSelectedObjToVals: function(skuList) {
            var selectedPropObj = this.selectedPropObj
            var selectedProperties = ""
            var selectedProp = []
            for (var key in selectedPropObj) {
                selectedProp.push(selectedPropObj[key])
                selectedProperties += key + ":" + selectedPropObj[key] + ";"
            }
            selectedProperties = selectedProperties.substring(0, selectedProperties.length - 1)
            this.selectedProp = selectedProp
            this.selectedProperties = selectedProperties
            this.selectedPropObj = selectedPropObj

            var findSku = false
            for (var i = 0; i < skuList.length; i++) {
                if (skuList[i].properties == selectedProperties) {
                    findSku = true
                    this.defaultSku = skuList[i]
                    this.changeSkuImg(this.defaultSku.pic)
                    break
                }
            }
            this.findSku = findSku
        },

        /**
         * 切换SKU图片
         */
        changeSkuImg(skuPic) {
            if (skuPic) {
                if (this.prodImgs[0].sku) {
                    this.prodImgs.splice(0, 1)
                }
                this.prodImgs.forEach(prodImg => {
                    prodImg.isActive = false
                })
                this.prodImgs.splice(0, 0, {
                    img: skuPic,
                    isActive: true,
                    sku: true
                })
                this.prodInfo.pic = skuPic
            }
        },

        /**
         * 判断当前的规格值 是否可以选
         */
        isSkuLineItemNotOptional(allProperties, selectedPropObj, key, item, propKeys) {
            var selectedPropObj = Object.assign({}, selectedPropObj)
            var properties = ""
            selectedPropObj[key] = item
            for (var j = 0; j < propKeys.length; j++) {
                properties += propKeys[j] + ":" + selectedPropObj[propKeys[j]] + ";"
            }
            properties = properties.substring(0, properties.length - 1)
            for (var i = 0; i < allProperties.length; i++) {
                if (properties == allProperties[i]) {
                    return false
                }
            }
            for (var i = 0; i < allProperties.length; i++) {
                if (allProperties[i].indexOf(item) >= 0) {
                    return true
                }
            }
            return false
        },

        /**
         * 规格点击事件
         */
        toChooseItem(skuLineItem, key, event) {
            this.selectedPropObj[key] = skuLineItem
            this.parseSelectedObjToVals(this.prodInfo.skuList)
        },

        /**
         * 加入购物车
         */
        addToCart() {
            if (!this.findSku) {
                return
            }

            this.$http({
                url: this.$http.adornUrl(`/corp/shopcart/changeItem`),
                method: "post",
                data: this.$http.adornData({
                    basketId: 0,
                    count: this.prodNum,
                    prodId: this.$route.query.prodId,
                    skuId: this.defaultSku.skuId
                })
            }).then(({ data }) => {
                this.getCartCount()
                this.$message.success("成功加入购物车")
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
         * 立即购买
         */
        buyNow() {
            if (!this.findSku) {
                this.$message.error("商品无货~")
                return
            }
            sessionStorage.setItem(
                "orderItem",
                JSON.stringify({
                    prodId: this.prodInfo.prodId,
                    skuId: this.defaultSku.skuId,
                    prodCount: this.prodNum
                })
            )
            this.$router.push({
                path: "/store/submit-order?orderEntry=1"
            })
        }
    },

    destroyed() {
        // 页面销毁时移除监听
        window.removeEventListener("scroll", this.handleScroll)
    }
}
</script>

<style scoped lang="scss">
*,
*:before,
*:after {
    box-sizing: content-box;
}

.detail {
    .detail-up {
        display: flex;
        margin-top: 20px;
        .img {
            width: 450px;
            margin-right: 40px;
            .big-img {
                width: 100%;
                height: 450px;
                text-align: center;
                line-height: 430px;
                font-size: 0;
                position: relative;
                img {
                    max-width: 100%;
                    max-height: 100%;
                    vertical-align: middle;
                }
            }

            .small-img {
                position: relative;
                .left-arrow {
                    left: 0;
                    text-align: left;
                }
                .right-arrow {
                    right: 0;
                    text-align: right;
                }
                .limit {
                    color: #eee;
                    &:hover {
                        color: #eee;
                    }
                }
                .img-box {
                    margin: 15px 35px 0;
                    width: 380px;
                    height: 68px;
                    overflow: hidden;
                    position: relative;
                    .offset-box {
                        position: absolute;
                        left: 0;
                        -webkit-transition: all 0.3s;
                        -moz-transition: all 0.3s;
                        transition: all 0.3s;
                    }
                    .item {
                        display: inline-block;
                        width: 64px;
                        height: 64px;
                        font-size: 0;
                        line-height: 64px;
                        text-align: center;
                        border: 2px solid #fff;
                        margin-left: 10px;
                        &:first-child {
                            margin-left: 0;
                        }
                        img {
                            max-width: 100%;
                            max-height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
        .info {
            flex: 1;
            .name-box {
                margin-bottom: 15px;
                margin-top: 5px;
                .name {
                    font-size: 20px;
                    line-height: 28px;
                }
                .des {
                    margin-top: 7px;
                    color: #999;
                    line-height: 18px;
                    font-size: 12px;
                    .discount-info {
                        color: #999;
                        .go-discount {
                            color: #005ea7;
                            &:hover {
                                text-decoration: underline;
                            }
                            .arr {
                                font-family: Consolas;
                            }
                        }
                    }
                }
            }

            .price-box {
                background: #f9f9f9;
                border-top: 1px dotted #eee;
                border-bottom: 1px dotted #eee;
                padding: 0 0 13px;
                line-height: 24px;
                margin-top: -1px;
                margin-bottom: 20px;
                .item {
                    display: flex;
                    margin-top: 15px;
                    .tit {
                        margin: 0 15px;
                        color: #999;
                    }
                    .con {
                        flex: 1;
                    }
                    &.goods-price {
                        height: 30px;
                        line-height: 35px;
                        .con {
                            display: flex;
                            .price {
                                font-size: 18px;
                                height: 30px;
                                line-height: 30px;
                                display: flex;
                                align-items: baseline;
                                .big {
                                    font-size: 26px;
                                }
                            }
                            .old-price {
                                font-family: arial;
                                color: #999;
                                text-decoration: line-through;
                                margin-left: 10px;
                            }
                        }
                    }
                }
            }
            .sku-box {
                .items {
                    display: flex;
                    margin-top: 10px;
                    .tit {
                        margin: 0 15px;
                        color: #999;
                        display: block;
                        line-height: 30px;
                    }
                    .con {
                        flex: 1;
                        display: flex;
                        flex-wrap: wrap;
                        .item {
                            display: inline-block;
                            border: 1px solid #ddd;
                            position: relative;
                            margin-right: 10px;
                            margin-bottom: 10px;
                            vertical-align: middle;
                            -moz-transition: all 0.2s;
                            -webkit-transition: all 0.2s;
                            -o-transition: all 0.2s;
                            transition: all 0.2s;
                            cursor: pointer;
                            &.not-optional {
                                border: 1px dashed #bbb;
                                color: #bbb;
                            }
                        }
                        .goods-number {
                            height: 30px;
                            .limit {
                                cursor: not-allowed;
                                color: #ccc;
                            }
                            .number {
                                border: 0;
                                width: 40px;
                                height: 30px;
                                text-align: center;
                                font-family: arial;
                                vertical-align: top;
                            }
                        }
                    }
                    &.sku-img {
                        .tit {
                            line-height: 52px;
                        }
                        .con {
                            .item {
                                width: 50px;
                                height: 50px;
                                font-size: 0;
                                line-height: 50px;
                                img {
                                    width: 100%;
                                    height: 100%;
                                    vertical-align: middle;
                                }
                            }
                        }
                    }
                    &.sku-text {
                        .con {
                            .item {
                                padding: 0 16px;
                                line-height: 28px;
                                height: 28px;
                            }
                        }
                    }
                }
            }
            .btns {
                margin-top: 30px;
                padding-left: 15px;
                display: flex;
                .buy-now {
                    background: #e1251b;
                    color: #fff;
                    height: 48px;
                    line-height: 48px;
                    &:hover {
                        opacity: 0.9;
                    }
                }
                .add-cart {
                    margin-left: 10px;
                    background: #ffdedf;
                    border: 1px solid #e1251b;
                    color: #e1251b;
                    &:hover {
                        background: #fff;
                    }
                }
                .collect {
                    .icon {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        vertical-align: top;
                        margin-right: 10px;
                        margin-top: 16px;
                        background: url(../../assets/img/icons.png) no-repeat 0 -156px;
                    }
                    &.active {
                        .icon {
                            background-position: -21px -156px;
                        }
                    }
                }
                .collected {
                    .icon {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        vertical-align: top;
                        margin-right: 10px;
                        margin-top: 16px;
                        background: url(../../assets/img/icons.png) no-repeat -21px -156px;
                    }
                }
                .shortage {
                    height: 48px;
                    line-height: 48px;
                    background: #f7f7f7;
                    color: #999;
                    cursor: not-allowed;
                }
            }
            .group-btn {
                .alone-group {
                    background: #85c360;
                    margin-left: 10px;
                    &:hover {
                        opacity: 0.9;
                    }
                    &.cannotbuy {
                        background: #bbb;
                    }
                }
                .build-group {
                    background: #e1251b;
                    .group-text {
                        display: block;
                        line-height: 14px;
                        margin-top: 3px;
                    }
                    .group-code {
                        display: none;
                        position: absolute;
                        left: 0;
                        top: 58px;
                        width: 130px;
                        box-sizing: border-box;
                        border: 1px solid #eee;
                        background: #fff;
                        box-shadow: 0 0 3px rgba(0, 0, 0, 0.07);
                        &::before {
                            top: -11px;
                            border-bottom: 5px solid #e4e4e4;
                        }
                        &::after {
                            top: -10px;
                            border-bottom: 5px solid #f5f5f5;
                        }
                        .text {
                            display: block;
                            width: 100%;
                            height: 30px;
                            line-height: 30px;
                            padding-left: 10px;
                            box-sizing: border-box;
                            background: #f5f5f5;
                            font-size: 13px;
                            font-family: arial;
                            font-weight: 400;
                            text-align: left;
                            color: #666;
                        }
                        .code-img {
                            display: block;
                            margin: 10px auto;
                            width: 110px;
                            height: 110px;
                            font-size: 0;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                    &:hover {
                        .group-code {
                            display: block;
                        }
                    }
                }
                .group-price {
                    display: block;
                    line-height: 14px;
                    margin-top: 9px;
                }
            }
        }
    }
    .detail-down {
        display: flex;
        margin-top: 30px;
        .introduce-box {
            flex: 1;
            margin-right: 20px;
            .tab {
                display: flex;
                background: #f9f9f9;
                border: 1px solid #eee;
                border-bottom-color: #e1251b;
                .item {
                    height: 40px;
                    line-height: 40px;
                    padding: 0 30px;
                    font-size: 14px;
                    -moz-transition: all 0.2s;
                    -webkit-transition: all 0.2s;
                    -o-transition: all 0.2s;
                    transition: all 0.2s;
                    cursor: pointer;
                    margin-left: -1px;
                    margin-top: -1px;
                    &:hover {
                        color: #e1251b;
                    }
                    &.active {
                        background: #e1251b;
                        color: #fff;
                        .number {
                            color: #fff;
                        }
                    }
                    .number {
                        color: #e1251b;
                        font-family: arial;
                    }
                }
            }
            .introduce {
                margin-top: 30px;
                img {
                    display: block;
                    margin: auto;
                    max-width: 100%;
                }
            }
            .comment {
                margin-top: 30px;
                .good-rates {
                    display: flex;
                    padding: 20px 0;
                    .score {
                        border-right: 1px solid #eee;
                        text-align: center;
                        display: flex;
                        padding: 0 60px;
                        align-items: center;
                        .tit {
                            margin-right: 20px;
                            font-size: 14px;
                        }
                        .con {
                            font-size: 45px;
                            color: #e1251b;
                            font-family: arial;
                        }
                    }
                    .average {
                        margin-left: 50px;
                        .item {
                            display: flex;
                            height: 14px;
                            line-height: 14px;
                            margin-top: 10px;
                            &:first-child {
                                margin-top: 0;
                            }
                            .stars {
                                margin: 0 10px;
                                .star {
                                    background: url(../../assets/img/icons.png) no-repeat;
                                    background-position: -42px -138px;
                                }
                                .star-gray {
                                    background: url(../../assets/img/icons.png) no-repeat;
                                    background-position: -61px -138px;
                                }
                            }
                        }
                    }
                }
                .comment-tab {
                    display: flex;
                    background: #f9f9f9;
                    padding: 10px;
                    border: 1px solid #eee;
                    margin-top: 20px;
                    .item {
                        padding: 0 10px;
                        cursor: pointer;
                        -moz-transition: all 0.2s;
                        -webkit-transition: all 0.2s;
                        -o-transition: all 0.2s;
                        transition: all 0.2s;
                        .number {
                            font-family: arial;
                        }
                    }
                }
                .comment-con {
                    margin-top: 15px;
                    .item {
                        padding: 15px;
                        display: flex;
                        border-bottom: 1px solid #eee;
                        .buyer-msg {
                            width: 80px;
                            text-align: center;
                            .img {
                                width: 50px;
                                height: 50px;
                                border-radius: 50%;
                                overflow: hidden;
                                margin: auto;
                                img {
                                    width: 100%;
                                    height: 100%;
                                    display: block;
                                }
                            }
                            .name {
                                margin: 7px auto 0;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                            }
                        }
                        .buyer-comment {
                            margin-left: 10px;
                            line-height: 20px;
                            flex: 1;
                            .stars {
                                padding-top: 2px;
                                height: 14px;
                                .star {
                                    background: url(../../assets/img/icons.png) no-repeat;
                                    background-position: -42px -138px;
                                    margin-right: 3px;
                                }
                                .star-gray {
                                    background: url(../../assets/img/icons.png) no-repeat;
                                    background-position: -61px -138px;
                                    margin-right: 3px;
                                }
                            }
                            .text {
                                margin-top: 5px;
                            }
                            .img-box {
                                .img {
                                    display: inline-block;
                                    text-align: center;
                                    width: 60px;
                                    height: 60px;
                                    line-height: 60px;
                                    font-size: 0;
                                    border: 1px solid #fff;
                                    margin: 10px 10px 0 0;
                                    &:hover {
                                        border-color: #e1251b;
                                    }
                                    img {
                                        display: inline-block;
                                        text-align: center;
                                        max-width: 100%;
                                        max-height: 100%;
                                        vertical-align: middle;
                                        -moz-transition: all 0.2s;
                                        -webkit-transition: all 0.2s;
                                        -o-transition: all 0.2s;
                                        transition: all 0.2s;
                                        cursor: pointer;
                                    }
                                }
                            }
                            .time-sku {
                                margin-top: 10px;
                                color: #999;
                                .time {
                                    font-family: arial;
                                }
                                .sku {
                                    margin-left: 20px;
                                }
                            }
                            .append-comment {
                                margin-top: 10px;
                                padding-top: 10px;
                                border-top: 1px solid #eee;
                                .append-time {
                                    color: #999;
                                }
                                .append-con {
                                    margin-top: 5px;
                                    padding-bottom: 3px;
                                }
                            }
                            .seller-reply {
                                margin-top: 10px;
                                padding-top: 10px;
                                border-top: 1px solid #eee;
                                .tit {
                                    color: #e1251b;
                                }
                                .con {
                                    margin-top: 5px;
                                }
                                .time {
                                    margin-top: 10px;
                                    color: #999;
                                    font-family: arial;
                                }
                            }
                        }
                    }
                    .comment-empty {
                        text-align: center;
                        color: #999;
                        padding: 80px 0;
                        border-bottom: 1px solid #eee;
                    }
                }
                .pages {
                    margin-top: 20px;
                }
            }
        }
        .side {
            width: 242px;
            .shop-search {
                border: 1px solid #eee;
                .con {
                    padding: 15px;
                    display: flex;
                }
                .text {
                    height: 26px;
                    line-height: 26px;
                    vertical-align: top;
                    border: 1px solid #ddd;
                    background: #fff;
                    border-right: none;
                    font-size: 12px;
                    padding: 0 10px;
                    flex: 1;
                }
                .btn {
                    width: 30px;
                    height: 28px;
                    position: relative;
                    background: #e1251b;
                    &::before {
                        position: absolute;
                        left: 8px;
                        top: 6px;
                        display: block;
                        width: 14px;
                        height: 14px;
                        content: " ";
                        font-size: 0;
                        background: url(../../assets/img/icons.png) no-repeat;
                        background-position: 0 -58px;
                    }
                    &:hover {
                        opacity: 0.8;
                    }
                }
            }
            .shop-category {
                margin-top: 20px;
                border: 1px solid #eee;
                .con {
                    padding: 10px 15px;
                    line-height: 30px;
                    .items {
                        .item-main {
                            position: relative;
                            padding-left: 15px;
                            cursor: pointer;
                            height: 30px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            -moz-transition: all 0.2s;
                            -webkit-transition: all 0.2s;
                            -o-transition: all 0.2s;
                            transition: all 0.2s;
                            .arrow {
                                position: absolute;
                                left: 0;
                                top: 12px;
                                width: 0;
                                height: 0;
                                border: 4px solid transparent;
                                border-left: 5px solid #333;
                                border-radius: 2px;
                            }
                        }
                        &.active {
                            .item-main {
                                .arrow {
                                    border-left: 4px solid transparent;
                                    border-top: 4px solid #333;
                                    top: 15px;
                                }
                            }
                            .item-con {
                                display: block;
                            }
                        }
                        .item-con {
                            display: none;
                            .item {
                                padding-left: 15px;
                                color: #999;
                                height: 30px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                cursor: pointer;
                                -moz-transition: all 0.2s;
                                -webkit-transition: all 0.2s;
                                -o-transition: all 0.2s;
                                transition: all 0.2s;
                                &:hover {
                                    color: #e1251b;
                                }
                            }
                        }
                    }
                }
            }
            .sale-well {
                margin-top: 20px;
                border: 1px solid #eee;
                .con {
                    padding: 15px;
                    .item {
                        position: relative;
                        margin: 15px auto 0;
                        cursor: pointer;
                        -moz-transition: all 0.2s;
                        -webkit-transition: all 0.2s;
                        -o-transition: all 0.2s;
                        transition: all 0.2s;
                        &:hover {
                            opacity: 0.8;
                        }
                        &:first-child {
                            margin-top: 0;
                        }
                        .goods-img {
                            width: 210px;
                            height: 210px;
                            line-height: 210px;
                            text-align: center;
                            font-size: 0;
                            img {
                                max-width: 100%;
                                max-height: 100%;
                                vertical-align: middle;
                            }
                        }
                        .goods-msg {
                            text-align: center;
                            padding-top: 10px;
                            padding-bottom: 5px;
                            .goods-name {
                                height: 14px;
                                line-height: 14px;
                                font-size: 14px;
                                max-width: 100%;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .goods-price {
                                display: flex;
                                justify-content: center;
                                height: 16px;
                                line-height: 16px;
                                margin: 10px 0;
                                overflow: hidden;
                                .old-price {
                                    margin-left: 10px;
                                    color: #999;
                                    font-family: arial;
                                    text-decoration: line-through;
                                    height: 12px;
                                    line-height: 12px;
                                    margin-top: 4px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
.detail .crumbs-shop .shop-box .favourite:hover .favourite-icon,
.detail .crumbs-shop .shop-box .favourite.active .favourite-icon {
    background-position: -21px -135px;
}
/* 面包屑和店铺信息 end */
/* 详情上部分 */
/* 商品图片 */
.prod-video {
    background-color: #000;
}
.close-btn {
    position: absolute;
    display: flex;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    top: 20px;
    right: 10px;
    transform: translateX(-50%);
}
.detail .detail-up .img .small-img .left-arrow,
.detail .detail-up .img .small-img .right-arrow {
    position: absolute;
    top: 0;
    display: block;
    width: 35px;
    height: 68px;
    line-height: 64px;
    font-size: 40px;
    color: #ccc;
    font-family: Consolas;
    cursor: pointer;
    -moz-transition: all 0.2s;
    -webkit-transition: all 0.2s;
    -o-transition: all 0.2s;
    transition: all 0.2s;
}
.detail .detail-up .img .small-img .left-arrow:hover,
.detail .detail-up .img .small-img .right-arrow:hover {
    color: #999;
}
.detail .detail-up .img .small-img .img-box .item.active,
.detail .detail-up .img .small-img .img-box .item:hover {
    border: 2px solid #e1251b;
}
/* 商品图片 end */
/* 商品详情 */
.detail .detail-up .info .price-box .item.coupons .con .conpon::before,
.detail .detail-up .info .price-box .item.coupons .con .conpon::after {
    position: absolute;
    top: -1px;
    display: block;
    height: 18px;
    width: 2px;
    content: " ";
    background: url(../../assets/img/icons.png) no-repeat 0 -453px;
}
.detail .detail-up .info .price-box .item.discount .con .discount-item.item-box .text,
.detail .detail-up .info .price-box .item.discount .con .discount-item.item-box .det {
    display: none;
}
.detail .detail-up .info .price-box .item.discount .con:hover .discount-item.item-box .text,
.detail .detail-up .info .price-box .item.discount .con:hover .discount-item.item-box .det {
    display: block;
}
.detail .detail-up .info .sku-box .items .con .item.active,
.detail .detail-up .info .sku-box .items .con .item:hover {
    border: 1px solid #e1251b;
    color: #e1251b;
}
.detail .detail-up .info .sku-box .items .con .goods-number .reduce,
.detail .detail-up .info .sku-box .items .con .goods-number .increase {
    display: inline-block;
    vertical-align: top;
    width: 30px;
    height: 30px;
    background: #f5f5f5;
    font-size: 22px;
    text-align: center;
    line-height: 26px;
    color: #999;
    cursor: pointer;
}
.detail .detail-up .info .btns .buy-now,
.detail .detail-up .info .btns .add-cart,
.detail .detail-up .info .btns .collect,
.detail .detail-up .info .btns .collected,
.detail .detail-up .info .btns .shortage {
    height: 46px;
    line-height: 46px;
    padding: 0 50px;
    font-size: 16px;
    border-radius: 2px;
}
.detail .detail-up .info .btns .collect,
.detail .detail-up .info .btns .collected {
    border: 1px solid #ddd;
    padding: 0 30px;
    margin-left: 10px;
}

/* 拼团按钮 end */
/* 商品详情 end */
/* 详情上部分 end */
/* 详情下部分 */
/* 商品介绍 */
/* 商品介绍 end */
/* 商品评论 */
.detail .detail-down .introduce-box .comment .good-rates .average .item .number,
.detail .detail-down .introduce-box .comment .good-rates .average .item .text {
    font-family: arial;
    display: inline-block;
    vertical-align: top;
}
.detail .detail-down .introduce-box .comment .good-rates .average .item .stars .star,
.detail .detail-down .introduce-box .comment .good-rates .average .item .stars .star-gray {
    display: inline-block;
    vertical-align: top;
    width: 14px;
    height: 14px;
}
.detail .detail-down .introduce-box .comment .comment-tab .item:hover,
.detail .detail-down .introduce-box .comment .comment-tab .item.active {
    color: #e1251b;
}
.detail .detail-down .introduce-box .comment .comment-con .item .buyer-comment .stars .star,
.detail .detail-down .introduce-box .comment .comment-con .item .buyer-comment .stars .star-gray {
    display: inline-block;
    vertical-align: top;
    width: 14px;
    height: 14px;
}

/* 滑动导航 end */
/* 商品数量-input: 去除input标签type='number' 的默认加减箭头 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type="number"] {
    -moz-appearance: textfield;
}
</style>
