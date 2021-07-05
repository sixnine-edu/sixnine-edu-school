<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-01-22 17:50:49
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-25 23:19:29
-->
<template>
  <div class="app-container">
    <!-- 分类筛选 -->
    <!-- <CategroySidebar @change="onChange"/> -->

    <div class="banner">
      <el-carousel height="26vw" style="overflow-y: hidden;">
        <el-carousel-item v-for="banner in bannerList" :key="banner.img" style="cursor: pointer" class="banner-item">
          <img :src="banner.img" style="width:100%;height:100%;" @click="toJumpUrl(banner.href)" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 搜索 -->
    <div class="home-search">
      <div class="search-msg" onselectstart="return false">
        <div class="search-input-box">
          <input type="text" class="search-input" v-model="searchTerms" @keyup.enter="toSearchProdPage"
            placeholder="搜索商品名称" />
        </div>
        <input type="submit" class="search-btn" value="搜索" @click="toSearchProdPage" />
      </div>
      <div class="cart-btn" @click="toCart">
        购物车
        <span class="number" v-if="totalCartCount">{{ totalCartCount ? totalCartCount : "" }}</span>
      </div>
    </div>
    <div class="app-content">
      <div class="tag-block">
        <div class="tag-item">
          <span class="title">分类</span>
          <span class="inner" v-for="(item, index) in firstCategoryList" @click="getSecondCategory(index)"
            :class="{active:firstIndex==index}" :key="index">
            {{ item.categoryName }}
          </span>
          <div class="child-item mt" v-if="secondCategoryList.length>0">
            <span class="inner" v-for="(item, index) in secondCategoryList" @click="getThirdCategory(index)"
              :class="{active:secondIndex==index}" :key="index">
              {{ item.categoryName }}
            </span>
          </div>
          <div class="child-item" v-if="thirdCategoryList.length>0">
            <span class="inner" v-for="(item, index) in thirdCategoryList" @click="getSearchCourseList(index)"
              :class="{active:thirdIndex==index}" :key="index">
              {{ item.categoryName }}
            </span>
          </div>
        </div>
      </div>
      <div v-loading="loading">
        <div class="goods-list group-list" v-for="(item, index) in columnsList" :key="item.columnId">
          <div class="list-tit">
            <div class="text">
              <span class="tit">{{ item.columnName }}</span>
              <!-- <span class="description">好物推荐，一起拼团</span> -->
            </div>
          </div>
          <ProdItem :pale-list="item.prodList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import CategroySidebar from "@/components/categroy-sidebar"
  import ProdItem from "@/components/prod-item"
  import {
    treeDataTranslate
  } from '@/utils'
  export default {
    components: {
      // CategroySidebar,
      ProdItem
    },
    data() {
      return {
        bannerList: [],
        searchTerms: "",
        columnsList: [],
        categoryId: -1,
        firstIndex: -1,
        secondIndex: -1,
        thirdIndex: -1,
        firstCategoryList: [],
        secondCategoryList: [],
        thirdCategoryList: [],
        loading: false
      }
    },
    computed: {
      totalCartCount() {
        return this.$store.state.cartNumber.cartNumbers
      }
    },
    mounted() {
      this.getBanner()
      this.getColumns()
      this.getCategoryList();
    },
    methods: {
      toJumpUrl(url) {
        window.open(url)
      },
      getSecondCategory(index) {
        this.firstIndex = index;
        if (index == 0) {
          this.secondIndex = -1;
          this.thirdIndex = -1;
          this.secondCategoryList = [];
          this.thirdCategoryList = [];
          this.categoryId = -1;
          this.getColumns()
        } else {
          this.secondCategoryList = this.firstCategoryList[index].children;

          this.secondIndex = -1;
          this.thirdCategoryList = [];
        }

      },
      getThirdCategory(index) {
        this.thirdCategoryList = this.secondCategoryList[index].children;
        this.secondIndex = index;
        this.thirdIndex = -1;
      },
      getSearchCourseList(index) {
        this.thirdIndex = index;
        let categoryId = this.thirdCategoryList[index].categoryId;
        let categoryName=this.thirdCategoryList[index].categoryName;
        this.categoryId = categoryId;
        this.$router.push({
          name: "storeCourseSearch",
          query: {
            categoryId,
            categoryName
          }
        })

        // this.getColumns();

      },
      async getCategoryList() {
        let res = await this.$http({
          url: this.$http.adornUrl("/corp/shop/categorys"),
          method: "get",
          params: this.$http.adornParams()
        })

        let translateCategoryList = treeDataTranslate(res.data, 'categoryId', 'parentId')
        // translateCategoryList.unshift({
        //   categoryName: "全部",
        //   categoryId: -1,
        // })
        this.firstCategoryList = translateCategoryList;
      },
      getBanner() {
        this.$http({
          url: this.$http.adornUrl("/corp/shop/banners"),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.bannerList = data
        })
      },
      getColumns() {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl("/corp/shop/columns"),
          method: "get",
          params: this.$http.adornParams({
            categoryId: this.categoryId,
            prodName: this.searchTerms
          })
        }).then(({
          data
        }) => {
          this.loading = false
          this.columnsList = data
        })
      },
      toCart() {
        this.$router.push({
          name: "storeCart"
        })
      },
      toSearchProdPage() {
        this.$router.push({
          name: "storeCourseSearch",
          query: {
            q: this.searchTerms
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  *,
  *:before,
  *:after {
    box-sizing: content-box;
  }

  .banner {
    width: 100%;
    height: 26vw;
    position: relative;
    overflow: hidden;
  }

  .banner-item {
    // width: 1920px;
    // /*图片宽度*/
    // position: absolute;
    // left: 50%;
    // margin-left: -960px;
    /*图片宽度的一半*/
  }

  /* 首页搜索 */

  .home-search {
    width: 780px;
    height: 40px;
    padding: 20px 30px;
    margin: -40px auto 0;
    background: #fff;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    z-index: 2;
    box-sizing: content-box;

    .hot-word {
      flex: 1;
      display: flex;
      line-height: 40px;

      .tit {
        font-size: 14px;
      }

      .con {
        max-width: 300px;
        overflow: hidden;
        color: #999;

        .item {
          display: inline-block;
          margin-left: 10px;
          transition: all 0.2s;
          -webkit-transition: all 0.2s;
          cursor: pointer;

          &:hover {
            color: #409eff;
          }
        }
      }
    }

    .search-msg {
      position: relative;
      height: 40px;

      .search-input-box {
        display: inline-block;
        border: 2px solid #409eff;
        width: 600px;
        height: 36px;

        .search-input {
          display: inline-block;
          width: 65%;
          border: 0;
          height: 35px;
          padding: 0 10px;
        }

        .select-search {
          display: inline-block;
          width: 10%;
          line-height: 37px;
          text-align: center;
          cursor: pointer;
          color: #409eff;
        }
      }

      .search-btn {
        border: 0;
        background: #409eff;
        color: #fff;
        height: 40px;
        width: 90px;
        position: absolute;
        right: 0;
        top: 0;
        letter-spacing: 2px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        -webkit-transition: all 0.2s;
      }
    }

    .cart-btn {
      position: relative;
      margin-left: 20px;
      padding: 0 20px 0 47px;
      background-color: #409eff;
      height: 40px;
      line-height: 40px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      -webkit-transition: all 0.2s;
      position: relative;

      &::before {
        position: absolute;
        left: 17px;
        top: 12px;
        display: block;
        width: 17px;
        height: 15px;
        content: " ";
        background: url("../../assets/img/icons.png") no-repeat -44px -38px;
      }

      .number {
        font-size: 12px;
        font-family: arial;
        display: inline-block;
        padding: 0 5px;
        background: #fff;
        color: #409eff;
        height: 16px;
        line-height: 16px;
        min-width: 16px;
        border-radius: 20px;
        vertical-align: top;
        margin-top: 12px;
        margin-left: 10px;
        text-align: center;
        box-sizing: border-box;
      }
    }
  }

  .search-msg {
    .search-input-box {
      .select-list {
        display: inline-block;
        width: 45px;
        position: absolute;
        top: 38px;
        right: 88px;
        background: #ffffff;
        border: 2px solid #409eff;
        padding: 5px 0;
      }
    }
  }

  .select-list {
    .select-item {
      line-height: 1.5em;
      text-align: center;
      padding: 5px 0;
      cursor: pointer;
    }
  }

  .home .home-search .search-msg .search-btn:hover,
  .home .home-search .cart-btn:hover {
    opacity: 0.9;
  }

  /* 首页搜索 end */
  .tag {
    &-block {
      padding-bottom: 10px;
    }

    &-item {
      margin-top: 18px;
      font-size: 14px;

      .title {
        color: #999;
      }

      .child-item {
        padding: 15px 30px;
        border-top: 1px dashed #EFEFEF;

        &.mt {
          margin-top: 15px;
        }
      }

      .inner {
        display: inline-block;
        color: #222;
        margin-left: 18px;
        cursor: pointer;
        padding: 4px 12px;

        &.active {
          color: #409eff;
          font-weight: bold;
          // background-color: #409eff;
          // border-radius: 100px;
        }
      }
    }
  }

  /**专栏 */
  .goods-list {
    background: #fff;
    margin-top: 40px;

    .list-tit {
      height: 30px;
      line-height: 30px;
      display: flex;

      .text {
        flex: 1;

        .tit {
          font-size: 24px;
        }

        .description {
          font-size: 12px;
          margin-left: 10px;
          color: #999;
        }
      }

      .view-more {
        position: relative;
        color: #999;
        font-size: 12px;
        height: 19px;
        line-height: 19px;
        margin-top: 9px;

        .arrow {
          display: inline-block;
          font-family: Consolas;
          margin-left: 3px;
        }

        &:hover {
          color: #409eff;
        }
      }
    }
  }

  /**专栏end */
</style>
