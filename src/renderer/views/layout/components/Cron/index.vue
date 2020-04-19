<template>

</template>

<script>
  import { getTodo } from '@/api/todo'
  import { createToDoCron } from '@/utils/cron'

  export default {
    name: 'Cron',
    created() {
      // 成功登录后加载定时任务
      this.getTodoList()
    },
    methods: {
      getTodoList() {
        getTodo({
          userId: this.$store.getters.userId,
          state: 0
        }).then(data => {
          // 初始化定时器任务队列
          this.$store.getters.queueCron.length = 0
          data.list.forEach(todoMatter => {
            if (todoMatter.reminderTime) {
              createToDoCron(new Date(todoMatter.reminderTime), todoMatter, 'reminderTime')
            }
            if (todoMatter.notificationTime) {
              createToDoCron(new Date(todoMatter.notificationTime), todoMatter, 'notificationTime')
            }
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
