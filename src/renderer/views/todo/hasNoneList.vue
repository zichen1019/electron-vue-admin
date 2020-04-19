<template>
    <div class="app-container">
        <!-- 添加查询按钮，移除刷新按钮 -->
        <sticky style="margin-bottom: 10px;">
            <div class="sub-navbar">
                <router-link to="/todo/create/0" class="link-type">
                    <el-button size="small" type="primary" icon="el-icon-circle-plus-outline">
                        新建
                    </el-button>
                </router-link>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteTodo">
                    删除
                </el-button>
            </div>
        </sticky>
        <el-form>
            <el-form-item>
                <el-input v-model="listQuery.search.title" placeholder="标题" style="width: 200px;" clearable />
                <el-input v-model="listQuery.search.matter" placeholder="事项" style="width: 200px;" clearable />
                <br />
                <el-button size="small" type="primary" icon="el-icon-search" @click="getTodo">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <el-table ref="todoMatterList" :data="todoMatterList" @row-click="onRowClick">
            <el-table-column align="center" type="selection" label="序号" />
            <el-table-column align="center" type="index" label="序号" />
            <el-table-column align="center" prop="title" label="标题" />
            <el-table-column align="center" prop="matter" label="事项" />
            <el-table-column align="center" prop="reminderTime" label="提醒">
                <template slot-scope="{ row }">
                    <el-date-picker v-if="row.edit" v-model="row.reminderTime" type="datetime" placeholder="选择日期时间" />
                    <span v-else>{{ row.reminderTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="notificationTime" label="通知">
                <template slot-scope="{ row }">
                    <template v-if="row.edit">
                        <el-date-picker v-model="row.notificationTime" type="datetime" placeholder="选择日期时间" />
                    </template>
                    <template v-else>
                        {{ row.notificationTime }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isTop" label="置顶">
                <template slot-scope="{ row }">
                    <el-switch v-model="row.isTop" active-color="#13ce66" inactive-color="#ff4949" disabled />
                </template>
            </el-table-column>
            <el-table-column align="center" prop="priority" label="优先级">
                <template slot-scope="{ row }">
                    <el-rate v-model="row.priority" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled />
                </template>
            </el-table-column>
            <el-table-column align="center" prop="sort" label="排序" />
            <el-table-column align="center" prop="access" label="操作" fixed="right">
                <template slot-scope="{ row }">
                    <router-link :to="'/todo/create/'+row.id" class="link-type">
                        <el-button size="mini" type="primary" icon="el-icon-edit" circle />
                    </router-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getTodo, deleteTodo } from '@/api/todo'
import Sticky from '@/components/Sticky'

export default {
  name: 'TodoMatterHasNoneList',
  components: { Sticky },
  data() {
    return {
      listQuery: {
        search: {}
      },
      todoMatterList: []
    }
  },
  created() {
    this.getTodo()
  },
  methods: {
    getTodo() {
      getTodo({
        userId: this.$store.getters.userId
      }).then(res => {
        this.todoMatterList = res.list
      })
    },
    onRowClick(row) {
      this.$refs.todoMatterList.toggleRowSelection(row)
    },
    deleteTodo() {
      deleteTodo(this.$refs.todoMatterList.selection.map(row => { return row.id })).then(res => {
        if (res.success === 200) {
          this.$message.success('删除成功')
          this.$router.go(-1)
        } else {
          this.$message.error('删除失败')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
