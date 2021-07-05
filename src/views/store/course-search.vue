<template>
  <div class="detail">
    <div class="app-content">
      <div class="crumbs">
        <a class="item-a" href="#/store/index">商城首页</a>
        <span class="arrow">&gt;</span>
        <span class="item-span">{{$route.query.categoryName ||'全部'}}</span>
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
      <!--      <div class="tag-block">
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
      </div> -->

      <div v-loading="loading">
        <ProdItem :pale-list="prodList" />
      </div>
    </div>
  </div>
</template>

<script>
  import ProdItem from "@/components/prod-item"
  import {
    treeDataTranslate
  } from '@/utils'
  export default {
    components: {
      ProdItem
    },
    data() {
      return {
        prodList: [],
        categoryId: -1,
        firstIndex: 0,
        secondIndex: -1,
        thirdIndex: -1,
        firstCategoryList: [],
        secondCategoryList: [],
        thirdCategoryList: [],
        loading: false,
        searchTerms: this.$route.query.q,
        categoryId: this.$route.query.categoryId || -1
      }
    },
    computed: {
      totalCartCount() {
        return this.$store.state.cartNumber.cartNumbers
      }
    },
    mounted() {
      // this.getCategoryList();
      this.getCourseSearch();

    },
    methods: {
      getSecondCategory(index) {
        this.firstIndex = index;
        if (index == 0) {
          this.secondIndex = -1;
          this.thirdIndex = -1;
          this.secondCategoryList = [];
          this.thirdCategoryList = [];
          this.categoryId = -1;
          this.getCourseSearch()
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
        let categoryId = this.secondCategoryList[index].categoryId;
        this.categoryId = categoryId;
        this.getCourseSearch();

      },
      async getCategoryList() {
        let res = await this.$http({
          url: this.$http.adornUrl("/corp/shop/categorys"),
          method: "get",
          params: this.$http.adornParams()
        })

        let translateCategoryList = treeDataTranslate(res.data, 'categoryId', 'parentId')
        translateCategoryList.unshift({
          categoryName: "全部",
          categoryId: -1,
        })
        this.firstCategoryList = translateCategoryList;
      },
      getCourseSearch() {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl("/corp/shop/search"),
          method: "get",
          params: this.$http.adornParams({
            categoryId: this.categoryId,
            search: this.searchTerms
          })
        }).then(({
          data
        }) => {
          this.loading = false
          this.prodList = data
        })
      },
      toCart() {
        this.$router.push({
          name: "storeCart"
        })
      },
      toSearchProdPage() {
        this.getCourseSearch();
      }
    }

  }
</script>

<style scoped lang="scss">
  *,
  *:before,
  *:after {
    box-sizing: content-box;
  }

  .home-search {
    width: 780px;
    height: 40px;
    padding: 20px 30px;
    margin: 0 auto 0;
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



    /* 首页搜索 end */

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
  }

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
</style>
