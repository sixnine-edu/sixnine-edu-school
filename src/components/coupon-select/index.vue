<template>
  <el-dialog
    title="选择优惠券"
    :modal="false"
    top="100px"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div class="prods-select-body">
      <el-table
        ref="couponTable"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectChangeHandle"
        style="width: 100%;"
      >
        <el-table-column v-if="isSingle" width="50" header-align="center" align="center">
          <template slot-scope="scope">
            <div>
              <el-radio
                :label="scope.row.couponId"
                v-model="singleSelectCouponId"
                @change.native="getSelectProdRow(scope.row)"
              >&nbsp;</el-radio>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isSingle"
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column prop="couponName" header-align="center" align="center" label="优惠券名称"></el-table-column>
        <el-table-column prop="subTitle" header-align="center" align="center" label="优惠券描述"></el-table-column>
        <el-table-column prop="getWay" header-align="center" align="center" label="优惠类型"></el-table-column>
        <el-table-column prop="limitNum" header-align="center" align="center" label="领券上限"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitProds()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        product: ''
      },
      singleSelectCouponId: 0,
      allData: [],
      selectCoupons: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  props: {
    isSingle: {
      default: false,
      type: Boolean
    },
    // 获取方式 null:默认（客户领取+平台发放） 0=客户领取 1=平台发放
    getWay: {
      default: null,
      type: Number
    },
    dataUrl: {
      default: '/platform/coupon/list',
      type: String
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    init (selectCoupons) {
      this.selectCoupons = selectCoupons
      this.visible = true
      this.dataListLoading = true
      this.selectCoupons = selectCoupons
      if (this.selectCoupons) {
        this.selectCoupons.forEach(row => {
          this.dataListSelections.push(row)
        })
      }
      this.getDataList()
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(this.dataUrl),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize
            },
            {
              prodName: this.dataForm.prodName,
              getWay: this.getWay
            }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.dataList.forEach(item => {
          // 平台投放 / 用户领取
          item.getWay = item.getWay === 1 ? this.$t('coupon.platformDistribution') : this.$t('coupon.userClaim')
        })
        this.totalPage = data.total
        this.dataListLoading = false
        if (this.selectCoupons) {
          this.$nextTick(() => {
            this.selectCoupons.forEach(row => {
              let index = this.dataList.findIndex((couponItem) => couponItem.couponId === row.couponId)
              this.$refs.couponTable.toggleRowSelection(this.dataList[index])
            })
          })
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 单选商品事件
    getSelectProdRow (row) {
      // console.log('aa')
      this.dataListSelections = [row]
    },
    // 多选点击事件
    selectChangeHandle (selection) {
      this.dataList.forEach((tableItem) => {
        let selectedProdIndex = selection.findIndex((selectedCoupon) => {
          if (!selectedCoupon) {
            this.dataListSelections = []
            return false
          }
          return selectedCoupon.couponId === tableItem.couponId
        })
        let dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedCoupon) => dataSelectedCoupon.couponId === tableItem.couponId)
        if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
          this.dataListSelections.push(tableItem)
        } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
          this.dataListSelections.splice(dataSelectedProdIndex, 1)
        }
      })
    },
    // 确定事件
    submitProds () {
      // 商品单选的情况
      if (this.isSingle) {
        this.dataListSelections.length && this.$emit('refreshSelectCouponList', this.dataListSelections[0])
        this.dataListSelections = []
        this.visible = false
        return
      }
      // 多选
      let coupons = []
      // console.log('this.dataListSelections', this.dataListSelections, this.dataListSelections.length < 1)
      if (this.dataListSelections.length < 1) {
        this.$emit('refreshSelectCouponList', [])
      } else {
        this.dataListSelections.forEach(item => {
          let couponIndex = coupons.findIndex((coupon) => coupon.couponId === item.couponId)
          if (couponIndex === -1) {
            coupons.push({ couponId: item.couponId, couponName: item.couponName, subTitle: item.subTitle, limitNum: item.limitNum })
          }
        })
        this.$emit('refreshSelectCouponList', coupons)
      }

      this.dataListSelections = []
      this.visible = false
    }
  }
}
</script>
<style scoped>
.prods-select-body {
  height: 600px;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
</style>
