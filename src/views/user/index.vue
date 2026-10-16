<template>
  <div class="page-container">
    <el-card class="page-card" shadow="never">
      <!-- 工具栏 -->
      <div class="toolbar">
        <el-input
          v-model="searchText"
          placeholder="请输入用户名"
          prefix-icon="el-icon-search"
          clearable
          @clear="handleSearch"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询用户</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAdd">添加用户</el-button>
      </div>

      <!-- 用户表格 -->
      <el-table :data="pagedList" stripe border>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="password" label="密码" min-width="110" />
        <el-table-column prop="email" label="邮箱" min-width="160" />
        <el-table-column prop="registerTime" label="注册日期" min-width="170" />
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="480px">
      <el-form ref="userForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
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
export default {
  name: 'UserManage',
  data() {
    return {
      searchText: '',
      page: 1,
      pageSize: 5,
      dialogVisible: false,
      isEdit: false,
      form: {
        id: null,
        username: '',
        password: '',
        email: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    list() {
      return this.$store.state.users.list
    },
    filteredList() {
      const kw = this.searchText.trim()
      if (!kw) return this.list
      return this.list.filter(item => item.username.includes(kw))
    },
    pagedList() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredList.slice(start, start + this.pageSize)
    },
    dialogTitle() {
      return this.isEdit ? '编辑用户' : '添加用户'
    }
  },
  methods: {
    handleSearch() {
      this.page = 1
    },
    openAdd() {
      this.isEdit = false
      this.form = { id: null, username: '', password: '', email: '' }
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.userForm && this.$refs.userForm.clearValidate())
    },
    openEdit(row) {
      this.isEdit = true
      this.form = { ...row }
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.userForm && this.$refs.userForm.clearValidate())
    },
    handleSave() {
      this.$refs.userForm.validate(valid => {
        if (!valid) return
        if (this.isEdit) {
          this.$store.dispatch('users/updateUser', this.form)
          this.$message.success('修改成功')
        } else {
          this.$store.dispatch('users/addUser', this.form)
          this.$message.success('添加成功')
        }
        this.dialogVisible = false
      })
    },
    handleDelete(row) {
      this.$confirm(`确定要删除用户「${row.username}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('users/deleteUser', row.id)
          this.$message.success('删除成功')
          // 若当前页被删空则回退一页
          if (this.pagedList.length === 0 && this.page > 1) {
            this.page -= 1
          }
        })
        .catch(() => {})
    }
  }
}
</script>
