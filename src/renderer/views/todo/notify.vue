<template>
    <div class="app-container">
        <h1>{{ todoMatter.title }}</h1>
        <h5>{{ todoMatter.matter }}</h5>
        <el-button @click="delay" type="primary">
            延迟通知
        </el-button>
        <el-button @click="close" type="danger">
            关闭通知
        </el-button>
        <audio v-show="false" :src="url" id="audio" controls></audio>
    </div>
</template>

<script>
  import { getInfoTodo } from '@/api/todo'
  export default {
    name: 'Notify',
    data() {
      return {
        todoMatter: {},
        audio: {},
        url: 'https://webfs.yun.kugou.com/202004132111/3e70300c77db055f8f2b9d2455ba11d0/G210/M03/1D/01/spQEAF5xZ9aINiDIAAGNPMCER5YAAAGgQP-X1YAAY1U098.mp3'
      }
    },
    created() {
      this.getTodo()
      this.url = 'https://webfs.yun.kugou.com/202004132111/3e70300c77db055f8f2b9d2455ba11d0/G210/M03/1D/01/spQEAF5xZ9aINiDIAAGNPMCER5YAAAGgQP-X1YAAY1U098.mp3'
      this.$nextTick(() => {
        this.audio = document.getElementById('audio')
        this.audio.play()
        this.audio.addEventListener('ended', () => {
          this.audio.play()
        })
      })
    },
    methods: {
      delay() {
        this.audio.pause()
        window.close()
      },
      close() {
        this.audio.pause()
        window.close()
      },
      getTodo() {
        getInfoTodo(this.$route.params.id).then(data => {
          this.todoMatter = data.todo
        })
      }
    }
  }
</script>

<style scoped>
    .app-container {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: #8aba87;
        /*background-color: #5daf34;*/
    }
    h1,h5 {
       color: #fff;
    }
    .el-button {
        left: 35%;
        position: relative;
    }
</style>
