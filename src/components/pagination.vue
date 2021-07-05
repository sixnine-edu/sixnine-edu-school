<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-21 00:17:18
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-21 00:18:32
-->
<template>
  <div class="pagination">
    <div class="pages" v-if="pages > 1">
      <a
        href="javascript:void(0);"
        class="item prev"
        :class="{default: value <= 1}"
        @click="changePage(value -1)"
      >上一页</a>
      <div v-for="(item, index) in rainbow" :key="index">
        <a
          href="javascript:void(0);"
          @click="changePage(item)"
          class="item"
          :class="{cur: value == item}"
          v-if="item !== '...'"
        >{{item}}</a>
        <span class="ellipsis" v-else>...</span>
      </div>
      <a
        href="javascript:void(0);"
        class="item next"
        :class="{default: value > pages - 1}"
        @click="changePage(value +1)"
      >下一页</a>
      <div class="go-page">
        到第
        <input type="text" class="page-input" v-model="goCurrent" />页
        <a href="javascript:void(0);" @click="changePage(goCurrent)" class="page-btn">GO</a>
      </div>
      <div class="total-num">
        共
        <span class="num">{{pages}}</span>页
      </div>
    </div>
  </div>
</template>

<script>
import PageUtil from '@/utils/pageUtil'
export default {
  data () {
    return {
      goCurrent: '',
    }
  },
  props: {
    value: {
      default: 1,
      type: [Number,String]
    },
    pages: {
      default: 1,
      type: Number
    },
    // 每屏展示的页数
    displayCount: {
      default: 5,
      type: Number
    },
  },
  computed: {
    rainbow () {
      return PageUtil.rainbowWithDot(this.value, this.pages, 5)
    }
  },
  methods: {
    changePage (current) {
      if (current == '') {
        return
      }
      current = parseInt(current)
      if (current > this.pages && this.pages) {
        return
      }
      if (current < 1) {
        return
      }
      this.$emit('input', current)
      this.$emit('changePage', current)
    }
  }
}
</script>

<style scoped>
</style>
