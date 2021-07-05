<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-12-23 14:30:36
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-29 17:51:07
-->
<template>
  <div>
    <div class="site-navbar store-navbar__body">
      <el-menu mode="horizontal" default-active="1">
        <el-menu-item> <img src="../assets/img/login-logo.png" width="80px" style="margin:0 50px" /></el-menu-item>
        <el-menu-item v-for="(item, index) in menuList" :key="index" :index="getMenuIndex(item)" @click="toURL(item)">
          {{ item.name }}
        </el-menu-item>
      </el-menu>
      <div style="padding-right: 20px;display: flex;align-items: center;">
        <el-button size="mini" class="peixun" v-if="$route.fullPath.indexOf('/college')>-1" @click="toMyTrain">我的培训
        </el-button>
        <template v-if="$route.fullPath.indexOf('/store')>-1">
          <el-button size="mini" class="peixun" @click.native="toOrder">我的订单</el-button>
          <el-button size="mini" class="peixun" @click.native="toCart">购物车({{ totalCartCount }})</el-button>
        </template>
        <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
          <el-menu-item class="site-navbar__avatar">
            <el-dropdown :show-timeout="0" placement="bottom">
              <span class="el-dropdown-link">{{ empName }}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="logoutHandle()">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
        </el-menu>
      </div>

    </div>
    <router-view class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }"></router-view>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <el-popover placement="left" trigger="hover">
      <div class="cus-block">
        <div class="cus-item" v-for="(item,index) in customerSerList" :key="index">
          <div class="info-box">
            <img class="avatar" :src="item.headImg" />
            <div>
              <div class="name">{{item.nickName}}</div>
              <div class="phone">{{item.tellQqWx}}</div>
            </div>
          </div>
          <div class="qr">
            <img class="qr-img" :src="item.qrCode" />
          </div>
          <div class="desc">{{item.info}}</div>
        </div>
      </div>
      <div class="cus-layer-box" slot="reference">
        <img class="icon_customer" src="../assets/img/icon_customer.png" />
      </div>
    </el-popover>
  </div>
</template>
<script>
  import UpdatePassword from "./main-navbar-update-password"
  import {
    clearLoginInfo
  } from "@/utils"
  export default {
    data() {
      return {
        activeIndex: "1",
        activeIndex2: "1",
        updatePassowrdVisible: false,
        customerSerList: []
      }
    },
    components: {
      UpdatePassword
    },
    computed: {
      topNavList() {
        return [{
            title: "学校管理",
            url: "#/school/index",
            name: "school"
          },
          {
            title: "在线商城",
            url: "#/store/index",
            name: "store"
          },
          {
            title: "校长首页",
            url: "#/headmaster/index",
            name: "headmaster"
          },
          {
            title: "备授课",
            url: "#/course/index",
            name: "course"
          },
          {
            title: "直播培训",
            url: "#/live/index",
            name: "live"
          }
        ]
      },
      totalCartCount() {
        return this.$store.state.cartNumber.cartNumbers
      },
      documentClientHeight: {
        get() {
          return this.$store.state.common.documentClientHeight
        },
        set(val) {
          this.$store.commit("common/updateDocumentClientHeight", val)
        }
      },
      navbarLayoutType: {
        get() {
          return this.$store.state.common.navbarLayoutType
        }
      },
      sidebarFold: {
        get() {
          return this.$store.state.common.sidebarFold
        },
        set(val) {
          this.$store.commit("common/updateSidebarFold", val)
        }
      },
      mainTabs: {
        get() {
          return this.$store.state.common.mainTabs
        },
        set(val) {
          this.$store.commit("common/updateMainTabs", val)
        }
      },
      userId: {
        get() {
          return this.$store.state.user.id
        },
        set(val) {
          this.$store.commit("user/updateId", val)
        }
      },
      empName: {
        get() {
          return this.$store.state.user.empName
        },
        set(val) {
          this.$store.commit("user/updateEmpName", val)
        }
      },
      userName: {
        get() {
          return this.$store.state.user.userName
        },
        set(val) {
          this.$store.commit("user/updateUserName", val)
        }
      },
      menuList: {
        get() {
          return this.$store.state.common.menuList.filter(item => {
            return !item.icon
          })
        },
        set(val) {
          this.$store.commit("common/updateMenuList", val)
        }
      }
    },
    created() {
      this.menuList = JSON.parse(sessionStorage.getItem("menuList") || "[]")
    },
    mounted() {
      this.getCartCount()
      this.resetDocumentClientHeight()
      this.getUserInfo()
      this.getCustomerSerList();
      let fullPath = this.$route.fullPath
      let result = this.menuList.find(item => {
        return fullPath.match(`\/(${item.url})\/`)
      })
      if (fullPath == '/') {
        let url = this.menuList[0].url;
        this.$router.replace({
          path: `/${url}`
        })
      }


      console.log("==========result", result)
    },
    methods: {
      getCustomerSerList() {
        this.$http({
          url: this.$http.adornUrl(`/corp/master/customerSer/0`), //customerserType:0-客服 1-顾问
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.customerSerList = data;
        })
      },
      // 获取当前管理员信息
      getUserInfo() {
        this.$http({
          url: this.$http.adornUrl("/corp/user/info"),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.loading = false
          this.userId = data.corpUserId
          this.empName = data.empName
          this.userName = data.userName
        })
      },
      toURL({
        url
      }) {
        // this.$route.push({)
        // window.open(url)
        window.location.href = "#/" + url
      },
      getMenuIndex(item) {
        let fullPath = this.$route.fullPath
        let match = fullPath.match(`\/(${item.url})\/`)
        if (match) {
          return "1"
        }
      },
      // 重置窗口可视高度
      resetDocumentClientHeight() {
        this.documentClientHeight = document.documentElement["clientHeight"]
        window.onresize = () => {
          this.documentClientHeight = document.documentElement["clientHeight"]
        }
      },
      handleSelect(key, keyPath) {},
      /**
       * 获取购物车商品总数
       */
      getCartCount() {
        this.$http({
          url: this.$http.adornUrl(`/corp/shopcart/prodCount`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.$store.commit("cartNumber/changeCartNumber", data)
        })
      },
      toCart() {
        this.$router.push({
          name: "storeCart"
        })
      },
      toOrder() {
        this.$router.push({
          path: "/store/user-center/uc-order"
        })
      },
      toMyTrain() {
        this.$router.push({
          name: "collegeMyTrain"
        })
      },
      // 修改密码
      updatePasswordHandle() {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      switchLang(lang) {
        localStorage.setItem("lang", lang)
        window.location.reload()
      },
      // 退出
      logoutHandle() {
        this.$confirm(this.$i18n.t("homes.isExit"), this.$i18n.t("text.tips"), {
            confirmButtonText: this.$i18n.t("homes.confirm"),
            cancelButtonText: this.$i18n.t("homes.cancel"),
            type: "warning"
          })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl("/corp/user/logout"),
              method: "post",
              data: this.$http.adornData()
            }).then(({
              data
            }) => {
              clearLoginInfo()
              this.$router.push({
                name: "login"
              })
            })
          })
          .catch(() => {})
      }
    }
  }
