<template>
    <div>
        <el-card class="app-container">
            <sticky class="sub-navbar" style="margin-bottom: 20px;">
                <el-button size="small" type="primary" icon="el-icon-upload2" @click="save">
                    保存
                </el-button>
                <el-button v-show="status === 'update'" size="small" type="danger" icon="el-icon-delete" @click="del">
                    删除
                </el-button>
            </sticky>
            <el-form ref="urlLib" :model="urlLib" class="el-form" label-position="left" label-width="100px">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="网名" prop="remark">
                            <el-input v-model="urlLib.remark" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="网址" prop="url">
                            <el-input v-model="urlLib.url" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="图标网址" prop="iconUrl">
                            <el-input v-model="urlLib.iconUrl" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-checkbox-group v-model="classifys">
                    <el-row :gutter="24" v-for="first in classifyFirstLevel" :key="first.id">
                        <el-col :span="12">
                            <el-form-item :label="first.label">
                                <el-checkbox v-for="second in getSecondLevel(first.id)" :key="second.id" :label="second.label" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-checkbox-group>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { get, del, save, update } from '@/api/url'
import { getAll } from '@/api/classify'
import { query, delList, saveList } from '@/api/urlClassifyLib'
import Sticky from '@/components/Sticky'

export default {
  name: 'Url',
  components: { Sticky },
  data() {
    return {
      urlLib: {},
      status: 'create',
      classifys: [],
      hasClassify: [],
      // 当前用户所有的网址分类标签
      sysClassifys: [{ name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' },
        { name: '标签四', type: 'warning' },
        { name: '标签五', type: 'danger' }],
      inputVisible: false,
      inputValue: '',
      allClassify: [],
      classifyFirstLevel: [],
      classifyLibIds: []
    }
  },
  created() {
    console.log(this.$route)
    if (this.$route.params.id) {
      this.status = 'update'
      get(this.$route.params.id).then(data => {
        this.urlLib = data.obj
      })
    }
    getAll({}).then(data => {
      this.allClassify = data.list
      this.classifyFirstLevel = data.list.filter(classify => !classify.parentId)
      query({ libId: this.$route.params.id }).then(data => {
        data.list.forEach(urlClassifyLib => {
          const classify = this.allClassify.filter(classify => classify.id === urlClassifyLib.classifyId)[0]
          if (classify) {
            this.classifys.push(classify.label)
          }
        })
        this.classifyLibIds = data.list.map(urlClassifyLib => urlClassifyLib.id)
      })
    })
  },
  methods: {
    getSecondLevel(parentId) {
      return this.allClassify.filter(classify => classify.parentId === parentId)
    },
    del() {
      del(this.urlLib.id).then(data => {
        console.log(data)
      })
    },
    save() {
      // 将选中的分类标签转换为id
      const classifyIds = []
      this.classifys.forEach(label => {
        const level = this.allClassify.filter(second => second.label === label)[0]
        if (level) {
          classifyIds.push({ libId: this.urlLib.id, classifyId: level.id })
        }
      })
      if (this.status === 'create') {
        save(this.urlLib).then(data => {
          this.urlLib.id = data.id
          classifyIds.forEach(urlClassifyLib => {
            urlClassifyLib.libId = data.id
          })
          saveList(classifyIds).then(data => {
            this.$message.success('操作成功')
          })
        })
      } else {
        update(this.urlLib).then(data => {
          if (this.classifyLibIds.length) {
            delList(this.classifyLibIds).then(data => {
              saveList(classifyIds).then(data => {
                this.$message.success('操作成功')
              })
            })
          } else {
            saveList(classifyIds).then(data => {
              this.$message.success('操作成功')
            })
          }
        })
      }
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(tag) {
      this.classifys.splice(this.classifys.indexOf(tag), 1)
    },
    handleInputConfirm() {
      if (this.inputValue) {
        this.classifys.push({ name: this.inputValue })
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>
    .el-card .el-card__body{
        padding-top: 0px;
    }
    .el-tag {
        margin: auto 5px;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
