<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-15 11:12:19
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-30 10:05:47
-->
<template>
  <div class="app-content">

    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/college/index' }">成长学院</el-breadcrumb-item>
        <el-breadcrumb-item>所有课程</el-breadcrumb-item>
    </el-breadcrumb>
    <h4>课程分类</h4>
    <el-divider></el-divider>
    <div class="tag-block">
      <div v-for="(item, index) in categoryList" :key="index" class="tag-item">
        <span class="title"> {{ item.categoryName }}</span>
        <span class="inner" v-for="(citem,cindex) in item.children" :class="{active:citem.selected}" :key="cindex"
          @click="onSelected(index,cindex)">
          {{ citem.categoryName }}
        </span>
      </div>
    </div>
    <div class="trading-record">
      <div class="blue"></div>
      <span class="record-txt">专栏课</span>
    </div>
    <div class="live-block" v-if="courseList.length > 0">
      <course-item :courseList="courseList" />
    </div>
    <div class="empty-tip" v-else>
      <div class="el-icon-receiving"></div>
      <div class="empty-text">暂无课程数据</div>
    </div>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="total" @current-change="onCurrentChange">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import courseItem from "@/components/course-item.vue"
  import {
    treeDataTranslate
  } from '@/utils'
  export default {
    components: {
      courseItem
    },
    data() {
      return {
        courseList: [],
        categoryList: [],
        courseId: "",
        categoryIds: [],
        current: 1,
        size: 10,
        total: 0
      }
    },
    mounted() {
      this.getCategoryList();
    },
    methods: {
     async getCategoryList() {
        let res = await this.$http({
          url: this.$http.adornUrl("/corp/live/categorys"),
          method: "get",
          params: this.$http.adornParams()
        })

        let translateCategoryList = treeDataTranslate(res.data, 'categoryId', 'parentId')
        translateCategoryList.forEach((item, index) => {
          if (item.children) {
            item.children.unshift({
              categoryName: "全部",
              categoryId: item.categoryId,
              selected: true
            })
          }
        })
        this.categoryList = translateCategoryList;
        this.categoryIds = this.findCategorySelect();
        this.getCourseList()
      },
      resetCategorySelect(arr) {
        if (arr) {
          arr.forEach((item) => {
            this.$set(item, 'selected', false)
          })
        }
      },
      findCategorySelect() {
        let categoryIds = []
        this.categoryList.forEach((item, index) => {
          if (item.children) {
            let res = item.children.find((citem) => {
              return citem.selected
            })
            if (res) {
              categoryIds.push(res.categoryId)
            }
          }
        })
        return categoryIds;
      },
      onSelected(index, cindex) {
        let children = this.categoryList[index].children;
        this.resetCategorySelect(children);
        children[cindex].selected = true;
        this.categoryIds = this.findCategorySelect();
        this.getCourseList();
      },
      onCurrentChange(page) {
        this.current = page;
        this.getCourseList();
      },
      async getCourseList() {
        let res = await this.$http({
          url: this.$http.adornUrl("/corp/live/page"),
          method: "get",
          params: this.$http.adornParams({
            categoryIds: this.categoryIds.join(","),
            current: this.current,
            search: '',
            size: this.size
          })
        })
        this.total = res.data.total;
        this.courseList = res.data.records;

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

<style scoped lang="scss">
  .el-breadcrumb{
    padding: 20px 0 30px 0;
  }
  .pagination {
    text-align: right;
    margin: 20px 0;
  }

  .tag {
    &-block {
      padding-bottom: 40px;
    }

    &-item {
      margin-top: 18px;
      font-size: 14px;

      .title {
        color: #999;
      }

      .inner {
        display: inline-block;
        color: #222;
        margin-left: 18px;
        cursor: pointer;
        padding: 4px 12px;

        &.active {
          color: #fff;
          background-color: #409eff;
          border-radius: 100px;
        }
      }
    }
  }

  .coruse {
    display: flex;
    flex-wrap: wrap;
    margin-left: -20px;

    &-item {
      width: 280px;
      margin-left: 14px;
      margin-top: 20px;
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
        width: 280px;
        height: 162px;
      }
    }
  }
</style>
