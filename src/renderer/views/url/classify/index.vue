<template>
    <div>
        <el-card class="app-container">
            <sticky class="sub-navbar" style="margin-bottom: 20px;">
                <el-button size="small" type="primary" icon="el-icon-upload2" @click="save">
                    保存
                </el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="del">
                    删除
                </el-button>
                <el-button size="small" type="success" icon="el-icon-edit" @click="showAddDialog">
                    添加分类
                </el-button>
            </sticky>
            <el-form ref="urlLib" :model="urlLib" class="el-form" label-position="left" label-width="100px">
                <el-row :gutter="24" v-for="first in classifyFirstLevel" :key="first.id">
                    <el-col :span="12">
                        <el-form-item :label="first.label">
                            <el-tag
                                    v-for="second in getSecondLevel(first.id)"
                                    :key="second.name"
                                    :type="second.type"
                                    @close="handleClose(second)">
                                {{second.label}}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-dialog :visible.sync="dialogVisible" title="分类级别" @closed="closed">
            <el-form ref="classify" :model="classify" :rules="rules" class="el-form" label-position="left" label-width="100px">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="分类名称" prop="label">
                            <el-input v-model="classify.label" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="一级分类" prop="parentId">
                            <el-select v-model="classify.parentId" clearable placeholder="请选择上一级（可选填）">
                                <el-option v-for="obj in classifyFirstLevel" :key="obj.label" :label="obj.label" :value="obj.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closed">取 消</el-button>
                <el-button type="primary" @click="saveClassify">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { get, del, save, update, getAll } from '@/api/classify'
import Sticky from '@/components/Sticky'

export default {
  name: 'Classify',
  components: { Sticky },
  data() {
    return {
      urlLib: {},
      status: 'create',
      classifys: [],
      dialogVisible: false,
      allClassify: [],
      classifyFirstLevel: [],
      classify: {
        label: null,
        parentId: null
      },
      rules: {
        label: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.status = 'update'
      get(this.$route.params.id).then(data => {
        this.urlLib = data.obj
      })
    }
    this.getAll()
  },
  methods: {
    getAll() {
      getAll().then(data => {
        this.allClassify = data.list
        this.classifyFirstLevel = data.list.filter(classify => !classify.parentId)
      })
    },
    del() {
      del(this.urlLib.id).then(data => {
        console.log(data)
      })
    },
    save() {
      save(this.classify).then(() => {
        this.dialogVisible = false
        this.getAll()
      })
    },
    update() {
      update(this.urlLib).then(data => {
        console.log(data)
      })
    },
    handleClose(tag) {
      this.classifys.splice(this.classifys.indexOf(tag), 1)
    },
    showAddDialog() {
      this.dialogVisible = true
    },
    saveClassify() {
      this.$refs.classify.validate((valid) => {
        if (valid) {
          this.save()
        }
      })
    },
    closed() {
      this.$refs.classify.resetFields()
    },
    getSecondLevel(parentId) {
      return this.allClassify.filter(classify => classify.parentId === parentId)
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
