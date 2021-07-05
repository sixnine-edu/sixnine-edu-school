<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-21 14:47:53
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-21 15:01:21
-->
<template>
    <div>
        <el-table :data="dataList" style="width: 100%">
            <el-table-column prop="mealName" label="套餐名称" width="180"> </el-table-column>
            <el-table-column prop="mealMoney" label="套餐价格" width="180"> </el-table-column>
            <el-table-column prop="diyFlag" label="是否是自定义金额"> 
                
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dataList: []
        }
    },
    async mounted() {
        let res = await this.$http({
            url: this.$http.adornUrl("/corp/meal/list"),
            method: "get",
            params: this.$http.adornParams()
        })
        this.dataList = res.data
    }
}
</script>

<style lang="scss" scoped></style>
