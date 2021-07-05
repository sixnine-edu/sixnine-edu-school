<template>
    <!-- 商品组件 -->
    <div class="list-con" :class="{ normalList: listType == 1 }">
        <div class="item" v-for="item in paleList" :key="item.prodId" @click="toProdDetail(item.prodId)">
            <!-- 团购（成团人数） -->
            <div class="group-number" v-if="item.groupNumber">{{ item.groupNumber }}人团</div>
            <div class="goods-img">
                <!-- 秒杀/热销商品图 -->
                <img v-if="item.pic" :src="item.pic" alt />
                <!-- 团购商品图 -->
                <img v-if="item.prodPic" :src="item.prodPic" alt />
            </div>
            <div class="goods-msg">
                <div class="goods-name">{{ item.prodName }}</div>
                <div class="goods-price">
                    <div class="price" v-if="item.price">
                        ￥
                        <span class="big">{{ parsePrice(item.price)[0] }}</span>
                        <span class="small">.{{ parsePrice(item.price)[1] }}</span>
                    </div>
                    <div v-else class="price">免费</div>
                    <s class="old-price">原价:{{ item.oriPrice }}</s>
                </div>
            </div>
        </div>
        <!-- 商品列表为空 -->
        <div class="empty" v-if="!paleList.length">
            <div class="img">
                <img src="../assets/img/emptyPic/not-found.png" alt />
            </div>
            <div class="action">
                <div class="text">很抱歉，没有相关商品</div>
            </div>
        </div>
        <!-- 商品列表为空 -->
    </div>
</template>

<script>
export default {
    props: {
        paleList: {
            type: Array, //指定传入的类型
            default: () => [] //这样可以指定默认的值
        },
        listType: {
            type: Number,
            default: 0
        }
    },
    methods: {
        /**
         * 处理价格样式
         */
        toPrice(val) {
            if (!val) {
                var val = Number(val)
                val = 0
            }
            // 截取小数点后两位，没有则自动补0
            return val.toFixed(2)
        },
        parsePrice(val) {
            var val = Number(val)
            if (!val) {
                val = 0
            }
            // 截取小数点后两位，并以小数点为切割点将val转化为数组
            return val.toFixed(2).split(".")
        },

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
        }
    }
}
</script>

<style scoped lang="scss">
.normalList {
    min-height: 440px;
}

.normalList .item {
    width: 275px;
}

.normalList .item .goods-img {
    width: 275px;
    height: 162px;
    line-height: 275px;
}

.normalList .empty {
    min-height: 380px;
}

.list-con {
    display: flex;
    flex-wrap: wrap;
    .item {
        position: relative;
        width: 285px;
        margin-top: 20px;
        margin-right: 20px;
        -moz-transition: all 0.2s;
        -webkit-transition: all 0.2s;
        -o-transition: all 0.2s;
        transition: all 0.2s;
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
        &:nth-child(4n) {
            margin-right: 0;
        }
        .goods-img {
            width: 285px;
            text-align: center;
            font-size: 0;
            img {
                  width: 285px;
            height: 162px;
                vertical-align: middle;
            }
        }
        .goods-msg {
            padding: 15px 10px 0;
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
                justify-content: space-between;
                height: 16px;
                line-height: 16px;
                margin-top: 10px;
                overflow: hidden;
                .old-price {
                    margin-left: 10px;
                    color: #999;
                    font-family: arial;
                    text-decoration: line-through;
                    height: 12px;
                    line-height: 12px;
                    margin-top: 3px;
                }
            }
        }
    }
}
</style>
