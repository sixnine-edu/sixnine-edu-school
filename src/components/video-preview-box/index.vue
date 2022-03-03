<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-12-22 16:46:41
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-11 10:48:58
-->
<template>
    <div class="video-privew-container">
        <div :class="['content-item', { border: showDel }]">
            <div class="cover-img" @click="getVideoPlayAuth">
                <img :src="coverImg" />
                <i class="el-icon-video-play" />
            </div>
            <div class="my-title">{{ title }}</div>
            <i v-if="showDel" class="el-icon-delete" @click="$emit('onDel')"></i>
        </div>
        <el-dialog v-if="centerDialogVisible" :title="title" append-to-body :visible.sync="centerDialogVisible" center>
            <vue-aliplayer-v2 ref="VueAliplayerV2" :options="options" />
        </el-dialog>
    </div>
</template>

<script>
import VueAliplayerV2 from "@/components/AliplayerV2/index"

export default {
    components: { VueAliplayerV2 },
    props: {
        coverImg: {
            type: String,
            default: ""
        },
        objectKey: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        materialLibState: {
            type: Number,
            default: 0
        },
        mediaType: {
            type: String,
            default: "video"
        },
        showDel: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            centerDialogVisible: false,
            options: {
                vid: this.objectKey,
                playauth: "",
                cover: "",
                format: "m3u8", //切换为直播流的时候必填
                encryptType: 1,
                mediaType: this.mediaType,
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
    methods: {
        onDel() {},
        getVideoPlayAuth() {
            if (this.materialLibState != 3) {
                this.$message({
                    message: "转码未完成",
                    type: "info",
                    duration: 1500
                })
                return
            }
            this.$http({
                url: this.$http.adornUrl(`/corp/oss/vod/playAuth/${this.objectKey}`),
                method: "get",
                params: this.$http.adornParams({
                    videoId: this.objectKey
                })
            }).then(({ data }) => {
                this.options.playauth = data.playAuth
                this.options.cover = data.videoMeta.coverURL
                this.options.vid = data.videoMeta.videoId
                this.centerDialogVisible = true
                console.log(this.options)
                // this.initPlayer()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.video-privew-container {
    cursor: pointer;

    & + & {
        margin-top: 10px;
    }
    .content-item {
        display: flex;
        position: relative;

        &.border {
            padding: 10px 0;
            border-bottom: 1px solid #efefef;
            margin: 10px 0;
        }
        .my-title {
            margin-left: 8px;
            flex: 1;
            font-size: 12px;
        }
        i {
            position: absolute;
            top: 50%;
            transform: translate(-50%);
            right: 10px;
        }
    }
    .cover-img {
        position: relative;
        width: 80px;
        height: 80px;
        > img {
            width: 80px;
            height: 80px;
        }
        .el-icon-video-play {
            font-size: 34px;
            color: #fff;
            position: absolute;
            left: 0;
            right: 0;
            top: 55%;
            transform: translateY(-50%);
            bottom: 0;
            margin: 0 auto;
            z-index: 99;
            text-align: center;
        }
        &:after {
            content: "";
            position: absolute;
            background: rgba($color: #000000, $alpha: 0.7);
            left: 0;
            right: 0;
            top: 0;
            width: initial;
            height: initial;
        }
    }
}
</style>
