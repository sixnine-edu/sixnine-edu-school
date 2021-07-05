<template>
    <div class="mod-shop-notice">
        <avue-crud
            ref="crud"
            :page="page"
            :data="dataList"
            :table-loading="dataListLoading"
            :option="tableOption"
            @search-change="searchChange"
            @on-load="getDataList"
            @refresh-change="refreshChange"
        >
            <template slot="menuLeft">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
            </template>
            <template slot-scope="scope" slot="menu">
                <el-button type="text" size="small"  @click="addOrUpdateHandle(scope.row.schoolId)">修改</el-button>
                <el-button type="text"  size="small" @click.stop="deleteHandle(scope.row.schoolId)">删除</el-button>
            </template>
        </avue-crud>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    </div>
</template>

<script>
import { tableOption } from "@/crud/basis/school"
import AddOrUpdate from "./school-add-or-update"
export default {
    data() {
        return {
            dataList: [],
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            },
            searchForm: {},
            dataListLoading: false,
            tableOption: tableOption,
            addOrUpdateVisible: false
        }
    },
    components: {
        AddOrUpdate
    },
    created() {},
    mounted() {},
    methods: {
        getDataList(page) {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl("/corp/school/page"),
                method: "get",
                params: this.$http.adornParams(
                    Object.assign(
                        {
                            current: page == null ? this.page.currentPage : page.currentPage,
                            size: page == null ? this.page.pageSize : page.pageSize
                        },
                        this.searchForm
                    )
                )
            }).then(({ data }) => {
                this.dataList = data.records
                this.page.total = data.total
                this.dataListLoading = false
            })
        },
        // 新增 / 修改
        addOrUpdateHandle(schoolId) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(schoolId)
            })
        },
        deleteHandle(schoolId) {
            this.$confirm("确定进行删除操作?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`/corp/school/delete/${schoolId}`),
                        method: "delete",
                        data: this.$http.adornData({})
                    }).then(({ data }) => {
                        this.$message({
                            message: "操作成功",
                            type: "success",
                            duration: 1500,
                            onClose: () => {
                                this.refreshChange()
                            }
                        })
                    })
                })
                .catch(() => {})
        },
        // 刷新回调用
        refreshChange() {
            this.page = this.$refs.crud.$refs.tablePage.defaultPage
            this.getDataList(this.page)
        },
        searchChange(params, done) {
            this.searchForm = params
            this.page.currentPage = 1
            this.page.pageSize = 10
            this.getDataList(this.page)
            done()
        }
    }
}
</script>

<style lang="scss" scoped></style>
