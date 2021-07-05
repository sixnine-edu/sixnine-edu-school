<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-24 18:14:55
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-11 15:05:35
-->
<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/course' }">专题课</el-breadcrumb-item>
            <el-breadcrumb-item>课程详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="container">
            <div class="left">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>章节列表</span>
                    </div>
                    <el-table
                        ref="table"
                        highlight-current-row
                        size="small"
                        :show-header="false"
                        v-loading="dataListLoading"
                        :data="dataList"
                        row-key="courseChapterId"
                        lazy
                        :load="treeLazyLoad"
                        @row-click="rowClick"
                    >
                        <el-table-column prop="title" label="章节名称"> </el-table-column>
                    </el-table>
                </el-card>
            </div>
            <div class="right">
                <div class="content">
                    <div class="trading-record">
                        <div class="blue"></div>
                        <span class="record-txt">课件</span>
                    </div>
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
                <div class="content">
                    <div class="trading-record">
                        <div class="blue"></div>
                        <span class="record-txt">视频</span>
                    </div>
                    <div class="video" v-if="videoInfo.title">
                        <vue-aliplayer-v2 ref="VueAliplayerV2" :options="options" />
                    </div>
                    <div class="empty-tip" v-else>
                        <div class="el-icon-receiving"></div>
                        <div class="empty-text">暂无视频数据</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ManuscriptPreviewBox from "@/components/manuscript-preview-box"
import VideoPreviewBox from "@/components/video-preview-box"
import VueAliplayerV2 from "@/components/AliplayerV2/index"
export default {
    data() {
        return {
            info: {},
            courseId: "",
            dataListLoading: false,
            dataList: [],
            ebooksList: [],
            videoInfo: {},
            options: {
                vid: "",
                playauth: "",
                cover: "",
                format: "m3u8", //切换为直播流的时候必填
                encryptType: 1,
                cover: "",
                autoplay: false,
                height: "500px",
                bulletScreenComponentArgs:[],
                skinLayout: [
                    {
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
                        children: [
                            {
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
        let { courseId } = this.$route.query
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
            }).then(({ data }) => {
                this.options.playauth = data.playAuth
                this.options.cover = data.videoMeta.coverURL
                this.options.vid = data.videoMeta.videoId;
                this.options.bulletScreenComponentArgs= [this.bulletScreenText, { fontSize: "18px", color: "#efefef" }, "random"]
            })
        },
        rowClick(row) {
            if (row.courseChapterType == 2) {
                this.getChapterVideoAndEbook(row)
            }
        },
        treeLazyLoad(tree, treeNode, resolve) {
            this.$http({
                url: this.$http.adornUrl("/corp/teacher/chapters"),
                method: "get",
                params: this.$http.adornParams({
                    courseId: this.courseId,
                    parentId: tree.courseChapterId
                })
            }).then(({ data }) => {
                resolve(data)
            })
        },
        async getChapters(courseId) {
            this.courseId = courseId
            this.visible = true
            this.dataListLoading = true
            let res = await this.$http({
                url: this.$http.adornUrl("/corp/teacher/chapters"),
                method: "get",
                params: this.$http.adornParams({
                    courseId,
                    parentId: 0
                })
            })
            this.dataList = res.data
            this.dataListLoading = false
        },
        getChapterVideoAndEbook(row) {
            this.$refs.table.setCurrentRow(row)
            this.$http({
                url: this.$http.adornUrl("/corp/teacher/chapterVideoAndEbook"),
                method: "get",
                params: this.$http.adornParams({
                    courseChapterId: row.courseChapterId
                })
            }).then(({ data }) => {
                this.ebooksList = data.ebooks
                this.videoInfo = data.video
                if (data.video && data.video.objectKey) {
                    this.getVideoPlayAuth(data.video.objectKey)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    margin-top: 20px;
    display: flex;
    .left {
        width: 380px;
    }
    .right {
        flex: 1;
        margin-left: 10px;
        margin-top: -40px;
        .content {
            margin-top: 40px;
        }
        .ebook-list {
            padding-left: 10px;
            .ebook-item {
                margin-top: 10px;
            }
        }
        .video {
            padding-left: 10px;
            margin-top: 10px;
        }
    }
    /deep/ .el-table__row--level-1 {
        cursor: pointer;
    }
}
</style>
