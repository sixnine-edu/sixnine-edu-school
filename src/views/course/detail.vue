<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-24 18:14:55
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-29 18:50:16
-->
<template>
  <div class="course-detail-container">
    <div class="breadcrumb-content">
      <div class="breadcrumb-wrap">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/course/index' }">备授课</el-breadcrumb-item>
          <el-breadcrumb-item>课程详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

    </div>
    <div class="video-content">
      <template v-if="videoInfo.title">
        <div class="video-title">{{videoInfo.title}}</div>
        <vue-aliplayer-v2 ref="VueAliplayerV2" :options="options" />
      </template>
      <div class="empty-video" v-else>
        请选择章节观看视频
      </div>
    </div>
    <div class="course-content">
      <div class="course-info">
        <div class="info-left">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="tab-box">
              <div :class="{active:curIndex==0}" @click="curIndex=0">目录</div>
              <div :class="{active:curIndex==1}" @click="curIndex=1">课件</div>
            </div>
            <div v-if="curIndex==0" class="chapter-block">
              <el-collapse v-if="courseList.length>0" v-model="collapseActive">
                <el-collapse-item :name="item.courseChapterId" :title="item.title" v-for="(item,index) in courseList"
                  :key="index">
                  <div class="summary-block" v-if="item.children">
                    <div class="summary-item" :class="{active:citem.courseChapterId==courseChapterId}" v-for="(citem,cindex) in item.children"
                      :key="cindex" @click="getChapterVideoAndEbook(citem.courseChapterId)">
                      <span>{{citem.title}}</span>
                      <span class="el-icon-video-play"></span>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div v-if="curIndex==1" class="ebook-box">
              <div class="ebook-list" v-if="ebooksList.length > 0">
                <div class="ebook-item" v-for="item in ebooksList" :key="item.objectKey">
                  <manuscript-preview-box docType="pdf" :objectKey="item.objectKey" :title="item.title" :coverImg="item.coverImg" />
                </div>
              </div>
              <div class="empty-tip" v-else>
                <div class="el-icon-receiving"></div>
                <div class="empty-text">暂无课件数据</div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ManuscriptPreviewBox from "@/components/manuscript-preview-box"
  import VideoPreviewBox from "@/components/video-preview-box"
  import VueAliplayerV2 from "@/components/AliplayerV2/index"
  import {
    treeDataTranslate
  } from '@/utils'
  export default {
    data() {
      return {
        info: {},
        collapseActive: [],
        curIndex: 0,
        courseId: "",
        dataListLoading: false,
        courseList: [],
        ebooksList: [],
        videoInfo: {},
        courseChapterId: "",
        options: {
          vid: "",
          playauth: "",
          cover: "",
          format: "m3u8", //切换为直播流的时候必填
          encryptType: 1,
          cover: "",
          autoplay: true,
          width: "1000px",
          height: "430px",
          bulletScreenComponentArgs: [],
          skinLayout: [{
              name: "bigPlayButton",
              align: "blabs",
              x: 30,
              y: 80
            },
            {
              name: "H5Loading",
              align: "cc"
            },
            {
              name: "errorDisplay",
              align: "tlabs",
              x: 0,
              y: 0
            },
            {
              name: "infoDisplay"
            },
            {
              name: "tooltip",
              align: "blabs",
              x: 0,
              y: 56
            },
            {
              name: "thumbnail"
            },
            {
              name: "controlBar",
              align: "blabs",
              x: 0,
              y: 0,
              children: [{
                  name: "progress",
                  align: "blabs",
                  x: 0,
                  y: 44
                },
                {
                  name: "playButton",
                  align: "tl",
                  x: 15,
                  y: 12
                },
                {
                  name: "timeDisplay",
                  align: "tl",
                  x: 10,
                  y: 7
                },
                {
                  name: "fullScreenButton",
                  align: "tr",
                  x: 10,
                  y: 12
                },
                {
                  name: "setting",
                  align: "tr",
                  x: 15,
                  y: 12
                },
                {
                  name: "volume",
                  align: "tr",
                  x: 5,
                  y: 10
                }
              ]
            }
          ]
        }
      }
    },
    computed: {
      bulletScreenText() {
        let user = this.$store.state.user
        return `${user.empName} ${user.userName} 正在观看`
      }
    },
    components: {
      ManuscriptPreviewBox,
      VideoPreviewBox,
      VueAliplayerV2
    },
    mounted() {
      let {
        courseId
      } = this.$route.query
      this.courseId = courseId
      this.getChapters(courseId)
    },
    methods: {
      getVideoPlayAuth(objectKey) {
        this.$http({
          url: this.$http.adornUrl(`/corp/oss/vod/playAuth/${objectKey}`),
          method: "get",
          params: this.$http.adornParams({
            videoId: objectKey
          })
        }).then(({
          data
        }) => {
          this.options.playauth = data.playAuth
          this.options.cover = data.videoMeta.coverURL
          this.options.vid = data.videoMeta.videoId;
          this.options.bulletScreenComponentArgs = [this.bulletScreenText, {
            fontSize: "18px",
            color: "#efefef"
          }, "random"]
        })
      },


      async getChapters(courseId) {
        this.courseId = courseId
        this.visible = true
        this.dataListLoading = true
        let res = await this.$http({
          url: this.$http.adornUrl("/corp/teacher/chaptersAll"),
          method: "get",
          params: this.$http.adornParams({
            courseId,
            parentId: 0
          })
        })
        this.courseList = treeDataTranslate(res.data, 'courseChapterId', 'parentId');
        res.data.forEach((item) => {
          this.collapseActive.push(item.courseChapterId)
        })
        this.dataListLoading = false;
        // if (this.courseList.length > 0 && this.courseList[0].children && this.courseList[0].children.length > 0) {
        //   let courseChapterId = this.courseList[0].children[0].courseChapterId;
        //   this.getChapterVideoAndEbook(courseChapterId)
        // }
      },
      getChapterVideoAndEbook(courseChapterId) {
        this.courseChapterId = courseChapterId;
        this.$http({
          url: this.$http.adornUrl("/corp/teacher/chapterVideoAndEbook"),
          method: "get",
          params: this.$http.adornParams({
            courseChapterId,
          })
        }).then(({
          data
        }) => {
          this.ebooksList = data.ebooks
          this.videoInfo = data.video
          if (data.video && data.video.objectKey) {
            this.getVideoPlayAuth(data.video.objectKey)
          }
        })

        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  .course-detail-container {
    background: #F2F2F2;
  }

  .breadcrumb-content {
    background: #fff;
    padding: 20px 0;

    .breadcrumb-wrap {
      width: 1200px;
      margin: auto;
    }
  }

  .video-content {
    background: #282828;
    width: 100%;
    height: 500px;
    overflow: hidden;

    .empty-video {
      color: #fff;
      width: 1000px;
      height: 430px;
      line-height: 420px;
      text-align: center;
      margin: 40px auto;
      background: #000;
      font-size: 24px;
    }

    .video-title {
      color: #fff;
      font-size: 16px;
      padding: 20px 0;
      width: 1000px;
      margin: 0 auto;
    }
  }

  .course-content {
    width: 1000px;
    margin: auto;
  }

  .prism-player {
    margin: 0 auto;
  }

  .course-info {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    /deep/ .el-card {
      border: none;
    }

    .info-left {
      flex: 1;

      /deep/ .el-card__header {
        padding: 0;
        border: none;
      }

      /deep/ .el-card__body {
        padding: 0 20px 20px 20px;
      }

      /deep/ .el-collapse-item__content {
        padding-bottom: 10px;
      }

      /deep/ .el-collapse-item__header {
        background-color: #eee;
        padding-left: 10px;
      }

      .tab-box {
        display: flex;

        >div {
          cursor: pointer;
          flex: 1;
          text-align: center;
          padding: 16px 0;
          background: #fff;
          color: #999;

          &.active {
            background: #fcfcfc;
            color: #222;
            font-weight: bold;
          }
        }
      }
    }

  }

  .ebook-box {
    min-height: 500px;

    .ebook-list {
      padding-left: 10px;

      .ebook-item {
        margin-top: 10px;
      }
    }
  }


  .chapter-block {
    .summary-block {
      .summary-item {
        padding: 14px 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-icon-video-play {
          font-size: 18px;
          color: #999;
        }

        &:hover,
        &.active {
          background-color: #FFFBF2;
          color: #FFC23D;
        }
      }
    }

  }
</style>
