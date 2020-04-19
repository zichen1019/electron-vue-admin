<template>
  <div>
    <div class="title">
      日程
    </div>
    <TitleButton type="min" />
    <TitleButton type="max" />
    <TitleButton type="close" />
  </div>
</template>

<script>
import Mallki from '@/components/TextHoverEffect/Mallki'
import TitleButton from '@/components/TitleButton'

export default {
  name: 'TopButton',
  components: { TitleButton, Mallki }
}
</script>

<style scoped>
  html,body{
    padding: 0px;
    margin: 0px;
    border: 0px;
    width:100%;
    height:100%;
  }
  .title {
    padding: 5px 0;
    left: 30%;
    padding-left: 20%;
    position: relative;
    z-index: 10000;
    font-size: 20px;
    -webkit-app-region: drag;
    width:70%;
    height:100%;
  }
</style>