</script>

<style lang="scss">
  .cus-layer-box {
    padding: 12px 8px;
    position: fixed;
    right: 10px;
    box-shadow: 0 0 4px #ccc;
    bottom: 30px;
    border-radius: 5px;
    z-index: 10;
    background: #FFFFFF;

    .icon_customer {
      width: 30px;
      cursor: pointer;
    }
  }

  .cus-block {
    .cus-item {
      padding: 10px 20px;
      margin-top: 20px;

      .info-box {
        display: flex;
        align-items: center;

        .avatar {
          width: 46px;
          height: 46px;
          border-radius: 100px;
          background: #fafafa;
        }

        >div {
          font-size: 15px;
          color: #222;
          padding-left: 10px;

          .name {}

          .phone {
            margin-top: 5px;
          }
        }
      }

      .qr {
        text-align: center;
        padding: 20px 0;

        .qr-img {
          width: 160px;
          height: 160px;
        }
      }

      .desc {
        font-size: 14px;
        color: #999;
        text-align: center
      }
    }
  }

  .peixun {
    border-color: #979797;
    color: #222222;
  }

  .store-navbar__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px #e6e6e6;
    width: 100%;
    background: #fff;
  }

  .app-content {
    width: 1200px;
    margin: auto;

    .page-container {
      padding: 20px;
    }
  }

  .price {
    font-family: arial;
    font-size: 14px;
    color: #e1251b;
    display: flex;
    align-items: baseline;
  }

  .price .big {
    font-size: 18px;
  }

  .price .small {
    font-size: 14px;
  }

  a {
    outline: none;
    text-decoration: none;
    color: #000;
  }

  a:hover {
    text-decoration: none;
  }

  /* 空页面 */

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 0;
    width: 100%;
  }

  .empty .img {
    width: 250px;
    height: 200px;
    font-size: 0;
  }

  .empty .img img {
    width: 100%;
    height: 100%;
  }

  .empty .action {
    margin-left: 10px;
  }

  .empty .action .text {
    color: #999;
    font-size: 14px;
    margin-top: 40px;
  }

  .empty .action .btn {
    display: inline-block;
    // padding: 7px 20px;
    background: #e1251b;
    border-radius: 30px;
    color: #fff;
    margin-top: 20px;
  }

  /* 空页面 end */

  /* 弹窗 */

  .popup-mask {
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 1998;
    background-color: rgba(0, 0, 0, 0.15);
    width: 100%;
    height: 100%;
  }

  .popup-box {
    position: fixed;
    z-index: 10000;
    top: 40%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border: 4px solid rgba(0, 0, 0, 0.05);
  }

  .popup-box .tit {
    background: #f9f9f9;
    padding: 10px;
    display: flex;
    height: 14px;
    line-height: 14px;
  }

  .popup-box .tit .text {
    color: #999;
    font-size: 14px;
    flex: 1;
  }

  .popup-box .tit .close {
    width: 12px;
    height: 12px;
    margin-top: 1px;
    background: url(../assets/img/icons.png) no-repeat;
    background-position: 0 -232px;
    cursor: pointer;
  }

  .popup-box .con {
    padding: 20px;
    background: #fff;
    min-width: 370px;
    min-height: 100px;
  }

  /* 提示性弹窗 */

  .popup-box .con .tip {
    padding: 10px 20px;
    text-align: center;
  }

  .popup-box .con .tip .tip-icon {
    display: inline-block;
    vertical-align: top;
    width: 32px;
    height: 32px;
    background: url(../assets/img/icons.png) no-repeat;
  }

  .popup-box .con .tip .tip-icon.success {
    background-position: 0 -476px;
  }

  .popup-box .con .tip .tip-icon.fail {
    background-position: -37px -476px;
  }

  .popup-box .con .tip .tip-icon.warning {
    background-position: -74px -476px;
  }

  .popup-box .con .tip .tip-info {
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
    text-align: left;
  }

  .popup-box .con .tip .tip-info .result {
    font-size: 14px;
    height: 14px;
    line-height: 14px;
  }

  .popup-box .con .tip .tip-info .result .number {
    color: #e1251b;
    font-family: Verdana;
  }

  .popup-box .con .tip .tip-info .date {
    font-family: arial;
    color: #999;
    margin-top: 10px;
  }

  .popup-box .con .tip .tip-info .btns {
    margin-top: 10px;
    color: #999;
    display: flex;
  }

  .popup-box .con .tip .tip-info .btns .btn {
    color: #005ea7;
  }

  .popup-box .con .tip .tip-info .btns .btn .arrow {
    font-family: Consolas;
    margin-left: 3px;
  }

  .popup-box .con .tip .tip-info .btns .btn-r,
  .popup-box .con .tip .tip-info .btns .btn-g {
    width: 72px;
    text-align: center;
    height: 26px;
    line-height: 26px;
    border-radius: 26px;
    border: 1px solid #e1251b;
    background: #e1251b;
    color: #fff;
    margin-top: 10px;
  }

  .popup-box .con .tip .tip-info .btns .btn-r:hover {
    opacity: 0.9;
  }

  .popup-box .con .tip .tip-info .btns .btn-g {
    background: #f9f9f9;
    border-color: #ddd;
    color: #000;
    margin-left: 15px;
  }

  .popup-box .con .tip .tip-info .btns .btn-g:hover {
    background: #fff;
  }

  /* 提示性弹窗 */

  /* 编辑性弹窗 */

  .popup-box .con .edit {
    padding: 10px 10px 10px 10px;
  }

  .popup-box .con .edit .item {
    display: flex;
    margin-top: 20px;
    position: relative;
  }

  .popup-box .con .edit .item:first-child {
    margin-top: 0;
  }

  .popup-box .con .edit .item .label {
    width: 80px;
    height: 32px;
    line-height: 32px;
  }

  .popup-box .con .edit .item .text-box .input {
    border: 1px solid #eee;
    padding: 5px;
    height: 30px;
    width: 300px;
  }

  .popup-box .con .edit .item .text-box .area-box {
    display: flex;
  }

  .popup-box .con .edit .item .text-box .area-box .area {
    border: 1px solid #eee;
    padding: 5px;
    height: 30px;
    line-height: 20px;
    width: 85px;
    margin-right: 10px;
    position: relative;
  }

  .popup-box .con .edit .item .text-box .area-box .area:last-child {
    margin-right: 0;
  }

  .popup-box .con .edit .item .text-box .area-box .area::before {
    position: absolute;
    right: 10px;
    top: 12px;
    display: block;
    width: 0;
    height: 0;
    content: " ";
    font-size: 0;
    border: 5px solid transparent;
    border-top: 5px solid #bcbcbc;
  }

  .popup-box .con .edit .item .label-btn {
    width: 80px;
  }

  .popup-box .con .edit .item .btn-r {
    padding: 5px 15px;
    background: #e1251b;
    color: #fff;
    border-radius: 2px;
  }

  .popup-box .con .edit .item .text-box .btn-r:hover {
    opacity: 0.9;
  }

  .popup-box .con .edit .item .btn-g {
    padding: 4px 14px;
    background: #f9f9f9;
    border-radius: 2px;
    margin-left: 12px;
    border: 1px solid #ddd;
  }

  .popup-box .con .edit .item .btn-g:hover {
    background: #fff;
  }

  .popup-box .con .edit .item .text-box .error-text {
    color: #e1251b;
    padding-left: 19px;
    position: relative;
    height: 14px;
    line-height: 14px;
    margin-top: 5px;
    margin-left: 5px;
    display: block;
  }

  .popup-box .con .edit .item .text-box .error-text::before {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 14px;
    height: 14px;
    content: " ";
    font-size: 0;
    background: url(../assets/img/icons.png) no-repeat -77px -517px;
  }

  .popup-box .con .edit .item.error .text-box .error-text {
    display: block;
  }

  /* 编辑性弹窗 end */
  /* 步骤 */

  .step-box {
    display: flex;
    height: 70px;
    padding: 0 20px 7px;
    margin-top: 10px;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;
    border-bottom: 2px solid #e1251b;
  }

  .step-box .left {
    flex: 1;
    margin-top: 16px;
  }

  .step-box .left .img {
    display: inline-block;
    vertical-align: top;
    width: 38px;
    height: 38px;
  }

  .step-box .left .text {
    display: inline-block;
    vertical-align: top;
    height: 38px;
    line-height: 38px;
    font-size: 15px;
    font-weight: 600;
  }

  .step-box .steps {
    display: flex;
  }

  .step-box .steps .item {
    padding-left: 90px;
    margin-left: 40px;
    position: relative;
    background: url(../assets/img/icons.png) no-repeat 0 -292px;
  }

  .step-box .steps .item:first-child {
    background: none;
  }

  .step-box .steps .item .number {
    height: 20px;
    line-height: 20px;
    margin-top: 12px;
    color: #999;
    font-family: arial;
  }

  .step-box .steps .item .text {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    color: #999;
  }

  .step-box .steps .item.active .number,
  .step-box .steps .item.active .text {
    color: #000;
  }

  /* 步骤 end */

  /* 面包屑 */

  .crumbs {
    font-size: 13px;
    line-height: 1;
    padding: 23px 0 20px;
    cursor: pointer;
  }

  .crumbs .item-a:hover {
    text-decoration: none;
    color: #19b2ff;
    font-weight: 500;
  }

  .crumbs .arrow {
    font-family: Consolas;
    margin: 0 2px;
  }

  .crumbs .item-span {
    color: #999;
  }

  /* 面包屑 end */

  /* 页码 */

  .pages {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
    text-align: center;
  }

  .pages * {
    box-sizing: content-box;
  }

  .pages .item {
    margin-left: 5px;
    display: block;
    padding: 3px 7px;
    min-width: 18px;
    height: 24px;
    line-height: 24px;
    word-break: keep-all;
    border: 1px solid #eee;
    font-size: 12px;
    font-family: arial;
    -moz-transition: all 0.2s;
    -webkit-transition: all 0.2s;
    -o-transition: all 0.2s;
    transition: all 0.2s;
    background: #fff;
  }

  .pages .item:hover {
    color: #e1251b;
  }

  .pages .cur,
  .pages .cur:hover {
    color: #fff;
    background: #e1251b;
    border-color: #e1251b;
  }

  .pages .ellipsis {
    display: block;
    width: 30px;
    height: 32px;
    line-height: 24px;
    text-align: center;
    margin-right: -5px;
  }

  .pages .go-page {
    height: 32px;
    line-height: 30px;
    margin-left: 10px;
  }

  .pages .go-page .page-input {
    width: 28px;
    height: 24px;
    padding: 3px 5px;
    margin: 0 5px;
    text-align: center;
    border: 0;
    border: 1px solid #eee;
    vertical-align: top;
  }

  .pages .go-page .page-btn {
    margin-left: 5px;
    display: inline-block;
    padding: 3px 5px;
    border: 1px solid #eee;
    min-width: 28px;
    height: 24px;
    line-height: 24px;
    word-break: keep-all;
    font-size: 12px;
    font-family: arial;
    vertical-align: top;
    -moz-transition: all 0.1s;
    -webkit-transition: all 0.1s;
    -o-transition: all 0.1s;
    transition: all 0.1s;
    background: #fff;
  }

  .pages .go-page .page-btn:hover {
    color: #e1251b;
  }

  .pages .item.prev,
  .pages .item.next {
    padding: 3px 13px;
  }

  .pages .total-num {
    height: 32px;
    line-height: 30px;
    margin-left: 10px;
  }

  .pages .total-num .num {
    margin: 0 3px;
    font-family: arial;
  }

  .pages .item.default,
  .pages .item.default:hover {
    color: #d2d2d2;
    cursor: not-allowed;
    background: #fff;
    border-color: #eee;
  }

  /* 页码 end */
</style>
