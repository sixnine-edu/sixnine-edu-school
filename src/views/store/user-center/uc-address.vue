<template>
    <div class="con-box address">
        <!-- 删除地址弹窗 -->
        <div class="popup-mask" v-if="showDelete"></div>
        <div class="popup-box" v-if="showDelete">
            <div class="tit">
                <div class="text">提示</div>
                <div class="close" @click="showDelete = false"></div>
            </div>
            <div class="con">
                <div class="tip">
                    <div class="tip-icon warning"></div>
                    <div class="tip-info">
                        <div class="result">确定要删除该收货地址吗？</div>
                        <div class="date">已删除的地址将不可恢复，请您谨慎考虑</div>
                        <div class="btns">
                            <a href="javascript:void(0)" class="btn-r" @click="deleteAddr()">删除</a>
                            <a href="javascript:void(0)" class="btn-g" @click="showDelete = false">取消</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 删除地址弹窗 -->
        <div class="add-address">
            <a href="javascript:void(0)" class="add-btn" @click="showAddOrUpdateDialog(0)">新增收货地址</a>
            <div class="add-limit">
                您已创建
                <span class="number">{{ this.userAddressList.length }}</span
                >个收货地址，最多可创建 <span class="number">10</span>个
            </div>
        </div>
        <div class="address-list" v-if="userAddressList.length">
            <div class="item" v-for="item in userAddressList" :key="item.addrId" :class="{ 'default-address': item.commonAddr }">
                <div class="item-row">
                    <div class="name">{{ item.receiver }}</div>
                    <div class="phone-number">{{ item.mobile }}</div>
                    <a href="javascript:void(0)" class="default-btn" @click="setDefault(item.addrId)">{{ item.commonAddr ? "默认" : "设为默认" }}</a>
                    <div class="action-box">
                        <span class="edit" @click="showAddOrUpdateDialog(1, item.addrId)"></span>
                        <span class="delete" @click="showDeleteDialog(item.addrId)"></span>
                    </div>
                </div>
                <div class="address-detail">{{ item.province + " " + item.city + " " + item.area + item.addr }}</div>
            </div>
        </div>
        <div class="empty" v-if="!userAddressList.length">
            <div class="img">
                <img src="../../../assets/img/emptyPic/address-empty.png" alt />
            </div>
            <div class="action">
                <div class="text">您还没有添加地址哦</div>
                <!-- <nuxt-link to="/" class="btn">回到首页</nuxt-link> -->
            </div>
        </div>
        <addOrEditAddress v-if="showAdd" ref="addOrUpdate" :editAddrId="editAddrId" @toggleAddrPop="refreshChange"></addOrEditAddress>
    </div>
</template>

<script>
import { _debounce } from "@/utils/index" //防抖
import addOrEditAddress from "@/components/add-or-edit-address"
export default {
    data() {
        return {
            userAddressList: [], //地址信息
            showDelete: false,
            deleteId: 0,
            editAddrId: 0,
            showAdd: false,
            loading: false
        }
    },
    components: {
        addOrEditAddress
    },
    mounted() {
        // 设置网页标题
        document.title = "收货地址"
        this.getUserAddr() // 获取用户地址信息
    },
    methods: {
        /**
         * 获取用户地址信息
         */
        getUserAddr() {
            this.$http({
                url: this.$http.adornUrl(`/crop/addr/list`),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.userAddressList = data
                // this.loading.close();
            })
        },

        //新增获取修改地址
        showAddOrUpdateDialog(st, addId) {
            if (st == 0) {
                if (this.userAddressList.length == 10) {
                    this.$message({
                        message: "新增收货地址已达到上限",
                        type: "warning",
                        duration: 1000
                    })
                    return
                }
            }
            this.editAddrId = addId
            this.showAdd = true
        },
        addNewAddr() {
            this.showAdd = false
        },

        /**
         * 设为默认地址
         */
        setDefault(addrId) {
            this.$http({
                url: this.$http.adornUrl("/crop/addr/defaultAddr/" + addrId),
                method: "put",
                data: this.$http.adornData()
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl(`/crop/addr/list`),
                    method: "get",
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    this.userAddressList = data
                })
            })
        },
        /**
         * 刷新回调
         */
        refreshChange(visible) {
            this.showAdd = visible
            // this.pages = this.$refs.crud.$refs.tablePage.defaultPage
            // 获取用户地址信息
            this.$http({
                url: this.$http.adornUrl(`/crop/addr/list`),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.userAddressList = data
            })
        },

        /**
         * 删除地址
         */
        showDeleteDialog(addrId) {
            this.showDelete = true
            this.deleteId = addrId
        },

        deleteAddr: _debounce(function() {
            this.$http({
                url: this.$http.adornUrl("/crop/addr/deleteAddr/" + this.deleteId),
                method: "delete",
                data: this.$http.adornData()
            }).then(({ data }) => {
                this.$http({
                    url: this.$http.adornUrl(`/crop/addr/list`),
                    method: "get",
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    this.userAddressList = data
                    this.showDelete = false
                })
            })
        }, 800)
    }
}
</script>

<style scoped src="../css/uc-address.css"></style>
<style>
.area .el-input__inner,
.el-input,
.el-input__prefix,
.el-input__suffix,
.el-select-dropdown__item,
.el-select-dropdown__empty {
    color: #000;
    font-size: 12px;
}

.el-select-dropdown {
    margin-left: -6px;
}

.address .popup-box .con .edit .item .btn-r {
    height: 16px;
}
</style>
