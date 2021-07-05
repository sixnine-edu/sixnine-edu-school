<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-24 15:01:56
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-11 15:06:44
-->
<template>
  <div class="app-content">
    <div class="tag-block">
      <div class="tag-item">
        <span class="title">分类</span>
        <span class="inner" v-for="(item, index) in firstCategoryList" @click="getSecondCategory(index)" :class="{active:firstIndex==index}"
          :key="index">
          {{ item.categoryName }}
        </span>
        <div class="child-item mt" v-if="secondCategoryList.length>0">
          <span class="inner" v-for="(item, index) in secondCategoryList" @click="getThirdCategory(index)" :class="{active:secondIndex==index}"
            :key="index">
            {{ item.categoryName }}
          </span>
        </div>
        <div class="child-item" v-if="thirdCategoryList.length>0">
          <span class="inner" v-for="(item, index) in thirdCategoryList" @click="getSearchCourseList(index)" :class="{active:thirdIndex==index}"
            :key="index">
            {{ item.categoryName }}
          </span>
        </div>
      </div>
    </div>
    <section>
      <div class="trading-record">
        <div class="blue"></div>
        <span class="record-txt">专栏课</span>
      </div>
      <div class="coruse" v-if="courseList.length > 0">
        <div class="coruse-item" v-for="(item, index) in courseList" :key="index" @click="toDetail(item.courseId)">
          <img :src="item.coverImg" class="image" />
          <div class="info-box">
            <div class="title ellipsis-2 ">{{ item.title }}</div>
            <div class="desc ellipsis-2 ">{{ item.info }}</div>
          </div>
        </div>
      </div>
      <div class="empty-tip" v-else>
        <div class="el-icon-receiving"></div>
        <div class="empty-text">暂无课程数据</div>
      </div>
    </section>
    <section>
      <div class="trading-record">
        <div class="blue"></div>
        <span class="record-txt">示范课</span>
      </div>
      <div class="coruse" v-if="demoCourseList.length > 0">
        <div class="coruse-item" v-for="(item, index) in demoCourseList" :key="index" @click="toDetail(item.courseId)">
          <img :src="item.coverImg" class="image" />
          <div class="info-box">
            <div class="title ellipsis-2 ">{{ item.title }}</div>
            <div class="desc ellipsis-2 ">{{ item.info }}</div>
          </div>
        </div>
      </div>
      <div class="empty-tip" v-else>
        <div class="el-icon-receiving"></div>
        <div class="empty-text">暂无课程数据</div>
      </div>
    </section>
  </div>
</template>

<script>
  import {
    treeDataTranslate
  } from '@/utils'
  export default {
    data() {
      return {
        courseList: [],
        demoCourseList: [],
        courseId: "",
        categoryId: '',
        firstIndex: 0,
        secondIndex: -1,
        thirdIndex: -1,
        firstCategoryList: [],
        secondCategoryList: [],
        thirdCategoryList: [],
        fetchCourseURL: "",
        fetchDemoCourseURL: ""

      }
    },
    mounted() {
      //请求课程列表
      if (this.isAuth("corp:courses:master")) {
        this.fetchCourseURL = '/corp/teacher/mcourses'
      } else if (this.isAuth("corp:courses:teacher")) {
        this.fetchCourseURL = '/corp/teacher/tcourses'
      }

      //请求示范课
      this.fetchDemoCourseURL = '/corp/teacher/demo/mcourses'
      this.getDemoCourseList();
      this.getCourseList();
      this.getCategoryList();
    },
    methods: {





      getSecondCategory(index) {
        this.firstIndex = index;
        if (index == 0) {
          this.secondIndex = -1;
          this.thirdIndex = -1;
          this.secondCategoryList = [];
          this.thirdCategoryList = [];
          this.categoryId = '';
          this.getCourseList()
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
        this.categoryId = categoryId;
        this.getCourseList();

      },
      async getCategoryList() {
        let res = await this.$http({
          url: this.$http.adornUrl("/corp/teacher/categorys"),
          method: "get",
          params: this.$http.adornParams()
        })
        let translateCategoryList = treeDataTranslate(res.data, 'categoryId', 'parentId')
        translateCategoryList.unshift({
          categoryName: "全部",
          categoryId: -1,
          selected: true
        })
        this.firstCategoryList = translateCategoryList;

      },
      async getCourseList(url) {
        if (!this.fetchCourseURL) {
          this.$message({
            type: 'error',
            message: '暂无权限访问课程列表'
          })
          return
        }
        let res = await this.$http({
          url: this.$http.adornUrl(this.fetchCourseURL),
          method: "get",
          params: this.$http.adornParams({
            categoryId: this.categoryId
          })
        })
        this.courseList = res.data

      },
      async getDemoCourseList(url) {
        if (!this.fetchCourseURL) {
          this.$message({
            type: 'error',
            message: '暂无权限访问示范课'
          })
          return
        }
        let res = await this.$http({
          url: this.$http.adornUrl(this.fetchDemoCourseURL),
          method: "get",
          params: this.$http.adornParams()
        })

        this.demoCourseList = res.data

      },
      toDetail(courseId) {
        this.$router.push({
          name: "courseDetail",
          query: {
            courseId
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  section{
    margin: 40px 0;
  }
  .tag {
    &-block {
      padding-bottom: 20px;
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

  .coruse {
    display: flex;
    flex-wrap: wrap;
    margin-left: -20px;

    &-item {
      width: 185px;
      margin-left: 14px;
      margin-top: 10px;
      cursor: pointer;

      .info-box {
        padding: 10px 5px;
      }

      .title {
        font-size: 14px;
        height: 32px;
      }

      .desc {
        font-size: 12px;
        color: #999;
        margin-top: 5px;

      }

      .image {
        width: 185px;
        height: 110px;
      }
    }
  }
</style>
