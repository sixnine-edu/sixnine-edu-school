<template>
    <div class="addr-pop-con">
        <!-- 弹窗 -->
        <div class="popup-mask"></div>
        <div class="fix-transform-blur">
            <div class="popup-box">
                <!-- 新增地址 -->
                <div class="tit">
                    <div class="text" v-if="editAddrId">修改地址</div>
                    <div class="text" v-else>新增收件人信息</div>
                    <div class="close" @click="hidePop"></div>
                </div>
                <div class="con">
                    <div class="edit">
                        <div class="item error">
                            <div class="label">收件人：</div>
                            <div class="text-box">
                                <input type="text" class="input" v-model="addressForm.receiver" />
                                <div v-if="errTip == 1" class="error-text">收件人名称不能为空</div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">手机号码：</div>
                            <div class="text-box">
                                <input type="text" class="input" v-model="addressForm.mobile" maxlength="11" />
                                <div v-if="errTip == 2" class="error-text">手机号码不能为空</div>
                                <div v-if="errTip == 5" class="error-text">手机号码格式不对</div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">所在地区：</div>
                            <div class="text-box">
                                <div class="area-box">
                                    <!-- 省 -->
                                    <el-select v-model="addressForm.province" prop="province" placeholder="请选择" class="area" @change="selectProvince">
                                        <el-option v-for="province in provinceList" :key="province.areaId" :label="province.areaName" :value="province">{{
                                            province.areaName
                                        }}</el-option>
                                    </el-select>
                                    <!-- 市 -->
                                    <el-select v-model="addressForm.city" prop="city" class="area" @change="selectCity">
                                        <el-option v-for="city in cityList" :key="city.areaId" :label="city.areaName" :value="city">{{ city.areaName }}</el-option>
                                    </el-select>
                                    <!-- 区 -->
                                    <el-select v-model="addressForm.area" class="area" prop="area" @change="selectArea">
                                        <el-option v-for="area in areaList" :key="area.areaId" :label="area.areaName" :value="area">{{ area.areaName }}</el-option>
                                    </el-select>
                                </div>
                                <div v-if="errTip == 3" class="error-text">请您填写完整地区信息</div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">详细地址：</div>
                            <div class="text-box">
                                <input type="text" class="input" v-model="addressForm.addr" />
                                <div v-if="errTip == 4" class="error-text">请您填写详细地址</div>
                            </div>
                        </div>
                        <div class="item item-btn">
                            <div class="label-btn">&nbsp;</div>
                            <a href="javascript:void(0)" class="btn-r" @click="submitAddress">保存收件人信息</a>
                        </div>
                    </div>
                </div>
                <!-- /新增地址 -->
            </div>
        </div>
        <!-- /弹窗 -->
    </div>
</template>

