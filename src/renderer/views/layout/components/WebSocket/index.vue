<template>

</template>

<script>
  export default {
    name: 'WebSocket',
    data() {
      return {
        webSocketClient: null,
        lockReconnect: false, // 是否真正建立连接
        timeout: 300 * 1000, // 五分钟一次心跳
        timeoutObj: null, // 心跳心跳倒计时
        serverTimeoutObj: null, // 心跳倒计时
        timeoutNum: null // 断开 重连倒计时
      }
    },
    created() {
      this.initWebSocket()
    },
    destroyed: function() {
      // 离开页面生命周期函数
      this.websocketclose()
    },
    methods: {
      initWebSocket() {
        console.log('init WebSocket')
        // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        switch (process.env.NODE_ENV) {
          case 'development':
            this.webSocketClient = new WebSocket('ws://192.168.1.2:9091/api/websocket/' + this.$store.getters.userId + '/0')
            break
          case 'production':
            this.webSocketClient = new WebSocket('ws://122.51.198.52:8080/api/WebSocket/' + this.$store.getters.userId + '/0')
            break
          default:
            this.webSocketClient = new WebSocket('ws://192.168.1.2:9091/api/WebSocket/' + this.$store.getters.userId + '/0')
            break
        }
        this.webSocketClient.onopen = this.websocketonopen
        this.webSocketClient.onerror = this.websocketonerror
        this.webSocketClient.onmessage = this.websocketonmessage
        this.webSocketClient.onclose = this.websocketclose
      },
      websocketonopen() {
        console.log('WebSocket连接成功')
        this.start()
      },
      start() { // 开启心跳
        const self = this
        self.timeoutObj && clearTimeout(self.timeoutObj)
        self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
        self.timeoutObj = setTimeout(function() {
          // 这里发送一个心跳，后端收到后，返回一个心跳消息，
          if (self.webSocketClient.readyState === 1) { // 如果连接正常
            self.webSocketClient.send()
          } else { // 否则重连
            self.reconnect()
          }
          self.serverTimeoutObj = setTimeout(function() {
            // 超时关闭
            self.webSocketClient.close()
          }, self.timeout)
        }, self.timeout)
      },
      reconnect() { // 重新连接
        const that = this
        if (that.lockReconnect) {
          return
        }
        that.lockReconnect = true
        // 没连接上会一直重连，设置延迟避免请求过多
        that.timeoutnum && clearTimeout(that.timeoutnum)
        that.timeoutnum = setTimeout(function() {
          // 新连接
          that.initWebSocket()
          that.lockReconnect = false
        }, 5000)
      },
      reset() { // 重置心跳
        const that = this
        // 清除时间
        clearTimeout(that.timeoutObj)
        clearTimeout(that.serverTimeoutObj)
        // 重启心跳
        that.start()
      },
      websocketonerror: function(e) {
        console.log('WebSocket连接发生错误' + e)
        // 重连
        this.reconnect()
      },
      websocketonmessage: function(e) {
        console.log('WebSocket消息')
        console.log(e)
        const result = e.data
        // 收到服务器信息，心跳重置
        this.reset()
        switch (result.link) {
          case 'Connect':
            // TODO 连接成功时
            break
          case 'Timeout':
            // TODO 超时
            break
        }
      },
      websocketclose: function(e) {
        console.log('connection closed (' + e.code + ')')
        // 重连
        this.reconnect()
      }
    }
  }
</script>

<style scoped>

</style>
