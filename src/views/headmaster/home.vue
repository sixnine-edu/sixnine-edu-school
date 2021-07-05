<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-15 11:12:19
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-30 10:06:12
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
    <div class="block-1">
      <div class="left-block">
        <div class="header-title">
          运营日志
        </div>
        <div class="timeline-block" v-if="recentList.length>0">
          <ul class="el-timeline">
            <li class="el-timeline-item" v-for="(item,index) in recentList" :key="index" :class="{active:index==curRecentIndex}"
              @mouseenter="onRecentMouseEnter($event,index)" @mouseleave="onRecentMouseLeave()" @click="toLiveDetail(item.liveId)">
              <div class="el-timeline-item__tail"></div>
              <div class="el-timeline-item__node el-timeline-item__node--normal el-timeline-item__node--"> </div>
              <div class="el-timeline-item__wrapper">
                <div class="el-timeline-item__content">
                  <h3 class="title">【{{item.title}}】</h3>
                  <!-- <p>牛气学霸营-春招要你赢</p> -->
                </div>
                <div class="el-timeline-item__timestamp">
                  {{item.dates}}
                </div>
              </div>
            </li>
          </ul>
          <img class="banner-img" v-show="curRecentImg" :src="curRecentImg" />
        </div>
        <div class="empty-block" v-else>
          <i class="el-icon-box"></i>
          <div>暂无数据</div>
        </div>

      </div>
      <div class="right-block">
        <div class="header-title">
          公告栏
        </div>
        <div class="notice-block" v-if="noticeList.length>0">
          <div class="notice-item" v-for="(item,index) in noticeList" v-if="index<=5" :key="index" @click="toNoticeDetail(item.noticeId)">
            <div class="title">
              <el-tag type="danger" size="mini" effect="plain" v-if="item.noticeType==1">重要</el-tag>
              <span>{{item.title}}</span>
            </div>
            <div class="desc">{{item.updateTime}}</div>
          </div>
        </div>
        <div class="empty-block" v-else>
          <i class="el-icon-box"></i>
          <div>暂无数据</div>
        </div>
      </div>
    </div>
    <div class="block-2">
      <div class="left-block">
        <div class="article-content" v-for="(column) in columnList" :key="column.columnId">
          <div class="header-title">
            {{column.columnName}}
          </div>
          <div class="article-block" v-if="column.newsList.length>0">
            <div class="article-item" v-for="(item,index) in column.newsList" :key="index" @click="toArticleDetail(item.newsId)">
              <img :src="item.coverImg" />
              <div class="info">
                <div>
                  <div class="art-title">{{item.title}}</div>
                  <div class="art-desc">{{item.abstr}}</div>
                </div>
                <div class="pub-time">发布时间：{{item.updateTime}}</div>
              </div>
            </div>
          </div>
          <div class="empty-block" v-else>
            <i class="el-icon-box"></i>
            <div>暂无数据</div>
          </div>
        </div>


      </div>
      <div class="right-block" v-if="customerSerList.length>0">
        <div class="header-title">
          运营顾问
        </div>
        <div>
          <div class="consultant-block">
            <div class="consultant-item" v-for="(item,index) in customerSerList" :key="index">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        bannerList: [],
        recentList: [],
        noticeList: [],
        columnList: [],
        customerSerList: [],
        curRecentIndex: -1,
        curRecentImg: ""
      }
    },
    mounted() {
      this.getBanner()
      this.getMasterRecent();
      this.getNotice();
      this.getNewsColumn();
      this.getCustomerSerList();
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
      toJumpUrl(url) {
        window.open(url)
      },
      onRecentMouseEnter(event, index) {
        let img = this.recentList[index].coverImg;
        this.curRecentIndex = index;
        this.curRecentImg = img;
      },
      onRecentMouseLeave() {
        let item = this.recentList[0];
        this.curRecentIndex = 0;
        this.curRecentImg = item.coverImg
      },
      toNoticeDetail(noticeId) {
        this.$router.push({
          name: "noticeDetail",
          query: {
            noticeId
          }
        })
      },
      toArticleDetail(newsId) {
        this.$router.push({
          name: "articleDetail",
          query: {
            newsId
          }
        })
      },
      getCustomerSerList() {
        this.$http({
          url: this.$http.adornUrl(`/corp/master/customerSer/1`), //customerserType:0-客服 1-顾问
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.customerSerList = data;
        })
      },
      getNewsColumn() {
        this.$http({
          url: this.$http.adornUrl("/corp/master/mastercolumn"),
          method: "get",
          params: this.$http.adornParams({
            size: 10
          })
        }).then(({
          data
        }) => {
          this.columnList = data;
        })
      },
      getNotice() {
        this.$http({
          url: this.$http.adornUrl("/corp/master/masternotice"),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.noticeList = data;
        })
      },
      getBanner() {
        this.$http({
          url: this.$http.adornUrl("/corp/master/masterbanner"),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.bannerList = data
        })
      },
      getMasterRecent() {
        this.$http({
          url: this.$http.adornUrl("/corp/master/masterrecent"),
          method: "get",
          params: this.$http.adornParams({
            liveRefer: "0",
            size: 5
          })
        }).then(({
          data
        }) => {
          this.recentList = data;
          this.onRecentMouseLeave();
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  .banner {
    margin-top: 10px;
  }

  .empty-block {
    padding-top: 50px;
    font-size: 14px;
    color: #CCCCCC;
    text-align: center;

    .el-icon-box {
      font-size: 34px;

    }

    >div {
      padding-top: 5px;
    }

  }

  .block-1 {
    display: flex;
    margin-top: 40px;
    min-height: 400px;

    .left-block {
      flex: 1;
     position: relative;
      .timeline-block {


        .banner-img {
          width: 400px;
          height: 230px;
          background: #D8D8D8;
          border-radius: 10px;
          position: absolute;
          top: 10%;
          // transform: translateY(-50%);
          right: 10px;
        }

        .el-timeline {
          margin-top: 15px;

          .el-timeline-item {
            padding: 20px 20px 20px 100px;
            cursor: pointer;

            .el-timeline-item__content {
              .title {
                color: #333;
                padding-bottom: 10px;
              }
            }

            .el-timeline-item__tail {
              left: 106px;
            }

            .el-timeline-item__node--normal {
              left: 102px;
            }

            .el-timeline-item__timestamp {
              position: absolute;
              top: 0px;
              left: -90px;
            }

            &.active {
              background: linear-gradient(90deg, rgba(157, 215, 244, 0.15) 0%, rgba(157, 215, 244, 0.04) 100%);

              .el-timeline-item__timestamp {
                color: #19B2FF;
              }

              .el-timeline-item__node {
                background-color: #19B2FF;
                border: 3px solid rgba($color: #19B2FF, $alpha: 0.2);
              }
            }
          }
        }
      }

    }

    .right-block {
      width: 300px;
      flex-shrink: 0;
      margin-left: 10px;

      .notice-block {
        padding: 15px 10px;
        background: #fafafa;
        border-radius: 5px;
        margin-top: 15px;

        .notice-item {
          position: relative;
          cursor: pointer;
          padding: 10px 10px 10px 15px;

          .title {
            font-size: 14px;
            color: #333;
          }

          .desc {
            color: #999;
            font-size: 12px;
            margin-top: 4px;
          }

          &:after {
            content: '';
            width: 6px;
            height: 6px;
            background: #19B2FF;
            position: absolute;
            top: 15px;
            border-radius: 10px;
            left: 0px;
          }
        }
      }
    }
  }

  .block-2 {
    display: flex;
    min-height: 500px;
    margin-top: 40px;

    .left-block {
      flex: 1;

      .article-content {
        &:not(:first-child) {
          margin-top: 60px;
        }

      }

      .article-block {
        .article-item {
          display: flex;
          padding: 20px 0;
          cursor: pointer;

          img {
            flex-shrink: 0;
            width: 200px;
            height: 120px;
            border-radius: 10px;
            background: #FAFAFA;
          }

          .info {
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            div {
              .art-title {
                font-size: 18px;
                color: #222;
                font-weight: bold;
              }

              .art-desc {
                font-size: 14px;
                color: #666;
                margin-top: 10px;
              }
            }

            .pub-time {
              font-size: 14px;
              color: #999;
            }
          }
        }
      }
    }

    .right-block {
      width: 300px;
      flex-shrink: 0;
      margin-left: 10px;

      .consultant-block {
        .consultant-item {
          padding: 20px 46px;
          margin-top: 20px;
          border: 1px solid #efefef;
          border-radius: 10px;

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
    }
  }
</style>
