<template>
    <div class="app-container">
        <div v-if="$store.getters.queueCron.length">
            <el-timeline>
                <el-timeline-item
                        v-for="(cron, index) in crons"
                        :key="index"
                        :type="pullType(cron.status, cron.cronData)"
                        :timestamp="cron.status === 'reminderTime' ? cron.cronData.reminderTime : cron.cronData.notificationTime"
                        placement="top">
                    <el-card>
                        <div class="edit-button">
                            <router-link :to="'/todo/create/'+cron.cronData.id" class="link-type">
                                <el-button size="mini" type="primary">
                                    编辑
                                </el-button>
                            </router-link>
                            <el-button size="mini" type="primary" @click="stopCron(cron)">
                                停止
                            </el-button>
                        </div>
                        <h4>{{ cron.cronData.title }} 【{{ cron.status === 'reminderTime' ? '提醒' : '通知' }}】</h4>
                        <p>{{ cron.cronData.matter }}</p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
        <div v-else>
            <el-alert title="暂无定时任务" type="info" center show-icon :closable="false" />
        </div>
    </div>
</template>

<script>
import Mallki from '@/components/TextHoverEffect/Mallki'
import Sticky from '@/components/Sticky'
import { stopAndDelCron } from '@/utils/cron'

export default {
  name: 'TodoMatterList',
  components: { Sticky, Mallki },
  data() {
    return {
      crons: [],
      listQuery: {
        search: {}
      }
    }
  },
  created() {
    this.$store.getters.queueCron.sort((a, b) => {
      return new Date(a.status === 'reminderTime' ? a.cronData.reminderTime : a.cronData.notificationTime).getTime() - new Date(b.status === 'reminderTime' ? b.cronData.reminderTime : b.cronData.notificationTime).getTime()
    })
  },
  methods: {
    load() {
      for (let i = this.crons.length; i < this.$store.getters.queueCron.length; i++) {
        this.crons.push(this.$store.getters.queueCron[i])
      }
    },
    pullType(status, data) {
      let type
      switch (status) {
        case 'reminderTime':
          type = this.filterType(new Date(data.reminderTime).getTime())
          break
        case 'notificationTime':
          type = this.filterType(new Date(data.notificationTime).getTime())
          break
        default:
          break
      }
      return type
    },
    /**
     * 筛选时间节点类型
     * 警告：10分钟、危险：5分钟内
     * @param cronTime
     * @returns {string}
     */
    filterType(cronTime) {
      const currentTime = new Date().getTime()
      if (cronTime - currentTime < 1000 * 60 * 5) {
        return 'danger'
      } else if (cronTime - currentTime < 1000 * 60 * 10) {
        return 'warning'
      }
    },
    /**
     * 停止定时器
     * @param cron
     */
    stopCron(cron) {
      stopAndDelCron(cron.cronData)
    }
  }
}
</script>

<style scoped>
.edit-button {
    float: right;
}
</style>
