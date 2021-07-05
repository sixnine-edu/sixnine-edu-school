<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-01-14 10:46:38
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-23 23:03:26
-->
<template>
    <el-dialog :title="!dataForm.postId ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
            <el-form-item label="职位名称" prop="postName">
                <el-input v-model="dataForm.postName"></el-input>
            </el-form-item>
           
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                postName: "", //职位名称
                 },
            dataRule: {
                postName: [{ required: true, message: "职位名称不能为空", trigger: "blur" }]
            }
        }
    },

    methods: {
        init(postId) {
            this.dataForm.postId = postId || 0
            this.visible = true
            this.$nextTick(() => {
                this.$refs["dataForm"].resetFields()
                if (this.dataForm.postId) {
                    this.$http({
                        url: this.$http.adornUrl(`/corp/post/info/${this.dataForm.postId}`),
                        method: "get",
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        this.dataForm = data
                    })
                }
            })
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl("/corp/post/save"),
                        method: this.dataForm.postId ? "put" : "post",
                        data: this.$http.adornData(this.dataForm)
                    }).then(({ data }) => {
                        this.$message({
                            message: "操作成功",
                            type: "success",
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.$emit("refreshDataList")
                            }
                        })
                    })
                }
            })
        }
    }
}
</script>
