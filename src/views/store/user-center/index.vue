<template>
  <div class="con-box home">
    <!-- 账户信息 -->
    <div class="my-info">
      <div class="info-box">
        <div class="portrait-box">
          <div class="portrait">
            <img :src="hadAvatar?userAvatar:defaultAvatar" alt />
          </div>
          <div class="edit" @click="uploadPic()">编辑资料</div>
        </div>
        <div class="name-box">
          <div class="name">{{nickName}}</div>
          <div class="level-box">
            <div class="text">等&nbsp;&nbsp;&nbsp;级：</div>
            <div
              class="level"
              :class="[(userLevel.level == 1) ? 'v1' : (userLevel.level == 2 ? 'v2' : 'v3')]"
            >{{userLevel.levelName}}</div>
          </div>
          <div class="level-box">
            <div class="text">成长值：</div>
            <div
              class="number"
              v-if="memberInfo.nextGrowth"
            >{{memberInfo.growth}}/{{memberInfo.nextGrowth}}</div>
            <div class="number" v-if="!memberInfo.nextGrowth">{{memberInfo.growth}}</div>
          </div>
        </div>
      </div>
      <div class="order-tab">
        <div class="item" @click="toOrderList(1)">
          <div class="img unpaid"></div>
          <div class="text">
            待支付
            <span class="number">{{orderCountData.unPay}}</span>
          </div>
        </div>
        <div class="item" @click="toOrderList(2)">
          <div class="img no-shipped"></div>
          <div class="text">
            待发货
            <span class="number">{{orderCountData.payed}}</span>
          </div>
        </div>
        <div class="item" @click="toOrderList(3)">
          <div class="img shipped"></div>
          <div class="text">
            已发货
            <span class="number">{{orderCountData.consignment}}</span>
          </div>
        </div>
        <div class="item" @click="toOrderList(5)">
          <div class="img no-reviewed"></div>
          <div class="text">
            已完成
            <span class="number">{{orderCountData.success}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- /账户信息 -->
    <div class="buy-member" @click="buyMember">
      <div class="text">
        <div class="big">开通付费会员，即刻尊享7大专属特权！</div>
        <div
          class="small"
        >现在开通付费会员最低￥{{memberPrice.needAmount}}元/{{['','日','周','月','季','年'][memberPrice.termType]}}起，超值优惠不容错过！</div>
      </div>
      <div class="btn">马上开通</div>
    </div>
    <!-- 我的订单 -->
    <div class="order-list">
      <div class="order-head">
        <span class="text">我的订单</span>
        <nuxt-link :to="{path:'/user-center/uc-order',params:{status:0}}" class="all">查看全部订单</nuxt-link>
      </div>
      <div class="order-table" v-if="orderList.length">
        <table cellspacing="0" cellpadding="0" class="box">
          <tbody>
            <tr class="box-tr" v-for="(order,index) in orderList" :key="index">
              <td>
                <div class="goods-info">
                  <nuxt-link
                    :to="(order.orderType==3?'member-center/integral-det/':'/detail/')+order.orderItemDtos[0].prodId"
                    class="img"
                  >
                    <img :src="order.orderItemDtos[0].pic" :alt="order.orderItemDtos[0].prodName" />
                  </nuxt-link>
                  <div class="name-sku">
                    <nuxt-link
                      :to="(order.orderType==3?'member-center/integral-det/':'/detail/')+order.orderItemDtos[0].prodId"
                      class="name"
                    >{{order.orderItemDtos[0].prodName}}</nuxt-link>
                    <span class="sku">{{order.orderItemDtos[0].skuName}}</span>
                  </div>
                </div>
              </td>
              <td class="br" width="117">
                <div class="goods-number">共{{order.orderItemDtos[0].prodCount}}件</div>
              </td>
              <td class="br" width="117">
                <div class="amount">
                  <span
                    class="price"
                  >￥{{parsePrice(order.actualTotal)[0]}}.{{parsePrice(order.actualTotal)[1]}}</span>
                </div>
              </td>
              <td class="br" width="117">
                <div class="status">
                  <div
                    class="text no-finish"
                  >{{['','待付款','待发货','待收货','待评价','已完成','已取消'][order.status]}}</div>
                </div>
              </td>
              <td width="117">
                <div class="action">
                  <a
                    href="javascript:void(0)"
                    @click="toOrderDetail(order.orderNumber)"
                    class="action-a"
                  >查看订单</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 空列表提示 -->
      <div class="order-table" v-if="!orderList.length">
        <table cellspacing="0" cellpadding="0" class="box">
          <tr class="box-tr">
            <div class="empty" v-if="!orderList.length">
              <div class="img">
                <img src="../../../assets/img/emptyPic/order-empty.png" alt />
              </div>
              <div class="action">
                <div class="text">暂无相关订单</div>
              
              </div>
            </div>
          </tr>
        </table>
      </div>
      <!-- /空列表提示 -->
    </div>
    <!-- /我的订单 -->
    <!-- 猜你喜欢 -->
    <!-- <div class="goods-list guess-like">
      <div class="guess-like-tit">
        <div class="text">猜你喜欢</div>
        <div class="swiper-controls">
          <i class="arrow limit">
            &lt;</i> <i class="arrow">>
          </i>
        </div>
      </div>
      <div class="list-con">
        <div class="item">
          <div class="goods-img"><img src="~/assets/img/goods-01.jpg"
                 alt=""></div>
          <div class="goods-msg">
            <div class="goods-name">自然共和国 芦荟舒缓保湿四件套</div>
            <div class="goods-price">
              <div class="price">￥<span class="big">159</span>.00</div>
              <div class="old-price">￥189.00</div>
            </div>
          </div>
        </div>
      </div>

    </div>-->
    <!-- /猜你喜欢 -->
  </div>
</template>

<script>
// import Cookie from 'js-cookie'
export default {
  data () {
    return {
      orderCountData: {}, // 订单详情数据
      nickName: '',
      current: 1,
      size: 10,
      orderList: [],
      hadAvatar: false,
      userAvatar: '',
      defaultAvatar: require('../../../assets/img/buyer-img.png'),
      memberInfo: {},  // 会员信息
      userLevel: {},  // 会员等级
      memberPrice: {}  //  付费会员价
    }
  },
  methods: {

    //获取会员信息
    getUserLevel () {
      this.$axios.get('/p/score/scoreLevel/page?levelType=' + 0).then(({ data }) => {
        this.memberInfo = data
        this.userLevel = data.userLevel
      })
    },

    //获取付费会员价格
    getMemberPrice () {
      // this.$axios.get('/p/score/scoreLevel/page?levelType=' + 1).then(({ data }) => {
      //   this.memberPrice = parseInt(data.userLevels[0].needAmount / data.userLevels[0].term)
      // })
      this.$axios.get('/p/score/scoreLevel/minAmountLevel').then(({ data }) => {
        this.memberPrice = data
      })
    },

    //去购买会员
    buyMember () {
      this.$router.push({ path: '/member-center/buy-member' })
    },

    /**
     * 获取订单数量
     */
    getUserInfo () {
      this.$axios.get('/p/user/centerInfo').then(({ data }) => {
        this.orderCountData = data.orderCountData
      })
    },

    /**
     * 获取订单列表
     */
    getOrderList () {
      let params = {
        current: 1,
        size: 10,
        status: 0
      }
      this.$axios.get('/p/myOrder/myOrder', { params }).then(({ data }) => {
        this.orderList = data.records
      })
    },
    /**
     * 跳转订单详情
     */
    toOrderDetail (orderNumber) {
      this.$router.push({ path: '/store/order-detail', query: { orderNumber: orderNumber } })
    },
    /**
     * 跳转订单列表
     */
    toOrderList (status) {
      this.$router.push({ path: '/user-center/uc-order', query: { status: status } })
    },
    /**
     * 跳转到账户信息
     */
    uploadPic () {
      this.$router.push({ path: '/user-center/uc-account', query: { status: status } })
    },
    /**
     * 价格处理
     */
    parsePrice: (value) => {
      var val = Number(value)
      if (!val) {
        val = 0;
      }
      // 截取小数点后两位，并以小数点为切割点将val转化为数组
      return val.toFixed(2).split(".");
    },
  },
  mounted () {
    // 设置网页标题
    document.title = '个人中心'
    this.getUserLevel()
    this.getMemberPrice()
    this.getUserInfo()
    this.getOrderList()
    this.nickName = localStorage.getItem('nickName')
    this.userAvatar = localStorage.getItem('userAvatar')
    this.hadAvatar = Boolean(localStorage.getItem('userAvatar'))
  }
}
</script>

<style scoped src='../css/uc-home.css'></style>
<style scoped src='../css/user-center.css'></style>
