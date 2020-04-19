<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <span v-if="item.redirect === 'noredirect' || index === levelList.length - 1" class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  mounted() {
    const that = this
    that.$store.getters.vue.$on('reload', function() {
      that.reload()
    })
    that.$store.getters.vue.$on('closeCurrentRouter', function() {
      that.closeCurrentRouter()
    })
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched)
      }
      this.levelList = matched
    },
    reload() {
      const route = {
        path: this.$route.path.toString(),
        name: this.$route.name.toString(),
        query: this.$utils.deepCopy(this.$route.query),
        params: this.$utils.deepCopy(this.$route.params)
      }
      new Promise(resolve => {
        this.$router.push({ path: '/' })
        resolve()
      }).then(() => {
        this.$router.push(route)
      })
    },
    closeCurrentRouter() {
      this.levelList.splice(this.levelList.length - 1, 1)
      let tempRouter = { path: '/' }
      if (this.levelList.length) {
        tempRouter = {
          path: this.levelList[this.levelList.length - 1].path,
          query: this.levelList[this.levelList.length - 1].query
        }
      }
      this.$router.push(tempRouter)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
