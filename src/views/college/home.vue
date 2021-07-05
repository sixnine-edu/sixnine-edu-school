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
    <div class="banner">
      <el-carousel height="250px" style="overflow-y: hidden;">
        <el-carousel-item v-for="banner in bannerList" :key="banner.img" style="cursor: pointer" class="banner-item">
          <img :src="banner.img" style="width:100%;height:100%;border-radius: 10px;" @click="toJumpUrl(banner.href)" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="nav-block">
      <img src="../../assets/img/notebook@3x.png" @click="toMaster" />
      <img src="../../assets/img/protractor@3x.png" @click="toTeacher" />
      <img src="../../assets/img/pom-pom@3x.png" @click="toAll" />
    </div>
    <div class="block-1" v-for="(item,index) in columnList" :key="index">
      <div class="header-title">
        {{item.title}}
      </div>
      <course-item :courseList="item.liveList" />
    </div>
    <div class="block-2">
      <div class="header-title">
        培训专区
      </div>
      <el-tabs v-model="liveRefer">
        <el-tab-pane name="-1">
          <div slot="label">全部 </div>
        </el-tab-pane>
        <el-tab-pane name="0">
          <div slot="label">
            <i class="dot  dot-headermaster"></i> 校长</div>
        </el-tab-pane>
        <el-tab-pane name="1">
          <div slot="label">
            <i class="dot  dot-teacher"></i> 老师</div>
        </el-tab-pane>
      </el-tabs>
      <v-calendar class="custom-calendar" title-position="left" :attributes="attributes" disable-page-swipe is-expanded
        @update:from-page="fromPage">
        <template #day-content="{ day, attributes }">
          <div class="day-content">
            <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
            <el-popover v-model="popoverVis[day.day]" trigger="hover" v-if="attributes&&attributes.length>0">
              <div class="attr-more">
                <div class="attr-item" v-for="attr in attributes" :key="attr.key" @click="toLiveDetail(attr.customData.liveId)">
                  <span class="dot dot-headermaster"></span>{{ attr.customData.title }}
                </div>
              </div>
              <template slot="reference">
                <div class="event-block">
                  <div v-for="attr in attributes" :key="attr.key" :class="attr.customData.class" @click="toLiveDetail(attr.customData.liveId)">
                    <span>{{ attr.customData.title }}</span>
                  </div>
                </div>
              </template>
            </el-popover>
          </div>
        </template>
      </v-calendar>
    </div>
  </div>
</template>

<script>
  import courseItem from "@/components/course-item.vue"
  import Calendar from "@/components/v-calendar/components/Calendar"
  import moment from "moment"
  export default {
    components: {
      courseItem,
      VCalendar: Calendar
    },
    data() {
      return {
        liveRefer: "-1",
        dateStr: moment().format("YYYY-MM"),
        bannerList: [],
        popoverVis: {},
        attributes: [],
        columnList: []
      }
    },
    mounted() {
      this.getBanner()
      this.getCollegeColumn();
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
      toAll() {
        this.$router.push({
          name: "collegeAllCourse"
        })
      },
      toTeacher() {
        this.$router.push({
          name: "collegeTeacher"
        })
      },
      toMaster() {
        this.$router.push({
          name: "collegeMaster"
        })
      },
      toJumpUrl(url) {
        window.open(url)
      },
      getBanner() {
        this.$http({
          url: this.$http.adornUrl("/corp/college/collegebanner"),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.bannerList = data
        })
      },
      getCollegeColumn() {
        this.$http({
          url: this.$http.adornUrl(`/corp/college/collegecolumn/3/0`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.columnList = data;
        })
      },
      getCollegeCalendar() {
        this.$http({
          url: this.$http.adornUrl(`/corp/college/collegecalendar`),
          method: "get",
          params: this.$http.adornParams({
            dateStr: this.dateStr,
            liveRefer: this.liveRefer
          })
        }).then(({
          data
        }) => {

          let attributes = []
          data.forEach((item, index) => {
            item.lives.forEach((citem, cindex) => {
              attributes.push({
                dates: item.dates,
                key: `${index}${cindex}`,
                customData: {
                  liveId: citem.liveId,
                  title: citem.title,
                  class: (citem.liveRefer === 0 ? 'bg-blue' : 'bg-red'),
                },
              })
            })
          })
          this.attributes = attributes;
        })
      },
      fromPage({
        month,
        year
      }) {
        this.dateStr = `${year}-${month.toString().padStart(2,0)}`;
        this.getCollegeCalendar();
      },
    },
    watch: {
      liveRefer(val) {
        this.liveRefer = val;
        this.getCollegeCalendar();
      }
    }
  }
</script>

<style scoped lang="scss">
  .banner {
    margin-top: 10px;
  }

  .nav-block {
    display: flex;
    justify-content: space-between;
    padding: 40px 80px;

    img {
      width: 200px;
      height: 125px;
      cursor: pointer;
    }
  }
  .block-1{
    margin-top: 40px;
  }

  .block-2 {
    margin-top: 40px;

    .el-tabs {
      margin-top: 10px;
    }

    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 1px;
      margin-right: 6px;

      &-headermaster {
        background: #19B2FF;
      }

      &-teacher {
        background: #F08078;
      }
    }
  }

  /deep/ .custom-calendar.vc-container {
    border: none;
    --day-border: 1px solid #efefef;
    --day-border-highlight: 1px solid #efefef;
    --day-width: 44px;
    --day-height: 80px;
    --weekday-bg: #f8fafc;
    --weekday-border: none;
    border-radius: 0;
    width: 100%;

    & .vc-header {
      background-color: #FFF;
      padding: 10px 70px 10px 10px;

      &.align-left {
        justify-content: flex-end;
      }

      .vc-title {
        font-size: 16px;
      }
    }

    & .vc-weeks {
      padding: 0;
    }

    & .vc-weekday {
      background-color: #19B2FF;
      padding: 15px 0;
      color: #FFFFFF;
    }

    & .vc-day {
      text-align: left;
      min-height: var(--day-height);
      min-width: var(--day-width);
      background-color: white;

      &:not(.on-bottom) {
        border-bottom: var(--day-border);

        &.weekday-1 {
          border-bottom: var(--day-border-highlight);
        }
      }

      &:not(.on-right) {
        border-right: var(--day-border);
      }
    }

    .day-content {
      display: flex;
      flex-direction: column;
      height: inherit;
      position: relative;
      z-index: 9999;

      .day-label {
        font-size: 14px;
        color: #333;
        padding: 5px;
      }

      .event-block {
        flex: 1;
        font-size: 12px;
        color: #fff;
        display: flex;
        flex-direction: column;

        >div {
          cursor: pointer;
          padding: 10px 4px;
          display: flex;
          align-items: center;
          margin-top: 4px;

          >span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        .bg-blue {
          color: #19B2FF;
          background: rgba($color: #19B2FF, $alpha: 0.1);
          font-weight: bold;

        }

        .bg-red {
          color: #F08078;
          background: rgba($color: #F08078, $alpha: 0.1);
          font-weight: bold;

        }
      }
    }


  }

  .attr-more {
    .attr-item {
      padding: 8px 0;
      cursor: pointer;

      .dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 20px;
        margin-right: 6px;

        &-headermaster {
          background: #19B2FF;
        }

        &-teacher {
          background: #F08078;
        }
      }
    }
  }
</style>
