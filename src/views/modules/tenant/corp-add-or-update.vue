<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-01-14 10:46:38
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-14 11:32:19
-->
<template>
    <el-dialog :title="!dataForm.corpId ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
            <el-form-item label="机构名称" prop="corpName">
                <el-input v-model="dataForm.corpName"></el-input>
            </el-form-item>

            <el-form-item label="联系人" prop="linkMan">
                <el-input v-model="dataForm.linkMan"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
                <el-input v-model="dataForm.mobile"></el-input>
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
                corpName: null,
                linkMan: "",
                mobile: ""
            },
            dataRule: {
                corpName: [{ required: true, message: "学校机构名称不能为空", trigger: "blur" }],
                linkMan: [{ required: true, message: "联系人", trigger: "blur" }],
                mobile: [{ required: true, message: "联系电话", trigger: "blur" }]
            }
        }
    },

    methods: {
        init(corpId) {
            this.dataForm.corpId = corpId || 0
            this.visible = true
            this.$nextTick(() => {
                this.$refs["dataForm"].resetFields()
                if (this.dataForm.corpId) {
                    this.$http({
                        url: this.$http.adornUrl(`/corp/corp/info/${this.dataForm.corpId}`),
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
                        url: this.$http.adornUrl("/corp/corp/save"),
                        method: this.dataForm.corpId ? "put" : "post",
                        data: this.$http.adornData(this.dataForm)
                    }).then(({ data }) => {
                        this.$message({
                            message: "操作成功",
                            type: "success",
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.$emit("refreshDataList")
                                this.dataForm.content = ""
                            }
                        })
                    })
                }
            })
        }
    }
}
</script>
