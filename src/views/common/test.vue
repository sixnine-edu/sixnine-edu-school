<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-12-23 14:30:36
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-22 17:43:43
-->
<template>
  <div class="photo-preview">
    <div class="thumb" ref="thumb">
      <div ref="thumb-img" :class="['thumb-img',{active:current==index}]" v-for="(item,index) in thumbList" :key="index"
        @click="onThumbClick(index)">
        <img :src="item.imgUrl" oncontextmenu="return false;" ondragstart="return false;" />
        <div class="page">{{item.seq+1}}</div>
      </div>
    </div>
    <div class="content" ref="content" @scroll="onContenScroll">
      <img ref="thumb-detail" v-for="item in picList" :src="item.imgUrl" oncontextmenu="return false;" ondragstart="return false;" />
      <div class="pagination">{{current+1}}/{{picList.length}}</div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        picList: [],
        thumbList: [],
        current: 0,
        isClick: false
      }
    },
    mounted() {
      let objectKey = "6b1c9108a21b45c1b1a259adf357ec05.pdf"
      this.$http({
        url: this.$http.adornUrl(`/corp/course/pdfImg/${objectKey}`),
        method: "get",
        params: this.$http.adornParams({
          key: objectKey
        })
      }).then(({
        data
      }) => {
        this.picList = data
        data.forEach(({
          imgUrl,
          ...other
        }) => {
          this.thumbList.push({
            ...other,
            imgUrl: imgUrl + "?x-oss-process=image/resize,w_300"
          })

        })
      })
    },
    computed: {
      imgs() {
        return this.$refs['thumb-detail'];
      },
      thumbImgs() {
        return this.$refs['thumb-img'];
      }
    },
    methods: {
      onThumbClick(index) {
        this.current = index;
        this.isClick = true;
        let imgOffsetTop = this.imgs[index].offsetTop;
        this.$refs['content'].scrollTo(0, imgOffsetTop)
        setTimeout(() => {
          this.isClick = false;
        }, 300)
      },
      onContenScroll(e) {
        if (this.isClick) {
          return;
        }
        let scrollTop = e.target.scrollTop;
        let $imgs = this.imgs;
        for (let i = $imgs.length - 1; i >= 0; i--) {
          if ($imgs[i].offsetTop <= scrollTop) {
            this.current = i;
            this.$refs['thumb'].scrollTo(0, this.thumbImgs[i].offsetTop - 400)
            break;
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .photo-preview {
    box-sizing: border-box;
    display: flex;
    margin-top: 40px;

    .thumb {
      height: calc(100vh - 40px);
      overflow: scroll;
      padding: 20px;
      background: #323639;

      .thumb-img {
        width: 200px;
        margin: 20px auto;
        text-align: center;

        .page {
          color: #fff;
          margin-top: 10px;
        }

        img {
          opacity: 0.7;
          width: 150px;
          height: auto;
        }

        &.active {
          img {
            opacity: 1;
            border: 4px solid #96b5f6;
          }
        }
      }
    }

    .content {
      position: relative;
      background: #525659;
      height: calc(100vh - 40px);
      padding: 20px;
      overflow: scroll;
      flex: 1;
      text-align: center;

      img {
        display: block;
        max-width: 1200px;
        margin: 20px auto;
      }

      .pagination {
        position: fixed;
        top: 0px;
        left: 0;
        right: 0;
        background-color: #323639;
        padding: 20px;
        color: #FFFCF8;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        // box-shadow: 0 2px 12px  rgb(0,0,0,0.5);

      }
    }
  }
</style>
