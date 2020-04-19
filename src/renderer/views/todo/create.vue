<template>
    <div class="app-container">
        <el-form label-position="left" label-width="80px">
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="标题">
                        <el-input v-model="todoMatter.title" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="4">
                    <el-form-item label="提醒时间">
                        <el-date-picker v-model="todoMatter.reminderTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="通知时间">
                        <el-date-picker v-model="todoMatter.notificationTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="4">
                    <el-form-item label="通知方式">
                        <el-select v-model="todoMatter.mode">
                            <el-option v-for="(mode, index) in modes" :key="index" :label="mode.label" :value="mode.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <template v-if="todoMatter.mode === 1">
                    <el-col :span="4">
                        <el-form-item label="提示音">
                            <el-switch v-model="todoMatter.isPromptTone" active-color="#13ce66" inactive-color="#ff4949" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="通知图标">
                            <el-input v-model="todoMatter.icon" placeholder="请输入网址" />
                        </el-form-item>
                    </el-col>
                </template>
                <template v-else-if="todoMatter.mode === 2">
                    <el-col :span="8">
                        <el-form-item label="通知音乐">
                            <el-input v-model="todoMatter.music" placeholder="请输入网址" />
                        </el-form-item>
                    </el-col>
                </template>
                <template v-else-if="todoMatter.mode === 3">
                    <el-col :span="8">
                        <el-form-item label="邮箱通知">
                            <el-input v-model="todoMatter.mail" placeholder="请输入账号" />
                        </el-form-item>
                    </el-col>
                </template>
            </el-row>
            <el-form-item label="置顶">
                <el-switch v-model="todoMatter.isTop" active-color="#13ce66" inactive-color="#ff4949" />
            </el-form-item>
            <el-form-item label="优先级">
                <el-rate v-model="todoMatter.priority" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="todoMatter.sort" :min="1" />
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="todoMatter.state" active-color="#13ce66" inactive-color="#ff4949" />
            </el-form-item>
            <el-form-item label="事项">
                <markdown-editor ref="markdownEditor" v-model="todoMatter.matter" language="zh" height="300px" />
            </el-form-item>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-button type="success" icon="el-icon-refresh" @click="save">
                        提交
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="del">
                        删除
                    </el-button>
                    <el-button type="warning" icon="el-icon-back" @click="cancel">
                        取消
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import { saveTodo, updateTodo, deleteTodo, getInfoTodo } from '@/api/todo'
import MarkdownEditor from '@/components/MarkdownEditor'
import { createToDoCron, updateCron } from '@/utils/cron'

export default {
  name: 'TodoMatter',
  components: { MarkdownEditor },
  data() {
    return {
      state: 'create',
      todoMatter: {
        userId: this.$store.getters.userId,
        isTop: 0,
        state: 0
      },
      modes: [{ label: '系统通知', value: 1 }, { label: '软件通知', value: 2 }, { label: '邮件通知', value: 3 }]
    }
  },
  created() {
    this.state = this.$route.params.id && this.$route.params.id !== '0' ? 'edit' : 'create'
    if (this.state === 'edit') {
      this.get()
    }
  },
  methods: {
    get() {
      getInfoTodo(this.$route.params.id).then(data => {
        this.todoMatter = data.todo
      })
    },
    save() {
      if (this.state === 'edit') {
        updateTodo(this.todoMatter).then(res => {
          if (res.success === 200) {
            this.$message.success('更新成功')
            updateCron(this.todoMatter)
          } else {
            this.$message.error('更新失败')
          }
        })
      } else {
        saveTodo(this.todoMatter).then(res => {
          if (res.success === 200) {
            this.$message.success('保存成功')
            this.todoMatter.id = res.id
            createToDoCron(new Date(this.todoMatter.reminderTime), this.todoMatter, 'reminderTime')
            createToDoCron(new Date(this.todoMatter.notificationTime), this.todoMatter, 'notificationTime')
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    },
    del() {
      deleteTodo(this.todoMatter.id).then(res => {
        if (res.success === 200) {
          this.$message.success('删除成功')
          this.$router.go(-1)
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
