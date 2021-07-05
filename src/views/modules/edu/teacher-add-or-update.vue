<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-01-14 10:46:38
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-27 11:28:58
-->
<template>
    <div>
        <el-dialog title="当前课程教师" :close-on-click-modal="false" :visible.sync="visible">
            <div style="margin-bottom:10px">
                <el-button type="primary" @click="visible_1 = true">添加</el-button>
            </div>
            <el-table :data="ownersTeachers" style="width: 100%" size="small">
                <el-table-column label="头像">
                    <template slot-scope="scope">
                        <el-image style="width: 100px; height: 100px" :src="scope.row.headImg" fit="contain"></el-image>
                    </template>
                </el-table-column>
                <el-table-column fixed prop="empName" label="姓名"> </el-table-column>
                <el-table-column label="性别">
                    <template slot-scope="scope">
                        {{ scope.row.sex === 0 ? "女" : "男" }}
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户名"> </el-table-column>
                <el-table-column prop="postInfo" label="职位信息"> </el-table-column>
                <el-table-column prop="schoolInfo" label="校区信息"> </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="onRemove(scope.row.corpUserId)">解除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button size="small" @click="visible = false">取消</el-button> -->
                <el-button size="small" type="primary" @click="dataFormSubmit()">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog title="可分配教师" :close-on-click-modal="false" :visible.sync="visible_1">
            <el-table :data="teachersList" style="width: 100%" size="small" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column label="头像">
                    <template slot-scope="scope">
                        <el-image style="width: 100px; height: 100px" :src="scope.row.headImg" fit="contain"></el-image>
                    </template>
                </el-table-column>
                <el-table-column fixed prop="empName" label="姓名"> </el-table-column>
                <el-table-column label="性别">
                    <template slot-scope="scope">
                        {{ scope.row.sex == 0 ? "男" : "女" }}
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户名"> </el-table-column>
                <el-table-column prop="postInfo" label="职位信息"> </el-table-column>
                <el-table-column prop="schoolInfo" label="校区信息"> </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible_1 = false">取消</el-button>
                <el-button size="small" type="primary" @click="addTeacher()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            visible_1: false,
            ownersTeachers: [],
            teachersList: [],
            corpCourseId: "",
            multipleSelection: []
        }
    },
    watch: {
        visible_1(val) {
            if (val) {
                this.getTeacherList()
            }
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        init(corpCourseId) {
            this.corpCourseId = corpCourseId
            this.visible = true
            this.getOwnersList()
        },
        getTeacherList() {
            this.$http({
                url: this.$http.adornUrl(`/corp/course/teachers/${this.corpCourseId}`),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.teachersList = data
            })
        },
        getOwnersList() {
            this.$http({
                url: this.$http.adornUrl(`/corp/course/owners/${this.corpCourseId}`),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.ownersTeachers = data
            })
        },
        // 表单提交
        onRemove(corpUserId) {
            this.$confirm("确定进行解除课程操作?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl("/corp/course/delOwners"),
                    method: "put",
                    data: this.$http.adornData({
                        corpCourseId: this.corpCourseId,
                        corpUserIds: [corpUserId]
                    })
                }).then(({ data }) => {
                    this.$message({
                        message: "操作成功",
                        type: "success",
                        duration: 1500,
                        onClose: () => {
                            this.getOwnersList()
                        }
                    })
                })
            })
        },
        dataFormSubmit() {
            this.visible = false
            this.$emit("refreshDataList")
        },
        addTeacher() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: "至少勾选一个",
                    type: "info",
                    duration: 1500
                })
                return
            }
            let corpUserIds = this.multipleSelection.reduce((pre, cur) => {
                pre.push(cur.corpUserId)
                return pre
            }, [])
            this.$http({
                url: this.$http.adornUrl("/corp/course/saveOwners"),
                method: "post",
                data: this.$http.adornData({
                    corpCourseId: this.corpCourseId,
                    corpUserIds
                })
            }).then(({ data }) => {
                this.$message({
                    message: "操作成功",
                    type: "success",
                    duration: 1500,
                    onClose: () => {
                        this.visible_1 = false
                        this.getOwnersList()
                    }
                })
            })
        }
    }
}
</script>
