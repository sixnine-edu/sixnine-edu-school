<template>
  <div class="jd-balance">
    <div class="trading-record">
      <div class="blue"></div>
      <span class="record-txt">余额</span>
    </div>
    <!-- 店铺余额栏 -->
    <div class="balance-wrapper">
      <div class="balance-item">
        <div class="balance-item-title">
          <span class="title-tips">账户余额(元)</span>
        </div>
        <div class="balance-show">
          <span class="balance-num">{{balanceAmount}}</span>
          <!--   <span class="weak-btn" @click="applyWithdrawCash">提现</span> -->
        </div>
      </div>

    </div>
    <!-- 余额明细额栏 -->
    <div class="trading-record clearfix">
      <div class="blue"></div>
      <span class="record-txt">交易明细</span>
    </div>
    <avue-crud ref="crud"  v-loading="dataListLoading" :page="page" :data="dataList" :option="tableOption" @search-change="searchChange"
      @refresh-change="refreshChange" @on-load="getDataList">
      <template slot="search">
        <el-form :inline="true">
          <el-form-item label="查询日期" class="data-form">
            <el-date-picker size="small" v-model="dateRange" type="daterange" range-separator="至" value-format="yyyyMMdd"
              start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="setDateRange(1)">今天</el-button>
            <el-button size="small" @click="setDateRange(2)">昨天</el-button>
            <el-button size="small" @click="setDateRange(3)">近七天</el-button>
            <el-button size="small" @click="setDateRange(4)">近30天</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot-scope="scope" slot="ioType">
        <el-tag v-if="scope.row.ioType == 0" size="small" type="danger">支出</el-tag>
        <el-tag v-else-if="scope.row.ioType == 1" size="small" type="success">收入</el-tag>
      </template>
    </avue-crud>

  </div>
</template>

<script>
  import {
    tableOption
  } from '@/crud/user/balance'
  export default {
    data() {
      return {
        dataForm: {
          discountName: ''
        },
        dateRange: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        searchForm: {},
        dataListLoading: false,
        offlineEventHandleVisible: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        tableOption: tableOption,
        balanceAmount: 0,
        loading:false

      }
    },
    components: {

    },
    mounted() {
      this.getUnionBalance();
    },
    methods: {
      dateChange(date) {
        console.log(date)
      },
      async getUnionBalance() {
        let res = await this.$http({
          url: this.$http.adornUrl('/corp/user/ext'),
          method: 'get',
          params: this.$http.adornParams()
        })
        this.balanceAmount = res.data.balance;
      },
      // 获取数据列表
      getDataList(page) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/corp/balancelog/page'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign({
                current: page == null ? this.page.currentPage : page.currentPage,
                size: page == null ? this.page.pageSize : page.pageSize,
                'startDate': this.dateRange === null ? null : this.dateRange[0], // 开始时间
                'endDate': this.dateRange === null ? null : this.dateRange[1] // 结束时间
              },
              this.searchForm
            )
          )
        }).then(({
          data
        }) => {
          this.dataList = data.records
          this.page.total = data.total
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
      /**
       * 根据选项设置时间
       * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
       */
      setDateRange(val) {
        var startDay = null
        var endDay = null
        if (val === 1) {
          startDay = 0
          endDay = 0
        } else if (val === 2) {
          startDay = -1
          endDay = -1
        } else if (val === 3) {
          startDay = -6
          endDay = 0
        } else if (val === 4) {
          startDay = -29
          endDay = 0
        } else {
          return
        }
        // 开始时间
        var startTime = this.getTimeByDayNum(startDay)
        // 结束时间
        var endTime = this.getTimeByDayNum(endDay)
        this.dateRange = [startTime, endTime]
      },
      /**
       * 通过天数获取对应天数前的时间, 负数：多少天前, 正数：多少天后
       */
      getTimeByDayNum(dayNum) {
        var date = new Date()
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * dayNum)
        let mouth = date.getMonth() + 1 >= 10 ? (date.getMonth()+1) : '0' + (date.getMonth() + 1)
        let day = date.getDate() >= 10 ? date.getDate() : '0' + (date.getDate())
        var time = date.getFullYear() + '' + mouth + '' + day
        return time
      },
      // 条件查询
      searchChange(params) {
        this.searchForm = params
        this.page.currentPage = 1
        this.page.pageSize = 10
        this.getDataList(this.page)
      },


      /**
       * 刷新数据
       */
      refreshChange() {
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss">
  .jd-balance {

    .data-form {
      .el-form-item__content {
        width: 500px;
      }
    }

    .trading-record {
      display: block;
      background: #f7f8fa;
      margin: 10px 0;
      padding: 10px 20px;
    }

    .all-record {
      float: right;
    }

    .record-txt {
      vertical-align: middle;
      font-weight: bold;
    }

    .blue {
      display: inline-block;
      width: 3px;
      height: 1em;
      background: #02a1e9;
      vertical-align: middle;
      margin-right: 2px;
    }

    .balance-wrapper {
      display: flex;
      background: #f5f5f5;
      padding: 30px 30px;
      margin-bottom: 20px;
      justify-content: space-between;
    }

    .balance-item {
      display: inline-block;
    }

    .balance-item-title {
      padding-bottom: 25px;
    }

    .title-tips {
      vertical-align: middle;
    }

    .blue-font {
      color: #02a1e9;
      padding-left: 5px;
      cursor: pointer;
      vertical-align: middle;
    }

    .balance-show {
      text-align: left;
    }

    .balance-num {
      font-size: 28px;
      vertical-align: middle;
      margin-right: 30px;
    }

    .stress-btn,
    .weak-btn {
      font-size: 15px;
      padding: 6px 15px;
      border-radius: 3px;
      vertical-align: middle;
      border: 1px solid #02a1e9;
      cursor: pointer;
    }

    .stress-btn {
      color: #fff;
      background: #02a1e9;
      margin-right: 10px;
    }

    .weak-btn {
      color: #02a1e9;
    }

    .clearfix::after {
      display: block;
      content: "";
      visibility: hidden;
      height: 0;
      clear: both;
    }

  }
</style>
