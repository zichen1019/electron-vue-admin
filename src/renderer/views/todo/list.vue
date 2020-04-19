<template>
    <div class="infinite-list-wrapper" :style="topDivStyle">
        <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
            <el-timeline>
                <el-timeline-item
                        v-for="(cron, index) in crons"
                        :key="index"
                        :type="pullType(cron.status, cron.cronData)"
                        :timestamp="cron.status === 'reminderTime' ? cron.cronData.reminderTime : cron.cronData.notificationTime"
                        placement="top">
                    <el-card class="list-item" style="height: 500px;margin-right: 80px">
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
        </ul>
        <el-alert
            v-if="loading"
            title="加载中..."
            type="info"
            :closable="false"
            center
            show-icon>
        </el-alert>
        <el-alert
            v-if="noMore"
            title="没有更多了！"
            :closable="false"
            type="info"
            center
            show-icon>
        </el-alert>
    </div>
</template>

<script>
import Mallki from '@/components/TextHoverEffect/Mallki'
import Sticky from '@/components/Sticky'
import { stopAndDelCron } from '@/utils/cron'
// import router from '@/router'

export default {
  name: 'TodoMatterList',
  components: { Sticky, Mallki },
  data() {
    return {
      crons: [],
      listQuery: {
        search: {}
      },
      loading: false,
      // 每次触发无限加载的个数
      pageSize: 2,
      height: 0,
      topDivStyle: 'overflow:auto; height: ' + (document.body.scrollHeight - document.getElementsByClassName('el-menu')[2].getBoundingClientRect().height) + 'px'
    }
  },
  computed: {
    noMore() {
      return this.crons.length === this.$store.getters.queueCron.length
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  created() {
    this.$store.getters.queueCron.sort((a, b) => {
      return new Date(a.status === 'reminderTime' ? a.cronData.reminderTime : a.cronData.notificationTime).getTime() - new Date(b.status === 'reminderTime' ? b.cronData.reminderTime : b.cronData.notificationTime).getTime()
    })
  },
  methods: {
    load() {
      this.loading = true
      // 每次加载计数器
      let count = 0
      console.log(this.pageSize)
      for (let i = this.crons.length; i < this.$store.getters.queueCron.length; i++) {
        setTimeout(() => {
          if (count === 2) {
            return
          }
          this.loading = false
          this.crons.push(this.$store.getters.queueCron[i])
          count++
        }, 2000)
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
