<template>
  <el-dialog
    :title="$t('product.select')"
    :modal="false"
    top="100px"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline">
      <el-form-item :label="$t('product.prodName')">
        <el-input
          v-model="prodName"
          :placeholder="$t('product.prodName')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.categoryParent')">
        <el-cascader
          expand-trigger="hover"
          :options="categoryList"
          :props="categoryTreeProps"
          :clearable="true"
          v-model="selectedCategory"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchProd" icon="el-icon-search">{{
          $t("coupon.query")
        }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="clean" icon="el-icon-delete">{{
          $t("coupon.empty")
        }}</el-button>
      </el-form-item>
    </el-form>
    <div class="prods-select-body">
      <el-table
        ref="prodTable"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectChangeHandle"
        style="width: 100%"
      >
        <el-table-column
          v-if="isSingle"
          width="50"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              <el-radio
                :label="scope.row.prodId"
                v-model="singleSelectProdId"
                @change.native="getSelectProdRow(scope.row)"
                >&nbsp;</el-radio
              >
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
          prop="prodName"
          header-align="center"
          align="center"
          :label="$t('coupon.productName')"
        ></el-table-column>
        <el-table-column align="center" width="140" :label="$t('product.pic')">
          <template slot-scope="scope">
            <img :src="scope.row.pic" width="100" height="100" />
          </template>
        </el-table-column>
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
      <el-button @click="visible = false">{{ $t("coupon.cancel") }}</el-button>
      <el-button type="primary" icon="el-icon-search" @click="submitProds()">{{
        $t("coupon.confirm")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate, idList } from '@/utils'
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
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      prodName: null,
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
      default: false,
      type: Boolean
    },
    dataUrl: {
      default: '/prod/prod/page',
      type: String
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    init (selectProds) {
      this.singleSelectProdId = 0
      this.selectProds = selectProds
      this.visible = true
      this.dataListLoading = true
      if (this.selectProds) {
        this.selectProds.forEach(row => {
          this.dataListSelections.push(row)
        })
      }
      this.getDataList()
      this.getCategoryList()
    },
    getCategoryList () {
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({
          maxGrade: 2
        })
      }).then(({ data }) => {
        this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
      })
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(this.dataUrl),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize,
              prodName: this.prodName ? this.prodName : null,
              categoryId: this.categoryId ? this.categoryId : null,
              status: 1
            }
            // {
            //   prodName: this.dataForm.prodName
            // }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.dataListLoading = false
        if (this.selectProds) {
          this.$nextTick(() => {
            this.selectProds.forEach(row => {
              let index = this.dataList.findIndex((prodItem) => prodItem.prodId === row.prodId)
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
     * 获取分类id
     */
    handleChange (val) {
      this.categoryId = val[val.length - 1]
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
      this.prodName = ''
      this.categoryId = null
      this.selectedCategory = idList(this.categoryList, this.categoryId, 'categoryId', 'children').reverse()
    },
    // 确定事件
    submitProds () {
      // 商品单选情况
      if (this.isSingle) {
        this.dataListSelections.length && this.$emit('refreshSelectProds', this.dataListSelections[0])
        // 商品多选情况
      } else {
        let prods = []
        this.dataListSelections.forEach(item => {
          let prodIndex = prods.findIndex((prod) => prod.prodId === item.prodId)
          if (prodIndex === -1) {
            prods.push({ prodId: item.prodId, prodName: item.prodName, pic: item.pic })
          }
        })
        this.$emit('refreshSelectProds', prods)
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
