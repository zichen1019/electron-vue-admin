<template>
  <div id="app">
    <top-button />
    <router-view />
  </div>
</template>

<script>
import TopButton from '@/views/layout/components/TopButton'

export default {
  name: 'App',
  components: { TopButton }
}
</script>
<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式
</style>
