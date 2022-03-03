<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-12-22 17:37:47
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-11 15:06:01
-->
<template>
  <div class="manuscript-preview-box" v-loading="loading">
    <div :class="['content-item', { border: showDel }]">
      <span class="icon-pdf" v-if="docType == 'pdf'" @click="toPreview"></span>
      <el-image v-if="docType == 'pic'" @click="toPreview" fit="contain" style="width: 50px; height: 50px" :src="coverImg + '?x-oss-process=image/resize,m_fill,h_120,w_120'"
        :preview-src-list="[coverImg]">
      </el-image>
      <div class="my-title" @click="toPreview">{{ title }}</div>
      <i v-if="showDel" class="el-icon-delete" @click="$emit('onDel')"></i>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ""
      },
      coverImg: {
        type: String,
        default: ""
      },
      objectKey: {
        type: String,
        default: ""
      },
      showDel: {
        type: Boolean,
        default: false
      },
      docType: {
        type: String,
        validator: function(value) {
          // 这个值必须匹配下列字符串中的一个
          return ["pic", "pdf"].indexOf(value) !== -1
        }
      }
    },
    data() {
      return {
        loading: false,
        picList: []
      }
    },
    methods: {
      toPreview() {
        if (!this.objectKey) {
          return
        }
        window.open(`/#/photo-preview?objectKey=${this.objectKey}&title=${this.title}`)

      }
    }
  }
</script>

<style lang="scss">
  .manuscript-preview-box {
    .content-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;

      &.border {
        padding: 10px 0;
        border-bottom: 1px solid #efefef;
        margin: 10px 0;
      }

      .icon-pdf {
        display: inline-block;
        background: url("../../assets/img/icon_pdf.png") no-repeat;
        background-size: contain;
        width: 40px;
        height: 40px;
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
  }

  .carouseimg {
    width: 80vw;
    display: block;
    margin-bottom: 50px;
  }
</style>
