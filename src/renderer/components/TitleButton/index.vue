<template>
  <div
    class="titlebtn"
    :style="style"
    @click="send"
  />
</template>

<script>
const style = {
  min: {
    backgroundColor: 'green',
    right: '65px'
  },
  max: {
    backgroundColor: 'yellow',
    right: '40px'
  },
  close: {
    backgroundColor: 'red',
    right: '15px'
  }
}

export default {
  name: 'TitleButton',
  props: ['type'],
  computed: {
    style: function() {
      return style[this.type]
    }
  },
  methods: {
    send: function() {
      const { ipcRenderer } = require('electron')
      ipcRenderer.send(this.type)
    }
  }
}
</script>

<style>
  .titlebtn {
    position: absolute;
    top: 10px;
    width: 15px;
    height: 15px;
    -webkit-app-region: no-drag;
    border-radius: 50%;
    z-index: 10;
  }
  .titlebtn:hover{
    border: 1px solid rgba(248, 242, 242, 0.6);
  }
</style>
