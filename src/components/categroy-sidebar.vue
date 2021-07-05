<template>
    <!-- 分类筛选 -->
    <div :class="['categroy', (fixedCate ? 'fixed' : '') || (notIndexFixed ? 'fixed2' : ''), notIndex ? 'shorttop' : '']">
        <div class="tit">分类筛选</div>
        <div class="con">
            <div
                class="item"
                v-for="(firstCategroy, index) in categoryList"
                :key="index"
                v-on:mouseover="onMenuTab(index, firstCategroy.categoryId)"
                v-on:mouseout="onMenuTabOut( index, firstCategroy.categoryId)"
            >
                <span class="name">{{ firstCategroy.categoryName }}</span>
                <div class="select">
                    <div v-for="(subCate, index) in subCategoryList" :key="index">
                        <div class="select-title">{{ subCate.categoryName }}</div>
                        <div class="select-item-wrapper">
                            <div
                                v-for="(threeCate, index) in subCate.children"
                                :key="index"
                                @click="toCateChange(firstCategroy.categoryId, subCate.categoryId, threeCate.categoryId)"
                                class="select-item"
                            >
                                <div class="item-name">{{ threeCate.categoryName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /分类筛选 -->
</template>

<script>
import { treeDataTranslate } from "@/utils"

export default {
    data() {
        return {
            backgroundPositionX: "backgroundPositionX",
            backgroundPositionY: "backgroundPositionY",
            fixedCate: false,
            categoryList: [], //父分类列表
            subCategoryList: [], //子分类列表
            notIndex: false, //当前非首页
            notIndexFixed: false, //当前非首页
            mouseoverEventList: [],
            mouseIndex: 0
        }
    },
    methods: {
        /**
         * 页面滚动事件
         */
        scrollToTop() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            if (window.location.pathname == "/") {
                this.fixedCate = scrollTop > 500 ? true : false
            } else {
                this.notIndexFixed = scrollTop > 130 ? true : false
            }
        },

        /**
         * 加载父分类列表
         */
        getCategoryList() {
            this.$http({
                url: this.$http.adornUrl("/corp/shop/categorys"),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.categoryList = treeDataTranslate(data, "categoryId", "parentId")
            })
        },

        /**
         * 分类点击事件，获取子分类
         */
        onMenuTab( index, id) {
            this.subCategoryList = this.categoryList[index].children
        },
        onMenuTabOut() {
            // var eventData = this.mouseoverEventList.shift()
            // // var eventData = this.mouseoverEventList[mouseIndex]
            // if (new Date().getTime() - eventData.eventTime < 100) {
            //     clearTimeout(eventData.timeout)
            // }
        },
        /**
         * 加载子分类列表
         */
        getProdList(categoryId) {
            this.$axios.get("/category/categoryInfo?parentId=" + categoryId).then(({ data }) => {
                this.subCategoryList = data
            })
        },
        /**
         * 跳转子分类商品页面 */
        toCateChange: function(parentId, categoryId, thCategoryId) {
            this.$emit("change",parentId, categoryId, thCategoryId)
            // this.$router.push({ path: "/list?cpid=" + parentId + "&cid=" + categoryId + "&thCid=" + thCategoryId })
        }
    },
    mounted() {
        // 监听页面滚动
        window.addEventListener("scroll", this.scrollToTop)
        this.getCategoryList() //一级分类列表
        //如果当前处在非首页，则分类侧栏增加一个class
        window.location.pathname != "/" ? (this.notIndex = true) : (this.notIndex = false)
    },
    destroyed() {
        // 页面销毁时移除监听
        window.removeEventListener("scroll", this.handleScroll)
    }
}
</script>

<style lang="scss">
/* 分类侧栏位置 */
.fixed {
    position: fixed;
    top: 130px;
}
.fixed2 {
    position: fixed;
    top: 100px;
}
@media (max-width: 1440px) {
    .categroy {
        left: 0;
        margin-left: 0;
    }
}
.categroy {
    width: 110px;
    left: 50%;
    top: 500px;
    margin-left: -732px;
    z-index: 98;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    display: block;
    opacity: 1;
    will-change: transform;
    transform: translateZ(0);
    border: 1px solid #eee;
    &.shorttop {
        top: 182px;
    }
    .tit {
        height: 40px;
        line-height: 40px;
        background: #f9f9f9;
        text-align: center;
        font-size: 14px;
        border-bottom: 1px solid #eee;
        font-weight: 600;
    }
    .con {
        text-align: center;
        padding-bottom: 15px;
        position: relative;
        &::after {
            display: block;
            content: " ";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            width: auto;
            height: 1px;
            margin: 0 15px;
            background: #eee;
        }
        .item {
            line-height: 24px;
            padding-top: 15px;
            position: relative;
            cursor: pointer;
            transition: all 0.2s;
            -webkit-transition: all 0.2s;
            &:hover {
                .name {
                    color: #e1251b;
                }
                .select {
                    visibility: unset;
                }
            }
            .icon {
                display: inline-block;
                vertical-align: top;
                width: 24px;
                height: 24px;
                font-size: 0;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .name {
                display: inline-block;
                vertical-align: top;
                margin-left: 5px;
            }
            .select {
                position: fixed;
                left: 130px;
                top: -1px;
                z-index: 24;
                min-height: 510px;
                border: 1px solid #eee;
                background: #fff;
                -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                flex-wrap: wrap;
                width: 900px;
                align-items: flex-start;
                align-content: flex-start;
                display: flex;
                visibility: hidden;
                box-sizing: border-box;
                border-radius: 3px;
                .select-title {
                    display: block;
                    font-size: 22px;
                    text-align: left;
                    padding: 20px;
                }
                &:before {
                    position: absolute;
                    left: -20px;
                    top: 0;
                    width: 20px;
                    height: 100%;
                    display: block;
                    content: " ";
                    background: transparent;
                }
                .select-item {
                    padding: 18px 20px;
                    text-align: left;
                    height: 40px;
                    display: flex;
                    .item-img {
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        font-size: 0;
                        margin-right: 10px;
                        vertical-align: top;
                        img {
                            width: 100%;
                            height: 100%;
                            vertical-align: top;
                        }
                    }
                    .item-name {
                        display: inline-block;
                        height: 40px;
                        line-height: 40px;
                        width: 110px;
                        -webkit-transition: color 0.2s;
                        transition: color 0.2s;
                    }
                    &:hover {
                        .item-name {
                            color: #e1251b;
                        }
                    }
                }
            }
            .select-item-wrapper {
                display: flex;
            }
        }
    }
    .phone-code {
        padding: 15px 0;
        text-align: center;
        .code {
            width: 100px;
            height: 100px;
            font-size: 0;
            margin: auto;
        }
    }
}
</style>
