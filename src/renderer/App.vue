<template>
  <div id="app">
    <top-layout :title.sync="$store.getters.title" />
    <router-view />
  </div>
</template>

<script>
import TopLayout from '@/views/layout/TopLayout'

export default {
  name: 'App',
  components: { TopLayout }
}
</script>
<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式
</style>
