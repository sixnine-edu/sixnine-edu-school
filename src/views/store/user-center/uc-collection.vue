<template>
    <!-- 商品收藏 -->
    <div class="con-box uc-collection">
        <!-- 导航 -->
        <div class="uc-nav">
            <div class="nav-box">
                <!-- <div class="nav-item active">
          <span class="text">商品收藏<em class="number">5</em></span>
          <i class="line"></i>
        </div>-->
            </div>
        </div>
        <!-- /导航 -->
        <!-- 搜索 -->
        <div class="uc-serach">
            <div class="left">
                <div class="select-item" v-if="favType == 1">
                    <span class="tit" @click="prodTypeSearch = 0">{{ prodTypeSearch === 0 ? "全部商品" : "失效商品" }}</span>
                    <div class="select">
                        <span class="s-item" @click="prodTypeSearch = 0">全部商品</span>
                        <span class="s-item" @click="prodTypeSearch = 2">失效商品</span>
                    </div>
                </div>
                <div class="action-btn">
                    <a href="javascript:void(0);" class="batch" @click="batchManager($event)">批量管理</a>
                </div>
                <div class="action-btn active">
                    <a href="javascript:void(0);" v-if="isBatchEdit" class="batch" @click="overManager()">完成管理</a>
                    <span class="batch-box" v-if="isBatchEdit">
                        <span class="check" @click="checkAll()">
                            <input type="checkbox" class="checkbox default" :class="{ checked: checkAllData, default: !checkAllData }" />
                            <span class="text">全选</span>
                        </span>
                        <span class="cancel-collection" @click="showPopup()">
                            <i class="icon"></i>
                            <span class="text">取消收藏</span>
                        </span>
                    </span>
                </div>
            </div>
            <div class="right">
                <input
                    type="text"
                    class="input"
                    :placeholder="favType == 1 ? '请输入商品名称' : '请输入店铺名称'"
                    @focus="newCurrent"
                    @keyup.enter="search"
                    v-model="prodNameSearch"
                />
                <a href="javascript:void(0)" @click="search" class="search">搜索</a>
            </div>
        </div>
        <!-- /搜索 -->
        <!-- 收藏列表 -->
        <div class="goods-list">
            <div class="list-con">
                <div
                    v-for="(data, index) in favType == 1 ? prodFavList : shopFavList"
                    :key="index"
                    :class="['item', isBatchEdit ? 'batch-edit' : '', data.isCheck ? 'checked' : '']"
                    @click="selectIt(favType == 1 ? data.prodId : data.shopId, index)"
                >
                    <div class="goods-img">
                        <img :src="favType == 1 ? data.pic : data.shopLogo" alt />
                    </div>
                    <div class="goods-msg">
                        <div class="goods-name">{{ favType == 1 ? data.prodName : data.shopName }}</div>
                        <div class="goods-price">
                            <div class="price" v-if="favType == 1">
                                ￥
                                <span class="big">{{ parsePrice(data.price)[0] }}.{{ parsePrice(data.price)[1] }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="goods-action">
                        <a
                            href="javascript:void(0)"
                            @click="addProdCartOrIntoShop(favType == 1 ? data.prodId : data.shopId, favType == 1 ? data.status : null)"
                            class="action-a a1"
                        >
                            <i class="icon"></i>
                            {{ favType == 1 ? "去购买" : "进入店铺" }}
                        </a>
                        <a href="javascript:void(0)" @click="showPopup(favType == 1 ? data.prodId : data.shopId)" class="action-a a2"> <i class="icon"></i>取消收藏 </a>
                    </div>
                    <div class="item-mask">
                        <i class="icon"></i>
                    </div>
                </div>
                <!-- 收藏的店铺或者商品 -->
            </div>
            <!-- 页码 -->
            <pagination v-model="current" :pages="pages" @changePage="getSearchProdPage"></pagination>
            <!-- /页码 -->
        </div>
        <!-- /收藏列表 -->
        <!-- 空列表提示 -->
        <div class="empty" v-if="!prodFavList.length && favType == 1">
            <div class="img">
                <img src="../../../assets/img/emptyPic/collect-empty.png" alt />
            </div>
            <div class="action">
                <div class="text">暂无收藏</div>
                <nuxt-link to="/" class="btn">看看别的</nuxt-link>
            </div>
        </div>
        <div class="empty" v-if="!shopFavList.length && favType == 2">
            <div class="img">
                <img src="../../../assets/img/emptyPic/collect-empty.png" alt />
            </div>
            <div class="action">
                <div class="text">暂无收藏</div>
                <nuxt-link to="/" class="btn">看看别的</nuxt-link>
            </div>
        </div>
        <!-- /空列表提示 -->
        <!-- 提示弹窗 -->
        <div class="popup-mask" v-if="visible"></div>
        <div class="popup-box" v-if="visible">
            <div class="tit">
                <div class="text">提示</div>
                <div class="close" @click="closePopup()"></div>
            </div>
            <div class="con">
                <div class="tip">
                    <div class="tip-icon warning"></div>
                    <div class="tip-info">
                        <div class="result">确认要取消收藏该{{ favType == 1 ? "商品" : "店铺" }}吗？</div>
                        <div class="date">取消收藏之后{{ favType == 1 ? "商品" : "店铺" }}将不容易被找到哦</div>
                        <div class="btns">
                            <a href="JavaScript:;" @click="confirmCancel()" class="btn-r">确认</a>
                            <a href="JavaScript:;" class="btn-g" @click="closePopup()">关闭</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /提示弹窗 -->
    </div>
    <!-- /商品收藏 -->
</template>

<script>
import Pagination from "@/components/pagination"
export default {
    data() {
        return {
            url: "/user-center/uc-collection", // 当前页url
            prodTypeSearch: 0, // 0 全部商品 1 降价商品 2 失效商品
            prodNameSearch: null,
            current: 1, // 当前页
            pages: 1, // 总页数
            size: 4,
            checkAllData: false,
            // 开启批量管理
            isBatchEdit: false,
            // 单选
            isCheck: false,
            // 全选
            isAllCheck: false,
            // 1 商品收藏 2 店铺收藏
            favType: 1,
            // 商品收藏列表
            prodFavList: [],
            prodFavNum: null,
            prodInfo: null,
            // 店铺收藏类别
            shopFavList: [],
            shopFavNum: null,
            shopInfo: null,
            visible: false, //提示弹窗
            id: 0, //商品id或店铺id
            shopIds: [], // 取消收藏选择店铺列表
            prodIds: [] // 取消收藏选择商品列表
        }
    },
    components: {
        Pagination
    },
    created() {},
    mounted() {
        // 设置网页标题
        document.title = "我的收藏"
        this.getFavProdNum()
        this.getFavShopNum()
        this.getFavList()
    },
    methods: {
        init(favType) {
            this.favType = favType
            this.getFavList()
        },
        /**
         * 获取收藏列表
         */
        getFavList() {
            this.overManager()
            if (this.favType == 1) {
                // this.shopFavList = null
                this.getFavProdList()
            } else if (this.favType == 2) {
                // this.prodFavList = null
                this.getFavShopList()
            }
        },
        /**
         * 获取商品收藏列表
         */
        getFavProdList() {
            let params = {
                prodType: this.prodTypeSearch,
                current: this.current,
                size: this.size
            }

            this.$http({
                url: this.$http.adornUrl(`/corp/user/collection/page`),
                method: "get",
                params: this.$http.adornParams(params)
            }).then(({ data }) => {
                this.prodFavList = data.records
                // this.page.total = data.total
                this.pages = data.pages
                this.current = data.current
                // 给每一个列表初始化一个未选中状态
                for (let index = 0; index < data.records.length; index++) {
                    this.prodFavList[index].isCheck = false
                }
            })
        },
        getSearchProdPage() {
            if (this.favType == 1) {
                this.favType = 1
                this.search()
            } else if (this.favType == 2) {
                this.favType = 2
                this.search()
            }
        },
        /**
         * 获取店铺收藏列表
         */
        getFavShopList() {
            let params = {
                current: this.current,
                size: this.size
            }

            this.$axios.get("/corp/shop/collection/page", { params }).then(({ data }) => {
                this.shopFavList = data.records
                this.pages = data.pages
                this.current = data.current
                // 给每一个列表初始化一个未选中状态
                for (let index = 0; index < data.records.length; index++) {
                    this.shopFavList[index].isCheck = false
                }
            })
        },
        /**
         * 获取商品收藏的数量
         */
        getFavProdNum() {
            this.$axios.get("/corp/user/collection/count").then(({ data }) => {
                this.prodFavNum = data
            })
        },
        /**
         * 获取店铺收藏的数量
         */
        getFavShopNum() {
            this.$axios.get("/corp/shop/collection/count").then(({ data }) => {
                this.shopFavNum = data
            })
        },
        newCurrent() {
            this.current = 1
            this.search()
        },
        /**
         * 搜索
         */
        search() {
            if (this.favType == 1) {
                let params = {
                    prodName: this.prodNameSearch,
                    prodType: this.prodTypeSearch,
                    current: this.current,
                    size: this.size
                }
                this.$axios.get("/corp/user/collection/page", { params }).then(({ data }) => {
                    this.prodFavList = data.records
                    ;(this.current = data.current), (this.pages = data.pages)
                    // 给每一个列表初始化一个未选中状态
                    for (let index = 0; index < data.records.length; index++) {
                        this.prodFavList[index].isCheck = false
                    }
                })
            } else if (this.favType == 2) {
                let params = {
                    shopName: this.prodNameSearch,
                    current: this.current,
                    size: this.size
                }
                this.$axios.get("/corp/shop/collection/page", { params }).then(({ data }) => {
                    this.shopFavList = data.records
                    ;(this.current = data.current), (this.pages = data.pages)
                    // 给每一个列表初始化一个未选中状态
                    for (let index = 0; index < data.records.length; index++) {
                        this.shopFavList[index].isCheck = false
                    }
                })
            }
        },
        /**
         * 去购买或者进入店铺
         */
        addProdCartOrIntoShop(id, status) {
            if (this.favType == 1) {
                // 去购买
                this.toProdDetail(id, status)
            } else if (this.favType == 2) {
                // 进入店铺
                this.toShopDetail(id)
            }
        },
        /**
         * 跳转到商品详情页
         */
        toProdDetail(prodId, status) {
            // status -1:删除、0:商家下架、1:上架、2:违规下架、3:平台审核
            if (status == 1) {
                this.$router.push({ path: "/detail/" + prodId })
            } else {
                this.$message({
                    message: "该商品已不能购买",
                    type: "warning",
                    duration: 1500
                })
            }
            // this.$router.push({ path: '/detail/' + prodId })
        },
        /**
         * 跳转到店铺页
         */
        toShopDetail(shopId) {
            this.$router.push({ path: "/shopIndex?sid=" + shopId })
        },
        /**
         * 取消收藏
         */
        cancelFav() {
            console.log(this.id)
            // 取消商品收藏
            if (this.favType == 1) {
                var prodId = this.id

                this.$http({
                    url: this.$http.adornUrl(`/corp/user/collection/addOrCancel`),
                    method: "post",
                    data: this.$http.adornData(prodId, false)
                }).then(({ data }) => {
                    this.getFavProdList()
                    this.getFavProdNum()
                })
            }
        },
        /**
         * 批量取消收藏
         */
        batachCancel() {
            // this.isBatchEdit = false
            // if (this.favType == 1) {
            //     // 商品批量取消收藏
            //     this.$axios.post("/corp/user/collection/batachCancel", this.prodIds).then(({ data }) => {
            //         this.getFavProdList()
            //         this.getFavProdNum()
            //         this.overManager()
            //         // window.location.href = this.url // 刷新页面
            //         // this.$set(this.prodFavList, this.prodFavList) // 刷新页面部分数据
            //     })
            // } 
        },
        /**
         * 确认取消收藏
         */
        confirmCancel() {
            if (this.type == 1) {
                this.cancelFav() //取消收藏
            } else if (this.type == 2) {
                this.batachCancel() //批量取消收藏
            }
            this.visible = false
        },
        /**
         * 提示弹窗显示
         */
        showPopup(id) {
            if (id) {
                this.id = id
                this.type = 1
                this.visible = true
            } else {
                this.type = 2
                if (this.favType == 1) {
                    // 获取到批量提交的数据
                    let prodIds = []
                    for (let index = 0; index < this.prodFavList.length; index++) {
                        if (this.prodFavList[index].isCheck) {
                            prodIds.push(this.prodFavList[index].prodId)
                        }
                    }
                    this.prodIds = prodIds
                    if (prodIds.length < 1) {
                        this.overManager()
                        return
                    } else {
                        this.visible = true
                    }
                } else if (this.favType == 2) {
                    let shopIds = []
                    for (let index = 0; index < this.shopFavList.length; index++) {
                        if (this.shopFavList[index].isCheck) {
                            shopIds.push(this.shopFavList[index].shopId)
                        }
                    }
                    this.shopIds = shopIds
                    if (shopIds.length < 1) {
                        this.overManager()
                        return
                    } else {
                        this.visible = true
                    }
                }
            }
        },
        /**
         * 提示弹窗隐藏
         */
        closePopup() {
            this.visible = false
        },
        /**
         * 点击开启 批量管理
         */
        batchManager($event) {
            this.isBatchEdit = true
        },
        /**
         * 完成批量管理
         */
        overManager() {
            this.isBatchEdit = false
            this.checkAllData = false
            if (this.favType === 1) {
                for (let index = 0; index < this.prodFavList.length; index++) {
                    this.prodFavList[index].isCheck = false
                }
            } else if (this.favType === 2) {
                for (let index = 0; index < this.shopFavList.length; index++) {
                    this.shopFavList[index].isCheck = false
                }
            }
        },
        /**
         * 点击选中 未完成
         */
        selectIt(id, index) {
            if (!this.isBatchEdit) {
                return
            }
            if (this.favType === 1) {
                this.prodFavList[index].isCheck = !this.prodFavList[index].isCheck
                this.$set(this.prodFavList, index, this.prodFavList[index])
            } else if (this.favType === 2) {
                this.shopFavList[index].isCheck = !this.shopFavList[index].isCheck
                this.$set(this.shopFavList, index, this.shopFavList[index])
            }
        },
        /**
         *  全选事件
         */
        checkAll() {
            if (this.checkAllData) {
                this.checkAllData = false
            } else {
                this.checkAllData = true
            }
            // 全选商品
            if (this.favType === 1) {
                this.selectAll(this.prodFavList, !this.checkAllData)
            } else if (this.favType === 2) {
                this.selectAll(this.shopFavList, !this.checkAllData)
            }
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
         * 勾选/取消全选商品
         */
        selectAll(data, isChecked) {
            if (isChecked) {
                for (let index = 0; index < data.length; index++) {
                    data[index].isCheck = false
                }
            } else {
                for (let index = 0; index < data.length; index++) {
                    data[index].isCheck = true
                }
            }
            if (this.favType == 1) {
                this.prodFavList = data
            } else if (this.favType == 2) {
                this.shopFavList = data
            }
        }
    },
    watch: {
        favType() {
            this.current = 1
            this.getFavList()
        },
        prodTypeSearch() {
            this.search()
        }
    }
}
</script>

<style scoped src="../css/uc-collection.css"></style>
<style scoped src="../css/user-center.css"></style>
<style scoped>
.el-pagination {
    text-align: right;
    padding: 0 30px;
    padding-top: 20px;
}
.pagination .el-pagination button,
.el-pagination span:not([class*="suffix"]) {
    padding: 0 8px !important;
}
.pagination .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
    background-color: #fff !important;
}
.pagination .el-pagination__editor.el-input .el-input__inner {
    width: 30px !important;
}
</style>
