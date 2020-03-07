<template>
  <div>
    <div id="mytitle" />
    <TitleButton type="min" />
    <TitleButton type="max" />
    <TitleButton type="close" />
  </div>
</template>

<script>
import TitleButton from '@/components/TitleButton'

export default {
  name: 'TopButton',
  components: { TitleButton }
}
</script>

<style>
html,body{
  padding: 0px;
  margin: 0px;
  border: 0px;
  width:100%;
  height:100%
}
#mytitle {
  position: absolute;
  width: 100%;
  height: 52px;
  -webkit-app-region: drag;
}
</style>
