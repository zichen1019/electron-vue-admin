import { CronJob, CronTime } from 'cron'
import store from '@/store'
import { parseTime } from '@/utils'
import { ipcRenderer } from 'electron'

/**
 * 创建一个立即生效的待办定时器
 * @param cronTime    定时器表达式或者日期
 * @param cronData    定时器绑定的数据
 * @param status      状态：提醒、通知
 */
export function createToDoCron(cronTime, cronData, status) {
  let job
  try {
    job = new CronJob(cronTime, () => {
      store.getters.vue.$notify({
        title: cronData.title,
        message: cronData.matter + '\n\r执行时间：' + parseTime(Date.now()),
        duration: 0,
        type: 'success'
      })
      switch (cronData.mode) {
        case 1: {
          // 系统通知
          // Notification option: https://www.electronjs.org/docs/api/notification#new-notificationoptions-%E5%AE%9E%E9%AA%8C%E5%8A%9F%E8%83%BD
          const option = {
            title: cronData.title,
            body: cronData.matter + '\n\r执行时间：' + parseTime(Date.now()),
            silent: !cronData.isPromptTone, // silent:true-关闭声音、false-开启声音
            icon: cronData.icon,
            timeoutType: 'never', // 待探索，值为default、never
            tag: cronData.id
          }
          const notification = new window.Notification(option.title, option)
          notification.onclick = () => {
            console.log('通知被点击')
          }
          break
        }
        case 2: {
          // 软件通知
          ipcRenderer.send('openNewModal', { url: '/notify/' + cronData.id, width: 800, height: 600 })
          break
        }
        case 3: {
          // 邮件通知
          break
        }
        default:
          break
      }
      cronData.status = status
      stopAndDelCron(cronData)
    }, null, true, 'Asia/Shanghai')
    job.cronData = cronData
    job.status = status
    job.start()
    store.getters.queueCron.push(job)
  } catch (e) {
    if (e.message === 'WARNING: Date in past. Will never be fired.') {
      job && job.stop()
      console.log(cronData.title + '超时已停止')
    } else {
      console.log(e)
    }
  }
}

/**
 * 停止和移除当前定时器
 * @param cronData  定时器绑定的数据
 */
export function stopAndDelCron(cronData) {
  store.getters.queueCron.splice(store.getters.queueCron.findIndex(cron => {
    return (cron.cronData.id = cronData.id && cron.status === cronData.status)
  }), 1)
}

/**
 * 修改时间并重新启动定时任务
 * @param cronData  定时器绑定的数据
 * @param index     定时任务队列中的序号
 * @param date      定时任务时间
 */
export function reStartCron(cronData, index, date) {
  const cron = store.getters.queueCron[index]
  cron.stop()
  cron.cronData = cronData
  cron.setTime(new CronTime(date), 'Asia/Shanghai')
  cron.start()
  store.getters.queueCron[index] = cron
}

/**
 * 更新定时器
 * @param cronData  定时器绑定的数据
 */
export function updateCron(cronData) {
  // 1. 判断是否存在定时任务
  const cronStatus = hasCron(cronData)
  // 2. 如果存在
  if (cronStatus.hasReminder) {
    reStartCron(cronData, cronStatus.reminderIndex, new Date(cronData.reminderTime))
  } else {
    createToDoCron(new Date(cronData.reminderTime), cronData, 'reminderTime')
  }
  if (cronStatus.hasNotification) {
    reStartCron(cronData, cronStatus.notificationIndex, new Date(cronData.notificationTime))
  } else {
    createToDoCron(new Date(cronData.notificationTime), cronData, 'notificationTime')
  }
}

/**
 * 是否存在定时任务
 * @param cronData  定时任务
 * @returns {{reminderIndex: number, notificationIndex: number, notificationTime: boolean, reminderTime: boolean}}
 */
export function hasCron(cronData) {
  // 是否允许创建，默认false为不存在
  const cronStatus = {
    reminderIndex: 0,
    hasReminder: false,
    notificationIndex: 0,
    hasNotification: false
  }
  for (let i = 0; i < store.getters.queueCron.length; i++) {
    const cron = store.getters.queueCron[i]
    if (cron.cronData.id === cronData.id) {
      if (cron.status === 'reminderTime') {
        cronStatus.reminderIndex = i
        cronStatus.hasReminder = true
      }
      if (cron.status === 'notificationTime') {
        cronStatus.notificationIndex = i
        cronStatus.hasNotification = true
      }
    }
  }
  return cronStatus
}
