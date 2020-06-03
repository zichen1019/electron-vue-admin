<template>
    <div class="app-container">
        <el-card>
            <div slot="header" class="clearfix">
                <span>网址分类</span>
                <el-input placeholder="请输入内容" v-model="query.urlRemark" @keyup.enter.native="changeClassify" style="width: 50%;margin-left: 20%;">
                    <el-button slot="append" icon="el-icon-search" @click="changeClassify" />
                </el-input>
            </div>
            <el-form ref="urlSearch" :model="query" class="el-form" label-position="left" label-width="100px">
                <el-checkbox-group v-model="query.classifyLabels" @change="changeClassify">
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
        <el-card>
            <el-table ref="urlList" :data="urlList">
                <el-table-column align="center" type="selection" />
                <el-table-column align="center" type="index" label="序号" />
                <el-table-column align="center" prop="remark" label="名称" />
                <el-table-column align="center" prop="url" label="网址" />
                <el-table-column align="center" prop="access" label="操作" fixed="right">
                    <template slot-scope="{ row }">
                        <router-link :to="'/url/create/'+row.id" class="link-type">
                            <el-button size="mini" type="primary" icon="el-icon-edit" circle />
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import { queryList } from '@/api/url'
import { getAll } from '@/api/classify'

export default {
  name: 'UrlList',
  data() {
    return {
      urlList: [],
      query: {
        pageSize: 1,
        pageRow: 10,
        classifyLabels: []
      },
      classifys: [],
      classifyFirstLevel: []
    }
  },
  created() {
    getAll().then(data => {
      this.allClassify = data.list
      this.classifyFirstLevel = data.list.filter(classify => !classify.parentId)
    })
    this.queryList()
  },
  methods: {
    queryList() {
      queryList(this.query).then(data => {
        this.urlList = data.list
      })
    },
    getSecondLevel(parentId) {
      return this.allClassify.filter(classify => classify.parentId === parentId)
    },
    changeClassify() {
      this.pageSize = 1
      this.queryList()
    }
  }
}
</script>

<style scoped>
</style>
