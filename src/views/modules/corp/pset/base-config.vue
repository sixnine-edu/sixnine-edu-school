<template>
  <div class="mod-pay">
    <domain ref="domain" />
    <sms ref="sms" />
  </div>
</template>
<script>
import sms from './sms-config.vue'
import domain from './domain-config.vue'
export default {
  data () {
    return {
    }
  },
  methods: {

  },
  components: {
    sms,
    domain
  }
}
</script>
<style lang="scss">
</style>

