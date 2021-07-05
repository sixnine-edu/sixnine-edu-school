<template>
  <el-dialog
    title="修改用户收货地址"
    :modal="false"
    top="200px"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-alert title="请与用户协商一致后，再修改信息" type="warning" show-icon></el-alert>
      <br />
      <el-form-item label="收货人" prop="receiver">
        <el-input v-model="dataForm.receiver" placeholder="收货人姓名"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号码" maxlength="11" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="省份" prop="province">
        <el-col :span="8">
          <el-form-item prop="province">
            <el-select v-model="dataForm.provinceId" placeholder="请选择" @change="selectProvince">
              <el-option
                v-for="province in provinceList"
                :key="province.areaId"
                :label="province.areaName"
                :value="province.areaId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="city">
            <el-select v-model="dataForm.cityId" placeholder="请选择" @change="selectCity">
              <el-option
                v-for="city in cityList"
                :key="city.areaId"
                :label="city.areaName"
                :value="city.areaId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="area">
            <el-select v-model="dataForm.areaId" placeholder="请选择">
              <el-option
                v-for="area in areaList"
                :key="area.areaId"
                :label="area.areaName"
                :value="area.areaId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="详细地址" prop="addr">
        <el-input v-model="dataForm.addr" placeholder="详细地址"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitProds()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isMobile } from '@/utils/validate'
export default {
  data () {
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      order: null,
      dataForm: {
        addrOrderId: 0,
        addrId: 0,
        addr: '',
        receiver: '',
        mobile: '',
        area: '',
        city: '',
        province: '',
        areaId: null,
        cityId: null,
        provinceId: null
      },
      dataRule: {
        receiver: [
          { required: true, message: '收货人姓名不能为空', trigger: 'blur' }
        ],
        addr: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        city: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
        province: [
          { required: true, message: '省份不能为空', trigger: 'blur' }
        ],
        area: [{ required: true, message: '区/县不能为空', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      isTrue: false,
      errorInfo: '',
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  methods: {
    // 获取数据列表
    init (order) {
      let orderInfo = Object.assign({}, order)
      let userAddr = orderInfo.userAddrOrder
      this.order = orderInfo
      this.visible = true
      this.dataListLoading = true
      this.dataForm = userAddr
      this.listAreaByParentId().then(({ data }) => {
        this.provinceList = data
      })
      if (userAddr.provinceId && userAddr.cityId) {
        this.listAreaByParentId(userAddr.provinceId).then(({ data }) => {
          this.cityList = data
        })
        this.listAreaByParentId(userAddr.cityId).then(({ data }) => {
          this.areaList = data
        })
      }
      this.dataListLoading = false
    },
    listAreaByParentId (pid) {
      if (!pid) pid = 0
      return this.$http({
        url: this.$http.adornUrl(`/admin/area/listByPid`),
        method: 'get',
        params: this.$http.adornParams({ pid })
      })
    },
    // 选择省
    selectProvince (val) {
      this.dataForm.cityId = null
      this.dataForm.city = ''
      // 获取城市的select
      this.listAreaByParentId(val).then(({ data }) => {
        this.cityList = data
      })
    },
    // 选择市
    selectCity (val) {
      this.dataForm.areaId = null
      this.dataForm.area = ''
      // 获取区的select
      this.listAreaByParentId(val).then(({ data }) => {
        this.areaList = data
      })
    },
    getAddr () {
      for (let i = 0; i < this.provinceList.length; i++) {
        if (this.provinceList[i].areaId === this.dataForm.provinceId) {
          // 将省名字保存起来
          this.dataForm.province = this.provinceList[i].areaName
        }
      }
      for (let i = 0; i < this.cityList.length; i++) {
        if (this.cityList[i].areaId === this.dataForm.cityId) {
          // 将市名字保存起来
          this.dataForm.city = this.cityList[i].areaName
        }
      }
      for (let i = 0; i < this.areaList.length; i++) {
        if (this.areaList[i].areaId === this.dataForm.areaId) {
          // 将市名字保存起来
          this.dataForm.area = this.areaList[i].areaName
        }
      }
    },
    // 确定事件
    submitProds () {
      this.getAddr()
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/order/order/changeUserAddr`),
            method: 'put',
            data: this.$http.adornData({
              orderId: this.order.orderId,
              orderNumber: this.order.orderNumber,
              userAddrOrder: this.dataForm
            })
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshUserAddrOrder')
              }
            })
          })
        }
      })
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>
<style scoped>
.prods-select-body {
  height: auto;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
</style>
