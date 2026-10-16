<template>
  <div class="page-container">
    <el-card class="page-card" shadow="never">
      <!-- 工具栏 -->
      <div class="toolbar">
        <el-select v-model="searchType" placeholder="全部题型" clearable @change="handleSearch">
          <el-option v-for="t in questionTypes" :key="t" :label="t" :value="t" />
        </el-select>
        <el-input
          v-model="searchText"
          placeholder="请输入题目关键字"
          prefix-icon="el-icon-search"
          clearable
          @clear="handleSearch"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询题目</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAdd">添加题目</el-button>
      </div>

      <!-- 题目表格 -->
      <el-table :data="pagedList" stripe border>
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="content" label="题目内容" min-width="240" show-overflow-tooltip />
        <el-table-column prop="type" label="题型" width="90" align="center">
          <template slot-scope="scope">
            <el-tag :type="typeTag(scope.row.type)" size="small">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="chapter" label="章节" width="90" align="center" />
        <el-table-column prop="difficulty" label="难度" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="difficultyTag(scope.row.difficulty)" size="small">{{ scope.row.difficulty }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="答案" width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{ formatAnswer(scope.row) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredList.length"
          :page-sizes="[5, 10, 20]"
          :current-page.sync="page"
          :page-size.sync="pageSize"
        />
      </div>
    </el-card>

    <!-- 添加 / 编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="620px" top="6vh">
      <el-form ref="questionForm" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="题型" prop="type">
          <el-radio-group v-model="form.type" @change="onTypeChange">
            <el-radio-button v-for="t in questionTypes" :key="t" :label="t">{{ t }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="题目内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="3"
            placeholder="请输入题目内容"
          />
        </el-form-item>

        <el-form-item label="所属章节" prop="chapter">
          <el-select v-model="form.chapter" placeholder="请选择章节" style="width: 100%">
            <el-option v-for="c in chapters" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>

        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="form.difficulty" placeholder="请选择难度" style="width: 100%">
            <el-option v-for="d in difficulties" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>

        <!-- 选项：单选 / 多选 -->
        <el-form-item v-if="isChoice" label="选项" prop="options">
          <div class="options-editor">
            <div v-for="(opt, index) in form.options" :key="index" class="option-row">
              <span class="option-letter">{{ letters[index] }}</span>
              <el-input v-model="form.options[index]" :placeholder="`请输入选项 ${letters[index]}`" />
              <el-button
                v-if="form.options.length > 2"
                type="danger"
                icon="el-icon-close"
                circle
                size="mini"
                @click="removeOption(index)"
              />
            </div>
            <el-button
              v-if="form.options.length < 6"
              type="primary"
              plain
              size="small"
              icon="el-icon-plus"
              @click="addOption"
            >
              添加选项
            </el-button>
          </div>
        </el-form-item>

        <!-- 答案：单选 -->
        <el-form-item v-if="form.type === '单选题'" label="正确答案" prop="answer">
          <el-radio-group v-model="form.answer">
            <el-radio v-for="(opt, index) in form.options" :key="index" :label="letters[index]">
              {{ letters[index] }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 答案：多选 -->
        <el-form-item v-if="form.type === '多选题'" label="正确答案" prop="answer">
          <el-checkbox-group v-model="answerArray">
            <el-checkbox v-for="(opt, index) in form.options" :key="index" :label="letters[index]">
              {{ letters[index] }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 答案：判断 -->
        <el-form-item v-if="form.type === '判断题'" label="正确答案" prop="answer">
          <el-radio-group v-model="form.answer">
            <el-radio label="正确">正确</el-radio>
            <el-radio label="错误">错误</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 答案：填空 / 简答 -->
        <el-form-item
          v-if="form.type === '填空题' || form.type === '简答题'"
          label="参考答案"
          prop="answer"
        >
          <el-input
            v-model="form.answer"
            type="textarea"
            :rows="3"
            :placeholder="form.type === '填空题' ? '请输入填空答案' : '请输入参考答案'"
          />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { QUESTION_TYPES, DIFFICULTIES, CHAPTERS } from '@/store/modules/questions'

export default {
  name: 'QuestionManage',
  data() {
    return {
      questionTypes: QUESTION_TYPES,
      difficulties: DIFFICULTIES,
      chapters: CHAPTERS,
      letters: ['A', 'B', 'C', 'D', 'E', 'F'],
      searchType: '',
      searchText: '',
      page: 1,
      pageSize: 5,
      dialogVisible: false,
      isEdit: false,
      form: this.emptyForm(),
      rules: {
        type: [{ required: true, message: '请选择题型', trigger: 'change' }],
        content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
        chapter: [{ required: true, message: '请选择章节', trigger: 'change' }],
        difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }],
        answer: [{ required: true, message: '请设置正确答案', trigger: 'change' }]
      }
    }
  },
  computed: {
    list() {
      return this.$store.state.questions.list
    },
    isChoice() {
      return this.form.type === '单选题' || this.form.type === '多选题'
    },
    filteredList() {
      const kw = this.searchText.trim()
      return this.list.filter(item => {
        const matchType = !this.searchType || item.type === this.searchType
        const matchKw = !kw || item.content.includes(kw)
        return matchType && matchKw
      })
    },
    pagedList() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredList.slice(start, start + this.pageSize)
    },
    dialogTitle() {
      return this.isEdit ? '编辑题目' : '添加题目'
    },
    // 多选答案使用数组便于 checkbox-group 绑定
    answerArray: {
      get() {
        return this.form.answer ? String(this.form.answer).split(',').filter(Boolean) : []
      },
      set(val) {
        this.form.answer = val.join(',')
      }
    }
  },
  methods: {
    emptyForm() {
      return {
        id: null,
        type: '单选题',
        content: '',
        options: ['', '', '', ''],
        answer: '',
        chapter: '',
        difficulty: '简单'
      }
    },
    onTypeChange(type) {
      if (type === '单选题' || type === '多选题') {
        this.form.options = ['', '', '', '']
        this.form.answer = ''
      } else if (type === '判断题') {
        this.form.options = ['正确', '错误']
        this.form.answer = ''
      } else {
        this.form.options = []
        this.form.answer = ''
      }
    },
    addOption() {
      if (this.form.options.length < 6) {
        this.form.options.push('')
      }
    },
    removeOption(index) {
      this.form.options.splice(index, 1)
      if (this.form.type === '单选题' && this.form.answer === this.letters[index]) {
        this.form.answer = ''
      }
    },
    handleSearch() {
      this.page = 1
    },
    openAdd() {
      this.isEdit = false
      this.form = this.emptyForm()
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.questionForm && this.$refs.questionForm.clearValidate())
    },
    openEdit(row) {
      this.isEdit = true
      this.form = {
        id: row.id,
        type: row.type,
        content: row.content,
        options: row.options ? row.options.slice() : [],
        answer: row.answer,
        chapter: row.chapter,
        difficulty: row.difficulty
      }
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.questionForm && this.$refs.questionForm.clearValidate())
    },
    handleSave() {
      this.$refs.questionForm.validate(valid => {
        if (!valid) return
        const payload = { ...this.form }
        // 单选/多选/判断之外的题型不需要保存选项
        if (!this.isChoice && this.form.type !== '判断题') {
          payload.options = []
        }
        if (this.isEdit) {
          this.$store.dispatch('questions/updateQuestion', payload)
          this.$message.success('修改成功')
        } else {
          this.$store.dispatch('questions/addQuestion', payload)
          this.$message.success('添加成功')
        }
        this.dialogVisible = false
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除该题目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('questions/deleteQuestion', row.id)
          this.$message.success('删除成功')
          if (this.pagedList.length === 0 && this.page > 1) {
            this.page -= 1
          }
        })
        .catch(() => {})
    },
    typeTag(type) {
      const map = { 单选题: 'success', 多选题: 'warning', 判断题: 'info', 填空题: 'primary', 简答题: 'danger' }
      return map[type] || 'info'
    },
    difficultyTag(diff) {
      const map = { 简单: 'success', 中等: 'warning', 困难: 'danger' }
      return map[diff] || 'info'
    },
    formatAnswer(row) {
      if (row.type === '单选题' || row.type === '多选题') {
        return String(row.answer)
          .split(',')
          .map(l => l.trim())
          .filter(Boolean)
          .join('、')
      }
      return row.answer
    }
  }
}
</script>

<style scoped>
.options-editor {
  width: 100%;
}

.option-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.option-letter {
  width: 26px;
  color: #606266;
  font-weight: 600;
}

.option-row .el-input {
  margin-right: 8px;
}
</style>
