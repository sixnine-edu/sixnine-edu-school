<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-24 14:57:07
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-24 23:26:54
-->
<template>
    <div>
        <template>
            <el-table :data="tableData" style="width: 100%" size="small">
                <el-table-column label="图片" width="110px">
                    <template slot-scope="scope">
                        <el-image style="width: 100px; height: 100px" :src="scope.row.coverImg" fit="fit"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题"> </el-table-column>
                <el-table-column prop="liveTime" label="直播时间"> </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <template>
                            <el-button type="text" size="small" @click="jumpURL(scope.row.srcUrl)">查看</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: []
        }
    },
    async mounted() {
        let res = await this.$http({
            url: this.$http.adornUrl("/corp/teacher/lives"),
            method: "get",
            params: this.$http.adornParams()
        })
        this.tableData = res.data
    },
    methods: {
        jumpURL(url) {
            window.open(url, "_bank")
        }
    }
}
</script>

<style lang="scss" scoped></style>
