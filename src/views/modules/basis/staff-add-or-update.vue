<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-01-14 10:46:38
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-26 17:17:52
-->
<template>
  <el-dialog :title="!dataForm.corpUserId ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
   <div class="stip">提醒:创建账号费用为{{oneFee}}元</div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">

      <el-form-item label="手机号" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="输入用户手机号"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="empName">
        <el-input v-model="dataForm.empName"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="headImg">
        <uploadFile @uploadedFile="uploadedFileSuccess" @deleteFile="onDeleteFile" :files="dataForm.headImg ? [dataForm.headImg] : []">
          <div slot="selectFile">
            <i class="el-icon-s-custom" style="font-size:80px;color:#999"></i>
          </div>
        </uploadFile>
        <div class="tip">温馨提示:200x200尺寸jpg或png,并且小于2M</div>
      </el-form-item>
      <el-form-item label="性别" size="mini" prop="sex">
        <el-radio-group v-model="dataForm.sex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="职位" size="mini" prop="postIds">
        <el-checkbox-group v-model="checkboxPostIds">
          <el-checkbox :label="`${item.postId}`" v-for="(item, index) in jobList" :key="item.postId">{{ item.postName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="校区" size="mini" prop="schoolIds">
        <el-checkbox-group v-model="checkboxSchoolIds">
          <el-checkbox :label="`${item.schoolId}`" v-for="(item, index) in schoolList" :key="item.schoolId">{{ item.schoolName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox :label="item.roleId" v-for="(item, index) in roleList" :key="item.roleId">{{ item.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="state">
        <el-radio-group v-model="dataForm.state">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import uploadFile from "@/components/uploadFile/index"

  export default {
    components: {
      uploadFile
    },
    data() {
      return {
        visible: false,
        dataForm: {
          userName: "", //手机号（用户名）
          empName: "", //姓名
          headImg: "", //头像
          sex: 0, //性别0-女 1-男
          postIds: "", //职位id,多选,设计图是单选，修改为多选
          schoolIds: "", //校区id,多选
          state: 1,
          roleIdList: []
        },
        checkboxPostIds: [],
        checkboxSchoolIds: [],
        checkboxRoleIdList: [],
        oneFee: 0,

        dataRule: {
          userName: [{
            required: true,
            message: "手机号不能为空",
            trigger: "blur"
          }],
          empName: [{
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          }],
          headImg: [{
            required: true,
            message: "头像不能为空",
            trigger: "blur"
          }],
          postIds: [{
            required: true,
            message: "职位不能为空",
            trigger: "blur"
          }],
          schoolIds: [{
            required: true,
            message: "校区不能为空",
            trigger: "blur"
          }],
          roleIdList: [{
            required: true,
            message: "角色不能为空",
            trigger: "blur"
          }],
          state: [{
            required: true,
            message: "校区不能为空",
            trigger: "blur"
          }]
        },
        schoolList: [],
        jobList: [],
        roleList: []
      }
    },
    watch: {
      checkboxPostIds(value) {
        this.dataForm.postIds = value.join(",")
      },
      checkboxSchoolIds(value) {
        this.dataForm.schoolIds = value.join(",")
      }
      // checkboxRoleIdList(value) {
      //     this.dataForm.roleIdList = value.join(",")
      // }
    },
    mounted() {
      this.getSchoolList()
      this.getJobList()
      this.getRoleList()
      this.getCreateOpt();
    },
    methods: {
      getCreateOpt() {
        this.$http({
          url: this.$http.adornUrl(`/corp/user/createOpt`),
          method: "get",
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          this.oneFee = data.oneFee;
        })
      },


      getRoleList() {
        this.$http({
          url: this.$http.adornUrl(`/corp/role/list`),
          method: "get",
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          this.roleList = data;
          // [
          //     { roleId: 1, roleName: "系统管理员", remark: "", menuIdList: null, createTime: "2021-02-25 10:49:28" },
          //     { roleId: 2, roleName: "课程研发部", remark: "", menuIdList: null, createTime: "2021-02-25 10:50:30" },
          //     { roleId: 3, roleName: "商城管理员", remark: "", menuIdList: null, createTime: "2021-02-25 10:50:53" }
          // ]
        })
      },
      getSchoolList() {
        this.$http({
          url: this.$http.adornUrl(`/corp/school/list`),
          method: "get",
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          this.schoolList = data
        })
      },
      getJobList() {
        this.$http({
          url: this.$http.adornUrl(`/corp/post/list`),
          method: "get",
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          this.jobList = data
        })
      },
      uploadedFileSuccess(key, cover) {
        this.dataForm.headImg = cover
      },
      onDeleteFile() {
        this.dataForm.headImg = ""
      },
      init(corpUserId) {
        this.dataForm.corpUserId = corpUserId || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs["dataForm"].resetFields()
          if (this.dataForm.corpUserId) {
            this.$http({
              url: this.$http.adornUrl(`/corp/user/userInfo/${this.dataForm.corpUserId}`),
              method: "get",
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              this.dataForm = data
              this.checkboxPostIds = data.postIds.split(",")
              this.checkboxSchoolIds = data.schoolIds.split(",")
              this.dataForm.roleIdList = data.roleIdList || []
            })
          } else {
            this.checkboxPostIds = []
            this.checkboxSchoolIds = []
            this.dataForm.roleIdList = []
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl("/corp/user/save"),
              method: this.dataForm.corpUserId ? "put" : "post",
              data: this.$http.adornData(this.dataForm)
            }).then(({
              data
            }) => {
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
<style lang="scss">
  .stip {
    padding: 12px 8px;
    background-color: rgba($color: #F56C6C, $alpha:0.1);
    border-radius: 4px;
    border-left: 5px solid #F56C6C;
    margin-bottom: 20px;
    
  }
</style>
