<template>
  <el-dialog
    :title="this.$i18n.t('home.selOnlineCustomer')"
    :modal="false"
    top="100px"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline">
      <el-form-item :label="this.$i18n.t('home.userName')">
        <el-input v-model="userName" :placeholder="this.$i18n.t('home.userName')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchProd" icon="el-icon-search">{{$t("order.query")}}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="clean" icon="el-icon-delete">{{$t("order.clear")}}</el-button>
      </el-form-item>
    </el-form>
    <div class="prods-select-body">
      <el-table
        ref="prodTable"
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
                :label="scope.row.userId"
                v-model="singleSelectProdId"
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
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          :label="this.$i18n.t('home.userName')"
        ></el-table-column>
        <!-- <el-table-column
          prop="price"
          header-align="center"
          align="center"
          :label="this.$i18n.t('components.commodityPrice')"
          width="200px"
        ></el-table-column>-->
      </el-table>
      <!-- <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>-->
    </div>
    <span slot="footer">
      <el-button @click="visible = false">{{$t("crud.filter.cancelBtn")}}</el-button>
      <el-button type="primary" @click="submitProds()">{{$t("crud.filter.submitBtn")}}</el-button>
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
      singleSelectProdId: 0,
      allData: [],
      selectProds: [],
      dataList: [],
      userName: '',
      pageIndex: 1,
      isSubmit: false,
      pageSize: 10,
      bizUserId: null,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataListSelections: [],
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      }
    }
  },
  props: {
    isSingle: {
      default: true,
      type: Boolean
    },
    dataUrl: {
      default: '/p/platform/getOnLineCustomer',
      type: String
    }
  },
  activated () {
    this.visible = true
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    init (bizUserId) {
      this.visible = true
      this.bizUserId = bizUserId
      this.getDataList()
    },
    getDataList () {
      this.isSubmit = false
      this.$http({
        url: this.$http.adornImUrl(this.dataUrl),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              userName: this.userName ? this.userName : null
            }
          )
        )
      }).then(({ data }) => {
        this.dataList = data
        // this.totalPage = data.total
        this.dataListLoading = false
        if (this.selectProds) {
          this.$nextTick(() => {
            this.selectProds.forEach(row => {
              let index = this.dataList.findIndex((prodItem) => prodItem.userId === row.userId)
              this.$refs.prodTable.toggleRowSelection(this.dataList[index])
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
      this.dataListSelections = [row]
    },
    // 多选点击事件
    selectChangeHandle (selection) {
      this.dataList.forEach((tableItem) => {
        let selectedProdIndex = selection.findIndex((selectedProd) => {
          if (!selectedProd) {
            return false
          }
          return selectedProd.prodId === tableItem.prodId
        })
        let dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedProd) => dataSelectedProd.prodId === tableItem.prodId)
        if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
          this.dataListSelections.push(tableItem)
        } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
          this.dataListSelections.splice(dataSelectedProdIndex, 1)
        }
      })
    },
    /**
     * 根据条件搜索商品
     */
    searchProd () {
      this.pageIndex = 1
      this.getDataList()
    },
    /**
     * 清空搜索条件
     */
    clean () {
      this.userName = ''
    },
    // 确定事件
    submitProds () {
      console.log(this.dataListSelections)
      let info = this.dataListSelections[0]
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      this.$http({
        url: this.$http.adornImUrl('/p/platform/forwardMsg'),
        method: 'post',
        data: this.$http.adornData(
          Object.assign(
            {
              userId: info.userId,
              bizUserId: this.bizUserId
            }
          )
        )
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('remindPop.success'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshSelectProds')
          }
        })
      }).catch(() => {
        console.log('boom')
        this.isSubmit = false
      })
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
