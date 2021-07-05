<template>
  <div class="app-content">
    <div class="crumbs">
      <a class="item-a" href="#/headmaster/index">校长首页</a>
      <span class="arrow">&gt;</span>
      <span class="item-span">文章详情</span>
    </div>
    <div class="header-title">
      {{info.title}}
    </div>
    <div class="article-content" v-html="info.content">
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        info: {}
      }
    },
    mounted() {
      let newsId = this.$route.query.newsId;
      this.$http({
        url: this.$http.adornUrl(`/corp/master/masternews/${newsId}`),
        method: "get",
        params: this.$http.adornParams()
      }).then(({
        data
      }) => {
        this.info = data;
      })
    }
  }
</script>

<style lang="scss" scoped>
  .header-title {
    font-size: 22px;
  }

  .article-content {
    margin-top: 20px;
  }
</style>
