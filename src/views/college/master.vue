<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-15 11:12:19
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-30 10:06:19
-->
<template>
  <div class="app-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/college/index' }">成长学院</el-breadcrumb-item>
      <el-breadcrumb-item>校长栏</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="columns-top-block" v-if="columnTopList.length>0">
      <div class="column-top-left">
        <div class="panel-block" v-for="(item,index) in columnTopList" :key="index">
          <h1 class="name">{{item.title}}</h1>
          <div class="content">
            <div class="live-item" :class="{active:curSelect==`${item.columnId}_${citem.liveId}`}" v-for="(citem,cindex) in item.liveList"
              :key="cindex" @mouseenter="onMouseEnter($event,item.columnId,citem)" @mouseleave="onMouseLeave" @click="toLiveDetail(citem.liveId)">
              <div class="title">{{citem.title}}</div>
              <div class="btn-go">立即查看</div>
            </div>
          </div>
        </div>
      </div>
      <div class="column-top-right" v-show="curImg">
        <img class="hoverImg" :src="curImg" />
      </div>

    </div>
    <div class="empty-tip" v-else>
      <div class="el-icon-receiving"></div>
      <div class="empty-text">暂无数据</div>
    </div>
    <template v-if="columnList.length>0">
      <div class="block-1" v-for="(item,index) in columnList" :key="index">
        <div class="header-title">
          {{item.title}}
        </div>
        <course-item :courseList="item.liveList" />
      </div>
    </template>
    <!--  <div class="empty-tip" v-else>
      <div class="el-icon-receiving"></div>
      <div class="empty-text">暂无数据</div>
    </div> -->
  </div>
</template>
<script>
  import courseItem from "@/components/course-item.vue"
  export default {
    components: {
      courseItem
    },
    data() {
      return {
        columnList: [],
        columnTopList: [],
        curImg: '',
        curSelect: ''
      }
    },
    mounted() {
      this.getCollegeColumn();
      this.getCollegeTopColumn();
    },
    methods: {
     toLiveDetail(liveId) {

       this.$router.push({
         name: "collegeCourseDetail",
         query: {
           liveId
         }
       })
     },
      onMouseEnter(event, columnId, citem) {
        this.curSelect = `${columnId}_${citem.liveId}`;
        this.curImg = citem.coverImg;
      },
      onMouseLeave() {
        let item = this.columnTopList[0];
        let columnId = item.columnId;
        let citem = item.liveList[0];
        this.curSelect = `${columnId}_${citem.liveId}`;
        this.curImg = citem.coverImg;
      },
      getCollegeColumn() {
        this.$http({
          url: this.$http.adornUrl(`/corp/college/collegecolumn/1/0`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.columnList = data;
        })
      },
      getCollegeTopColumn() {
        this.$http({
          url: this.$http.adornUrl(`/corp/college/collegecolumn/1/1`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.columnTopList = data;
          this.onMouseLeave();
        })
      },
    },
    watch: {

    }
  }
</script>

<style scoped lang="scss">
  .el-breadcrumb {
    padding: 20px 0 30px 0;
  }

  .block-1 {
    margin-top: 40px;

    .el-tabs {
      margin-top: 10px;
    }

  }

  .columns-top-block {
    display: flex;

    .column-top-left {
      width: 400px;

      .panel-block {
        border-radius: 10px;
        border: 1px solid #efefef;

        &:not(:first-child) {
          margin-top: 40px;
        }

        .name {
          font-size: 16px;
          background: rgba($color: #19B2FF, $alpha: 0.1);
          padding: 12px 20px;
          border-radius: 10px 10px 0 0;
          margin: 0;
        }

        .content {
          padding: 10px 20px;

          .live-item {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            padding: 10px 0;
            cursor: pointer;

            .title {}

            .btn-go {}

            // &:not(:hover) {
            //   &:first-child {
            //     color: #19B2FF;
            //   }
            // }

            &.active {
              color: #19B2FF;
              font-weight: bold;
            }
          }
        }

      }
    }

    .column-top-right {
      margin-left: 60px;

      .hoverImg {
        width: 600px;
        height: auto;
        border-radius: 10px;
      }
    }
  }
</style>
