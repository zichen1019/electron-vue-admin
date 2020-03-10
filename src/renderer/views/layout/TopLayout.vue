<template>
  <div>
    <div id="mytitle">
      {{ title }}
    </div>
    <TitleButton type="min" />
    <TitleButton type="max" />
    <TitleButton type="close" />
  </div>
</template>

<script>
import TitleButton from '@/components/TitleButton'

export default {
  name: 'TopButton',
  components: { TitleButton },
  props: ['title']
}
</script>

<style>
  html,body{
    padding: 0px;
    margin: 0px;
    border: 0px;
    width:100%;
    height:100%;
  }
  #mytitle {
    top: 2vh;
    position: relative;
    z-index: 10000;
    font-size: 14px;
    text-align: center;
  }
</style>
