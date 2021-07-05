<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
  mounted () {
    // 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
    window.addEventListener('hashchange', () => {
      let currentPath = window.location.hash.slice(1)
      if (this.$route.path !== currentPath) {
        this.$router.push(currentPath)
      }
    }, false)
  },
  computed: {
    key () {
      return this.$route.path + Math.random()
    }
  }
}
</script>
