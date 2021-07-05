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
    <el-dialog title="可分配教师" :close-on-click-modal="false" :visible.sync="visible">
      <el-table :data="teachersList" style="width: 100%" size="small" @current-change="handleSelectionChange" height="450">
        <el-table-column label="选择" width="55">
          <template slot-scope="scope">
            <el-radio v-model="curentselect" :label="scope.row"><i></i></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <el-image style="width: 50px; height: 50px" :src="scope.row.headImg" fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="empName" label="姓名"> </el-table-column>
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
        <el-button size="small" @click="visible = false">取消</el-button>
        <el-button size="small" type="primary" @click="addTeacher()">完成分配</el-button>
      </span>
    </el-dialog>

    <!--    {
      corpUserId: 14,
      empName: "尹冰鑫",
      headImg: "https://janbird-img.mayuwl.com/bf361f4abefb4f55ac08e436c738dfb6.png",
      postInfo: "教师",
      schoolInfo: "君行",
      sex: 0,
      userName: "15182514404",
    }, {
      corpUserId: 15,
      empName: "尹冰鑫",
      headImg: "https://janbird-img.mayuwl.com/bf361f4abefb4f55ac08e436c738dfb6.png",
      postInfo: "教师",
      schoolInfo: "君行",
      sex: 0,
      userName: "15182514404",
    }, {
      corpUserId: 16,
      empName: "尹冰鑫",
      headImg: "https://janbird-img.mayuwl.com/bf361f4abefb4f55ac08e436c738dfb6.png",
      postInfo: "教师",
      schoolInfo: "君行",
      sex: 0,
      userName: "15182514404",
    } -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        teachersList: [],
        liveId: "",
        orderId: "",
        userId: "14",
        multipleSelection: [],
        curentselect: {}
      }
    },
    watch: {

    },
    methods: {
      handleSelectionChange(val) {
        this.curentselect = val
      },
      init(item) {
        this.liveId = item.liveId
        this.orderId = item.orderId;
        this.visible = true
        this.getTeacherList()
      },
      getTeacherList() {
        this.$http({
          url: this.$http.adornUrl(`/corp/live/teacherlist`),
          method: "get",
          params: this.$http.adornParams({
            liveId: this.liveId
          })
        }).then(({
          data
        }) => {
          this.teachersList = data;
        })
      },


      dataFormSubmit() {
        this.visible = false
        this.$emit("refreshDataList")
      },
      addTeacher() {
        this.$http({
          url: this.$http.adornUrl(`/corp/live/distribute/${this.orderId}/${this.curentselect.corpUserId}`),
          method: "get",
          data: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.visible = false;
              this.$emit("refreshDataList")

            }
          })
        })
      }
    }
  }
</script>
