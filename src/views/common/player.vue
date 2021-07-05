<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-12-17 10:54:19
 * @LastEditors: yongqing
 * @LastEditTime: 2020-12-25 15:55:08
-->
<template>
    <div v-if="show">
        <!-- :vid="vid" :playAuth="playAuth" :source="source" -->
        <vue-aliplayer-v2 ref="VueAliplayerV2" :options="options" />
    </div>
</template>

<script>
import VueAliplayerV2 from "@/components/AliplayerV2/index"

export default {
    components: { VueAliplayerV2 },
    data() {
        return {
            vid: "4e7e077be93f4f13b6fc403875a08151",
            options: {
                vid: "4e7e077be93f4f13b6fc403875a08151",
                playauth: "",
                cover: "",
                // source:'//player.alicdn.com/video/aliyunmedia.mp4',
                // isLive: true //切换为直播流的时候必填
                format: "m3u8", //切换为直播流的时候必填
                encryptType: 1
            },
            //source: "//player.alicdn.com/video/aliyunmedia.mp4",
            // source: "//ivi.bupt.edu.cn/hls/cctv1.m3u8",
            show: false,
            isShowMultiple: false,
            cover: ""
        }
    },
    /**
     * 页面渲染完成时：此时js脚本已加载，Aliplayer已定义，可以使用
     * 如果在created生命周期函数中使用，会报告Aliplayer is not defined错误
     */
    mounted() {
        this.$http({
            url: this.$http.adornUrl(`/corp/vod/getVideoPlayAuth/${this.vid}`),
            method: "get",
            params: this.$http.adornParams({
                videoId: this.vid
            })
        }).then(({ data }) => {
            this.options.playauth = data.playAuth
            this.options.cover = data.videoMeta.coverURL
            this.show = true
            this.initPlayer()
        })
    },
    methods: {
        initPlayer() {},
        play() {
            this.$refs.VueAliplayerV2.play()
        },

        pause() {
            this.$refs.VueAliplayerV2.pause()
        },

        replay() {
            this.$refs.VueAliplayerV2.replay()
        },

        getCurrentTime() {
            // this.$refs.VueAliplayerV2.getCurrentTime();
            this.source = "http://ivi.bupt.edu.cn/hls/cctv1.m3u8"
        },

        getStatus() {
            const status = this.$refs.VueAliplayerV2.getStatus()
            console.log(`getStatus:`, status)
            alert(`getStatus:${status}`)
        },

        showMultiple() {
            this.isShowMultiple = !this.isShowMultiple
        }
    }
}
</script>

<style lang="scss"></style>
