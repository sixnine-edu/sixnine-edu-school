<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-15 11:12:19
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-30 10:06:19
-->
<template>
  <div class="page-content">
    <div class="top-block">
      <el-breadcrumb separator="/" class="app-content">
        <el-breadcrumb-item :to="{ path: '/college/index' }">成长学院</el-breadcrumb-item>
        <el-breadcrumb-item>课程详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="chapter-info app-content">
        <img :src="info.coverImg" />
        <div class="info">
          <h2>
            <span>
              <el-tag type="primary" size="mini" v-if="info.liveType==0">直播</el-tag>
              <el-tag type="danger" size="mini" v-else-if="info.liveType==1">录播</el-tag>
              <el-tag type="success" size="mini" v-else-if="info.liveType==2">现场</el-tag>
              {{ info.title }}
            </span>
          </h2>
          <div class="desc">时间:{{info.liveTime}}</div>
          <div class="desc">地点:{{info.liveAddress}}</div>
          <div class="price-box">
            <div class="price" v-if="info.livePrice==0"><span>免费</span></div>
            <div class="price" v-else>&yen;<span>{{info.livePrice}}</span></div>
            <div class="sign">已报名:{{info.signNum}}</div>
          </div>
          <template v-if="info.applyState===0">
            <el-button type="primary" disabled>已申请</el-button>
          </template>
          <template v-else>
            <el-button type="danger" v-if="!info.belongId" @click="toPay">立即报名</el-button>
            <el-button type="primary" v-else @click="curIndex=1">开始学习</el-button>
          </template>
        </div>
      </div>
    </div>
    <div class="app-content">
      <div class="course-info">
        <div class="info-left">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="tab-box">
              <div :class="{active:curIndex==0}" @click="curIndex=0">详情</div>
              <div :class="{active:curIndex==1}" @click="curIndex=1">目录</div>
            </div>
            <div v-if="curIndex==0" v-html="info.introduce"></div>
            <div v-if="curIndex==1" class="chapter-block">
              <el-collapse v-if="courseList.length>0" v-model="collapseActive">
                <el-collapse-item :name="item.chapterId" :title="item.title" v-for="(item,index) in courseList" :key="index">
                  <div class="summary-block" :class="{disable:!info.belongId}" v-if="item.children">
                    <div class="summary-item" v-for="(citem,cindex) in item.children" :key="cindex" @click="toPlay(citem)">
                      <span>{{citem.title}}</span>
                      <span class="el-icon-video-play"></span>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </div>
        <div class="info-rigth">
          <el-card class="box-card" v-for="item in info.lecturerList" :key="item.lecturerId" shadow="never">
            <div slot="header" class="clearfix">
              <span>讲师介绍</span>
            </div>
            <div class="content">
              <img :src="item.headImg" class="headImg" />
              <h2>{{item.nickName}}</h2>
              <p>{{item.introduce}}</p>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <el-dialog v-if="centerDialogVisible" fullscreen :title="currentTitle" append-to-body :visible.sync="centerDialogVisible"
      center>
      <vue-aliplayer-v2 ref="VueAliplayerV2" :options="options" />
    </el-dialog>
  </div>
</template>
<script>
  import VueAliplayerV2 from "@/components/AliplayerV2/index"

  import {
    treeDataTranslate
  } from '@/utils'
  export default {
    components: {
      VueAliplayerV2
    },
    data() {
      return {
        collapseActive:[],
        centerDialogVisible: false,
        currentTitle: "",
        info: {},
        curIndex: 0,
        courseList: [],
        liveId: '',
        options: {
          vid: '',
          playauth: "",
          cover: "",
          format: "m3u8", //切换为直播流的时候必填
          encryptType: 1,
          mediaType: "video",
          height: "80vh",
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
    mounted() {
      let liveId = this.$route.query.liveId;
      this.liveId = liveId;
      this.getCourseDetail(liveId);
    },
    methods: {
      toPlay(citem) {
        if (!this.info.belongId) {
          this.$message.info("请先购买课程")
          return false;
        }
        if (citem.urlType === 0) {
          let obj = JSON.parse(citem.srcUrl)[0]
          this.currentTitle = citem.title;
          this.getVideoPlayAuth(obj.objectKey)
        } else {
          window.open(citem.srcUrl);
        }
      },
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
          this.options.vid = data.videoMeta.videoId
          this.options.bulletScreenComponentArgs = [this.bulletScreenText, {
            fontSize: "18px",
            color: "#efefef"
          }, "random"]

          this.centerDialogVisible = true

        })
      },
      toPay() {
        this.$router.push({
          name: "collegeConfirm",
          query: {
            liveId: this.liveId
          }
        })
      },
      getCourseDetail(liveId) {
        this.$http({
          url: this.$http.adornUrl(`/corp/live/${liveId}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.info = data;
          if (data.sortChapterList.length > 0) {
            
            this.courseList = treeDataTranslate(data.sortChapterList, 'chapterId', 'parentId');
            data.sortChapterList.forEach((item)=>{
              this.collapseActive.push(item.chapterId)
            })
            
          }
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

  .chapter-block {
    .summary-block {

      &.disable {
        // background-color: #f7f7f7;

        .summary-item {
          &:hover {
            // background-color: #f7f7f7;
          }
        }
      }

      // padding-left: 20px;

      .summary-item {
        padding: 16px 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-icon-video-play {
          font-size: 18px;
          color: #999;
        }

        &:hover {
          background-color: #CCEEFF;
        }
      }
    }

  }

  .page-content {
    width: 100%;
    background: #f5f5f5;
  }

  .top-block {
    background: #fff;
  }

  .chapter-info {
    display: flex;

    padding: 20px 0;

    >img {
      width: 340px;
      height: 240px;
      border-radius: 10px;
    }

    >.info {
      margin-left: 20px;
      width: 400px;

      h2 {
        font-size: 18px;


      }

      .desc {
        font-size: 14px;
        color: #999;
        margin-top: 10px;
      }
    }

    .price-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 200px;
      margin-top: 60px;

      .price {

        font-size: 16px;
        color: #FF5F33;

        >span {
          font-size: 26px;
          font-weight: bold;
        }
      }

      .sign {
        color: #999;
        font-size: 14px;
      }

    }
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

    .info-rigth {
      width: 300px;
      margin-left: 20px;

      .box-card {
        &:not(:first-child) {
          margin-top: 20px;
        }
      }

      .content {
        text-align: center;

        .headImg {
          width: 110px;
          height: 110px;
          border-radius: 100%;
        }

        h2 {
          margin: 10px 0;
        }

        p {
          line-height: 22px;
          color: #666;
        }
      }

    }
  }


  .el-button {
    padding: 12px 60px;
    margin-top: 20px;
  }

  .el-button--danger {
    background: #FF5F33;
    border-color: #FF5F33;

  }
</style>