<script>
import { checkPhoneNumber } from "@/utils/index"
export default {
    props: ["editAddrId"],
    data() {
        return {
            provinceList: [],
            cityList: [],
            areaList: [],
            addressForm: {
                receiver: "", // 收货人
                mobile: "", // 手机号
                addr: "", // 详细地址
                addrId: 0, // 地址ID
                province: "",
                provinceId: null,
                postCode: "",
                city: "",
                cityId: null,
                area: "",
                areaId: null
            },
            errTip: 0 // 错误提示: 1收件人 2手机号 3地区数据 4详细地址
        }
    },
    mounted() {
        this.init()
        if (this.editAddrId) {
            this.getAddrInfo(this.editAddrId)
        }
    },
    methods: {
        // 页面加载获取数据:省份数据
        init() {
            this.listAreaByParentId().then(({ data }) => {
                this.provinceList = data
            })
        },
        /**
         * 省市区
         */
        listAreaByParentId(pid) {
            if (!pid) {
                pid = 0
            }

            return this.$http({
                url: this.$http.adornUrl("/corp/area/listByPid"),
                method: "get",
                params: this.$http.adornParams({
                    pid
                })
            })
        },
        /**
         * 选择省
         */
        selectProvince(val) {
            // 设置省id
            this.addressForm.provinceId = val.areaId
            this.addressForm.province = val.areaName
            // 将市和区的值清除
            this.addressForm.cityId = null
            this.addressForm.city = ""
            this.addressForm.areaId = null
            this.addressForm.area = ""
            // 获取城市的select
            this.listAreaByParentId(this.addressForm.provinceId).then(({ data }) => {
                this.cityList = data
            })
        },
        /**
         * 选择市
         */
        selectCity(val) {
            // 设置市id
            this.addressForm.cityId = val.areaId
            this.addressForm.city = val.areaName
            // 将区域的值清除
            this.addressForm.areaId = null
            this.addressForm.area = ""
            // 获取区域的select
            this.listAreaByParentId(this.addressForm.cityId).then(({ data }) => {
                this.areaList = data
            })
        },
        /**
         * 选择区
         */
        selectArea(val) {
            // 设置区id
            this.addressForm.areaId = val.areaId
            this.addressForm.area = val.areaName
        },

        /**
         * 根据地址id获取地址信息
         */
        getAddrInfo(addrId) {
            this.$http({
                url: this.$http.adornUrl("/corp/addr/addrInfo/" + addrId),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.addressForm = data
                this.listAreaByParentId(data.provinceId).then(({ data }) => {
                    this.cityList = data
                })
                this.listAreaByParentId(data.cityId).then(({ data }) => {
                    this.areaList = data
                })
            })
        },

        /**
         * 更新/添加地址
         */
        submitAddress() {
            if (!this.addressForm.receiver.trim()) {
                this.errTip = 1
                return
            } else if (!this.addressForm.mobile.trim()) {
                this.errTip = 2
                return
            } else if (!checkPhoneNumber(this.addressForm.mobile)) {
                this.errTip = 5
                return
            } else if (!this.addressForm.provinceId || !this.addressForm.cityId || !this.addressForm.areaId) {
                this.errTip = 3
                return
            } else if (!this.addressForm.addr.trim()) {
                this.errTip = 4
                return
            } else {
                this.errTip = 0
            }
            let addrParam = {
                addrId: this.editAddrId ? this.editAddrId : 0,
                addr: this.addressForm.addr,
                area: this.addressForm.area,
                areaId: this.addressForm.areaId,
                city: this.addressForm.city,
                cityId: this.addressForm.cityId,
                mobile: this.addressForm.mobile,
                postCode: this.addressForm.postCode || "",
                province: this.addressForm.province,
                provinceId: this.addressForm.provinceId,
                receiver: this.addressForm.receiver
            }

            this.$http({
                url: this.$http.adornUrl(this.editAddrId ? "/corp/addr/updateAddr" : "/corp/addr/addAddr"),
                method: this.editAddrId ? "put" : "post",
                data: this.$http.adornData(addrParam)
            }).then(({ data }) => {
                this.$message({
                    message: "保存成功",
                    type: "success",
                    duration: 1000
                })
                this.$emit("getAddrList")
                this.$emit("toggleAddrPop", false)
            })
        },

        /**
         * 隐藏新增地址弹窗
         */
        hidePop() {
            this.$emit("toggleAddrPop", false)
        }
    }
}
</script>

<style>
.area .el-input__inner {
    margin: 0;
    padding: 0;
    height: unset;
    line-height: unset;
}
.area .el-scrollbar {
    width: 97px;
}
.area .el-input__suffix-inner {
    position: absolute;
    top: -10px;
    left: -18px;
}
.el-select-dropdown {
    z-index: 20005 !important;
}
.el-select-dropdown__item {
    padding: 0 20px !important;
}
.el-select-dropdown__item.selected {
    color: unset;
    font-weight: unset;
}
.el-select .area .el-select > .el-input {
    overflow: hidden;
}

/* 修复transform导致弹窗内容模糊问题 */
.fix-transform-blur {
    z-index: 10000;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
}
</style>
